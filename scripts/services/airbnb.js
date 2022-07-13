/**
  input: []
  params:
    - name: url
      label: 'URL'
      value:
        - control: 'textbox'
          value: 'https://www.airbnb.com/rooms/50990584?check_in=2021-07-30&check_out=2021-08-27&display_extensions%5B0%5D=MONTHLY_STAYS&translate_ugc=false&federated_search_id=d0ce3d1e-8f6b-4efd-860f-53174e7cbbb2&source_impression_id=p3_1626728857_zeUaPyyCjVG%2BBJsw&guests=1&adults=1'
    - name: maxReviews
      label: 'Review Comments'
      value:
        - control: 'number'
          value: 30
          lazy: true
  output:
    - data
    - screenshot
    - error
    - log
  environment: worker
  cache: true
**/

var error = null;

if (url.startsWith('www.')) url = 'https://' + url;
if (url.includes('manage-your-space')) {
  const propertyId = url.replace(/.*manage-your-space\/|\/.*/g, '');
  url = 'https://www.airbnb.com/rooms/' + propertyId;
}

// Replace all not .com urls to .com ones
const urlParts = url.split('/');
const urlIndex = urlParts.findIndex(v => v.includes('airbnb'));

if (urlIndex !== -1) {
  urlParts[urlIndex] = urlParts[urlIndex].replace(/airbnb.*/, 'airbnb.com');
  url = urlParts.join('/');
}

const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ]
});

const page = await browser.newPage();
const width = 1440;
const height = 820;

await page.setRequestInterception(false);
await page.setDefaultNavigationTimeout(0);
await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36');
await page.setViewport({
  width: width,
  height: height,
  deviceScaleFactor: 0.5,
});

var sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

await page.goto(url, {
  waitUntil: 'networkidle2',
  timeout: 40000
});

var log = [];
page.on('console', message => {
  const text = message.text().toString();
  log.push(text)
});

await sleep(500);
await page.evaluate(() => {
  window.scrollTo(0, document.body.offsetHeight / 2);
});
await sleep(500);
await page.evaluate(() => {
  window.scrollTo(0, 0);
});
await sleep(500);

await page.screenshot({ path: `screenshot.jpg`, fullPage: true });

try {
  const pageData = await page.evaluate(async () => {
    console.log('Retrieving title');
    const header = document.querySelector('div[data-section-id="TITLE_DEFAULT"]');
    
    if (!header) {
      return {
        error: 'This URL does not seem like a valid listing, are you using the correct URL?'
      }
    }

    const title = header.querySelector('h1');

    // Superhost badge may be present in the header
    console.log('Checking superhost badge');
    var superhost = false;
    const hostOverviewBlock = document.querySelector('div[data-plugin-in-point-id="HOST_OVERVIEW"]');
    if (hostOverviewBlock == null) {
      console.log('Failed to find host overview block, trying with header');
      superhost = [...header.querySelectorAll('span')].findIndex(el => el.innerText === 'Superhost') !== -1;
    }
    else {
      console.log('Found superhost badge'+ hostOverviewBlock );
      superhost = [...hostOverviewBlock.querySelectorAll('*')];
      // superhost = [...hostOverviewBlock.querySelectorAll('*')].findIndex(el => el.innerText === 'Superhost') !== -1;
   
   }

    // If description block is short we can get it now
    // otherwise we need to open popup window first, we'll do it later
    console.log('Retrieving description block');
    const descBlock = document.querySelector('div[data-section-id="DESCRIPTION_DEFAULT"] > div');
    const descLink = descBlock
      ? [...descBlock.querySelectorAll('a')].find(el => el.innerText === 'read more')
      : null;
    const description = descBlock
      ? (descLink ? {} : { main: descBlock.innerText })
      : {};

    // Get number of beds, rooms, etc in overview block — 4th element
    console.log('Retrieving number of beds and rooms');
    const overviewBlocks = document.querySelectorAll('div[data-section-id="OVERVIEW_DEFAULT"] div:last-child');
    const overviewText = overviewBlocks && overviewBlocks.length >= 4 ? overviewBlocks[3].innerText : '';
    const overviewResult = overviewText.split(' · ').reduce((res, value) => {
      const [count, label] = value.split(' ');
      res[label] = parseFloat(count);
      return res;
    }, {});

    // Rating and reviews count is shown in a specific format: " ()"
    const [ratingBlock, ratingDetailsBlock] = document.querySelectorAll('div[data-section-id="REVIEWS_DEFAULT"] > div');
    var [rating, reviews] = ['—', '0'];
    if (!ratingBlock) {
      console.log('Looks like property has no reviews yet.')
    }
    else {
      const ratingBlockText = ratingBlock.querySelector('h2 span:last-child div span').innerText;
      console.log('Extracting rating and reviews from ' + ratingBlockText);
      [rating, reviews] = ratingBlockText.split(/[ \(\)]/g).filter(x => x.length > 0 && !x.includes('·') && !Number.isNaN(x));
      console.log('Found rating(' + rating + ') and reviews(' + reviews + ')');
    }

    // Details are stored in a sequence of divs
    const ratingDetails = ratingDetailsBlock
      ? [...ratingDetailsBlock.querySelectorAll(':scope > div > div > div')]
          .reduce((res, el) => {
            const data = el.innerText.split('\n');

            res[data[0]] = data[1];
            return res;
          }, {})
      : {};

    // Location section is an array of divs:
    // 0 - title, 1 - first location string (if location is not exact),
    // 2 - map, 3 - second location string (if location is exact)
    console.log('Retrieving location');
    var locationText = null;
    var locationExact = null;

    var locationBlocks = document.querySelectorAll('div[data-section-id="LOCATION_DEFAULT"] > div');
    if (locationBlocks.length == 0) locationBlocks = document.querySelectorAll('div[data-section-id="LOCATION_DEFAULT"] > section > div');
    if (locationBlocks.length > 0) {
      const locationLabel = locationBlocks.length > 3 && !!locationBlocks[3].innerText;
      locationText = locationLabel ? locationBlocks[3].innerText : locationBlocks[1].innerText
    }

    console.log('Retrieving exact location');
    const locationTagsParent = document.querySelectorAll('div[data-section-id="LOCATION_DEFAULT"]');
    if (locationTagsParent.length > 0) {
      const locationTags = locationTagsParent[0].getElementsByTagName('*');
      locationExact = [...locationTags].filter(e => e.innerText && e.innerText.includes('Exact location provided after booking')).length == 0;
    }

    // Host section consists of two rows (title and info)
    // Info block has one or two columns (one — if there is no profile text)
    console.log('Retrieving host section');
    var hostName = 'unknown'
    const [hostNameBlock, hostInfoBlock] = document.querySelectorAll('div[data-section-id="HOST_PROFILE_DEFAULT"] section > div');
    var hasProfileText = false;
    if (!hostNameBlock) {
      console.log('Error: Failed to retrieve host name block');
    }
    else {
      hostName = hostNameBlock.querySelector(':scope h2').innerText.replace('Hosted by ', '');
      hasProfileText = hostInfoBlock.childNodes.length > 1;
    }

    if (hasProfileText) {
      console.log('Clicking more profile link');
      const profileMoreLink = [...hostInfoBlock.querySelectorAll('a')].find(el => el.innerText === 'read more');

      if (profileMoreLink) {
        await profileMoreLink.click();
        await sleep(500);
      }
    }

    const hostProfileText = hasProfileText
      ? [...hostInfoBlock.childNodes[0].childNodes].slice(1).map(v => v.innerText).join('\n')
      : '—';

    // Response rate and time are items in list element (the only one there)
    console.log('Retrieving response rate and time');
    let responseRate, responseTime;
    if (!hostInfoBlock) {
      console.log('Error: Failed to retrieve response rate and time from missing host block');
    }
    else {
      const hostInfoItems = hostInfoBlock.querySelectorAll('ul > li');
      
      [...hostInfoItems].forEach(el => {
        const text = el.innerText;

        if (text.includes('Response rate')) {
          responseRate = text.replace('Response rate: ', '');
        } else if (text.includes('Response time')) {
          responseTime = text.replace('Response time: ', '');
        }
      });
    }

    // Minimum nights info is not avaliable by default but is visible as a warning if selected dates range is smaller
    // We try to get the warning or return null for it
    console.log('Retrieving minimum nights');
    const bookBlock = document.querySelector('div[data-section-id="BOOK_IT_SIDEBAR"] #bookItTripDetailsError');
    const minimumNights = bookBlock && bookBlock.innerText.includes('Minimum stay')
      ? bookBlock.innerText.split(' ').reverse()[1]
      : null;

    // Cancellation policy depends on selected dates so if no dates were provided we return null
    const policiesBlock = document.querySelector('div[data-section-id="POLICIES_DEFAULT"]');
    const cancelBlock = [...policiesBlock.querySelectorAll('div')]
      .find(el => el.innerText === 'Cancellation policy').parentNode;

    // Cancellation text can be of 3 or 4 divs: first is the title, last is the link
    const cancelTexts = cancelBlock.querySelectorAll('div');
    const cancellation = !cancelTexts[1].innerText.includes('Add your trip dates')
      ? [...cancelTexts].slice(1, 3).map(el => el.innerText).join('\n')
      : null;

    const cancelDateRG = /Free cancellation until (.*) on (.*$)/g;
    const cancelDateMatch = cancelDateRG.exec(cancelTexts[1].innerText);

    return {
      title: title.innerText,
      superhost,
      description,
      overview: overviewResult,
      rating: {
        All: rating,
        ...ratingDetails,
      },
      reviews,
      answered: 0,
      location: {
        name: locationText,
        exact: locationExact,
      },
      host: {
        name: hostName,
        textFilled: hasProfileText,
        text: hostProfileText,
        responseRate,
        responseTime,
      },
      minimumNights,
      cancellation: {
        text: cancellation,
        date: cancelDateMatch && cancelDateMatch.length > 2 ? cancelDateMatch[2] : null
      },
    };
  });

  if (pageData.error) throw pageData.error;

  // Get description details opening a popup.
  log.push('Retriving description using popup');
  const descShowMore = await page.evaluate(async () => {
    const descBlock = document.querySelector('div[data-section-id="DESCRIPTION_DEFAULT"] > div');
    const showMore = [...descBlock.querySelectorAll('span')].find(el => el.innerText === 'Show more');
    console.log('Looking for description details ' + (!!showMore ? 'succeeded' : 'failed'));
    if (!!showMore) await showMore.click();
    return !!showMore;
  });
  if (descShowMore) {
    log.push('Clicking show more description');
    await page.waitForFunction(() => document.querySelector('div[data-testid="modal-container"]'));
    await sleep(200);
    
    log.push('Retrieving description details');
    pageData.description = await page.evaluate(async () => {
      const modal = document.querySelector('div[data-testid="modal-container"]');
      const divs = modal.querySelectorAll('section > div');
      console.log('Description sections: ' + [...divs].length);

      // First div is a title, second is the description text
      const descPairs = [...divs].filter((e,i) => i > 0).map(e => {
        const titleEl = e.querySelector('div');
        const descEl = e.querySelector('span');
        return [ titleEl ? titleEl.innerText : 'main', descEl ? descEl.innerText : '' ];
      });

      const descWithTitles = Object.fromEntries(descPairs);
      console.log('Description section titles: ' + Object.keys(descWithTitles).join(', '));

      await modal.querySelector('button').click();
      return descWithTitles;
    });
    await page.waitForFunction(() => !document.querySelector('div[data-testid="modal-container"]'));
  }

  // Get location details opening a popup.
  log.push('Retriving description location using popup');
  const locShowMore = await page.evaluate(async () => {
    const descBlock = document.querySelector('a[data-testid="location-modal-button"]');
    if (descBlock) {
      const showMore = [...descBlock.querySelectorAll('span')].find(el => el.innerText === 'Show more');
      console.log('Looking for location details ' + (!!showMore ? 'succeeded' : 'failed'));
      if (!!showMore) await showMore.click();
      return !!showMore;
    }
  });
  if (locShowMore) {
    log.push('Clicking show more location');
    await page.waitForFunction(() => document.querySelector('div[data-testid="modal-container"]'));
    await sleep(200);
    
    log.push('Retrieving location details');
    const locDetails = await page.evaluate(async () => {
      const modal = document.querySelector('div[data-testid="modal-container"]');
      const locWhere = [...modal.querySelectorAll('div')]
        .find(el => el.textContent === 'Where you’ll be').parentElement.children;
   
      var locDetails = {};
      if (locWhere.length > 1) locDetails['Location'] = locWhere[1].innerText
      if (locWhere.length > 2) locDetails['Getting around'] = locWhere[2].querySelector('span').innerText

      console.log('Description location titles: ' + Object.keys(locDetails).join(', '));
      await modal.querySelector('button').click();
      return locDetails;
    });

    pageData.description = Object.assign(pageData.description, locDetails);

    await page.waitForFunction(() => !document.querySelector('div[data-testid="modal-container"]'));
  }

  // last description block 'During your stay'
  const descDuringStay = await page.evaluate(async () => {
    const descDuringStayEl = [...document.body.querySelectorAll('div')]
        .find(el => el.textContent === 'During your stay')
    if (descDuringStayEl) {
      return descDuringStayEl.parentElement.querySelector('span').innerText
    }
  });
  if (descDuringStay) pageData.description['During your stay'] = descDuringStay;

  // Count answers to the reviews
  log.push('Counting reviews: ' + pageData.reviews);
  if (pageData.reviews > 0) {
    try {
      log.push('Finding review details');
      await page.evaluate(async () => {
        const reviewsBlock = document.querySelector('div[data-section-id="REVIEWS_DEFAULT"]');
        // some pages with a few reviews don't have a 'show all' reviews
        await [...reviewsBlock.querySelectorAll('a')].find(el => el.innerText.includes('Show more')).click();
      });
      await page.waitForFunction(() => document.querySelector('div[data-testid="modal-container"]'));

      // Autoscroll to the bottom of modal with reviews
      log.push('Scrolling across reviews');
      pageData.comments = await page.evaluate(async (maxReviews) => {
        const modal = document.querySelector('div[data-testid="modal-container"] > div > div:last-child');

        return await new Promise((resolve, reject) => {
          let totalHeight = 0;
          const distance = 100;

          const timer = setInterval(() => {
            const { scrollHeight } = modal;
            
            try {
              modal.scrollBy(0, distance);
              totalHeight += distance;

              const commentsDivs = document.querySelector('div[data-testid="modal-container"]')
                .querySelectorAll('div[data-review-id]')
              const comments = [...commentsDivs]
                .filter((e,i) => i >= 1 && e.childElementCount >= 2)
                .map(e => e.children[1].innerText);

              if (totalHeight >= scrollHeight || comments.length <= 0 || comments.length >= maxReviews) {
                clearInterval(timer);
                resolve(comments);
              }
            }
            catch(e) {
              clearInterval(timer);
              resolve([ e.toString() ]);
            }
          }, 400);
        });
      }, maxReviews);
      log.push('Completed comments: ' + pageData.comments.length);

      pageData.maxReviews = maxReviews;
      pageData.answered = await page.evaluate(async () => {
        const modal = document.querySelector('div[data-testid="modal-container"]');
        const divs = modal.querySelectorAll('section > div > div:last-child > div:last-child > div:last-child > div > div');

        const count = [...divs].reduce((res, v) => {
          if (v.childElementCount === 3) res += 1;
          return res;
        }, 0);

        await modal.querySelector('button').click();
        return count;
      });

      await page.waitForFunction(() => !document.querySelector('div[data-testid="modal-container"]'));
    }
    catch(e) {
      log.push('ERROR: Failed to retrieve reviews: ' + e.toString())
    }
  }

  // We can get all photos at once from the popup window on small screens (for example: 800x800)
  // To open the popup we need to click on a button
  log.push('Changing resolution to retrieve photos');
  await page.setViewport({ width: width / 2, height });
  await page.waitForFunction(() => document.querySelector('div[data-section-id="HERO_DEFAULT"]'));
  await page.evaluate(async () => {
    await document.querySelector('div[data-section-id="HERO_DEFAULT"] a').click();
  });

  await page.waitForFunction(() => document.querySelector('div[data-testid="modal-container"] section img'));

  log.push('Extracting photos with scrolling');
  await page.evaluate(async () => {
    var sleep = function(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    await sleep(100);
    
    const photosTour = document.querySelector('div[aria-label="Photo tour"]');
    if (!photosTour) console.log('ERROR: Failed to find photo tour scrollable area');
    else {
      photosTour.children[2].scrollTo(0, photosTour.children[2].scrollHeight / 2);
      await sleep(100);

      photosTour.children[2].scrollTo(0, photosTour.children[2].scrollHeight);
    }
  });

  pageData.photos = await page.evaluate(async () => {
    const modal = document.querySelector('div[data-testid="modal-container"]');
    const imgs = [...modal.querySelectorAll('section img')].map(el => ({
      src: el.src,
      caption: el.alt,
      width: el.clientWidth,
      height: el.clientHeight,
    }));

    await modal.querySelector('button').click();
    return imgs;
  });
  console.log('Found ' + pageData.photos.length + ' photos');

  await page.waitForFunction(() => !document.querySelector('div[data-testid="modal-container"]'));

  await sleep(100);

  // Get the list of amenities
  log.push('Retrieving amenities');
  pageData.amenities = {};
  try {
    await page.evaluate(async () => {
      const amenitiesBlock = document.querySelector('div[data-section-id="AMENITIES_DEFAULT"]');
      await [...amenitiesBlock.querySelectorAll('a')].find(el => el.innerText.includes('Show all')).click();
    });
    await page.waitForFunction(() => document.querySelector('div[data-testid="modal-container"]'));

    pageData.amenities = await page.evaluate(async () => {
      const modal = document.querySelector('div[data-testid="modal-container"]');
      const divs = modal.querySelectorAll('section > div > div:last-child > div > div');
      const data = [...divs].slice(1).reduce((res, v) => {
        const [label, ...texts] = v.innerText.split('\n');
        res[label] = texts;
        return res;
      }, {});

      await modal.querySelector('button').click();
      return data;
    });
  }
  catch(e) {
    log.push('ERROR: Failed to retrieve amenities: ' + e.toString())
  }

  await page.waitForFunction(() => !document.querySelector('div[data-testid="modal-container"]'));
  
  pageData.dates = [new Date(), new Date()];
  if (url.includes('check_in') && url.includes('check_out')) {
    const cii = url.indexOf('check_in=') + 9;
    const cio = url.indexOf('check_out=') + 10;

    pageData.dates = [new Date(url.slice(cii, cii + 10)), new Date(url.slice(cio, cio + 10))];
  }

  if (pageData.cancellation.date) {
    let year = pageData.dates[0].getFullYear();

    if (pageData.cancellation.date.includes('Dec') && pageData.dates[0].getMonth() === 0) {
      year -= 1;
    }
    pageData.cancellation.date = new Date(`${pageData.cancellation.date} ${year}`);
  }

  // extract calendar availability
  pageData.calendar = await page.evaluate(async () => {
    
    console.log('Extracting calendar availability');
    const calendar = document.querySelector('div[data-testid="inline-availability-calendar"]');
 
    return [...calendar.querySelectorAll(':scope td > div')]
      .map(e => {
        const date = e.getAttribute('data-testid').replace('calendar-day-', '');
        const blocked = e.getAttribute('data-is-day-blocked');
        return { date: date, blocked: blocked };
      });
  });

  data = {
    ...pageData,
  }
}
catch(e) {
  data = [];
  error = e.message ? e.message : e.toString();
}

await page.close();
await browser.close();

const contents = fs.readFileSync('screenshot.jpg', {encoding: 'base64'});
screenshot = 'data:image/jpg;base64,' + contents;
/**
  input: []
  params:
    - name: url
      label: 'URL'
      value:
        - control: 'textbox'
          value: 'https://www.airbnb.com/rooms/37122502?adults=1&check_in=2021-06-15&check_out=2021-06-30&federated_search_id=a27511d1-5e3c-4f77-bc38-d04021496f33&source_impression_id=p3_1619770772_APoVRlvJula3Uj5Z&guests=1'
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
  environment: worker
  cache: true
**/

var error = null;

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
    const header = document.querySelector('div[data-section-id="TITLE_DEFAULT"]');
    const title = header.querySelector('h1');

    // Superhost badge may be present in the header
    const superhost = [...header.querySelectorAll('span')].findIndex(el => el.innerText === 'Superhost') !== -1;

    // If description block is short we can get it now
    // otherwise we need to open popup window first, we'll do it later
    const descBlock = document.querySelector('div[data-section-id="DESCRIPTION_DEFAULT"] > div');
    const descLink = descBlock
      ? [...descBlock.querySelectorAll('a')].find(el => el.innerText === 'read more')
      : null;
    const description = descBlock
      ? (descLink ? '' : descBlock.innerText)
      : '-';

    // Get number of begs, rooms, etc in overview block — 4th element
    const overviewBlocks = document.querySelectorAll('div[data-section-id="OVERVIEW_DEFAULT"] div:last-child');
    const overviewText = overviewBlocks && overviewBlocks.length >= 4 ? overviewBlocks[3].innerText : '';
    const overviewResult = overviewText.split(' · ').reduce((res, value) => {
      const [count, label] = value.split(' ');
      res[label] = parseFloat(count);
      return res;
    }, {});

    // Rating and reviews count is shown in a specific format: " ()"
    const [ratingBlock, ratingDetailsBlock] = document.querySelectorAll('div[data-section-id="REVIEWS_DEFAULT"] > div');
    const [rating, reviews] = ratingBlock
      ? ratingBlock.querySelector('h2 span:last-child div span').innerText.split(/[ \(\)]/g).filter(Boolean)
      : ['—', '0'];

    // Details are stored in a sequence of divs
    const ratingDetails = ratingDetailsBlock
      ? [...ratingDetailsBlock.querySelectorAll(':scope > div > div > div')]
          .reduce((res, el) => {
            const data = el.innerText.split('\n');

            res[data[0]] = data[1];
            return res;
          }, {})
      : {};

    // Location secition is an array of divs:
    // 0 - title, 1 - first location string (if location is not exact),
    // 2 - map, 3 - second location string (if location is exact)
    const locationBlocks = document.querySelectorAll('div[data-section-id="LOCATION_DEFAULT"] > div');
    const exact = locationBlocks.length > 3 && !!locationBlocks[3].innerText;

    // Host section consists of two rows (title and info)
    // Info block has one or two columns (one — if there is no profile text)
    const [hostNameBlock, hostInfoBlock] = document.querySelectorAll('div[data-section-id="HOST_PROFILE_DEFAULT"] > section > div');
    const hostName = hostNameBlock.querySelector(':scope h2').innerText.replace('Hosted by ', '');
    const hasProfileText = hostInfoBlock.childNodes.length > 1;

    if (hasProfileText) {
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
    const hostInfoItems = hostInfoBlock.querySelectorAll('ul > li');
    let responseRate, responseTime;

    [...hostInfoItems].forEach(el => {
      const text = el.innerText;

      if (text.includes('Response rate')) {
        responseRate = text.replace('Response rate: ', '');
      } else if (text.includes('Response time')) {
        responseTime = text.replace('Response time: ', '');
      }
    });

    // Minimum nights info is not avaliable by default but is visible as a warning if selected dates range is smaller
    // We try to get the warning or return null for it
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
        name: exact ? locationBlocks[3].innerText : locationBlocks[1].innerText,
        exact,
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

  // If we could not get description without opening a popup
  // Find a link, click on it, wait for modal to open and get inner text
  if (pageData.description === '') {
    await page.evaluate(async () => {
      const descBlock = document.querySelector('div[data-section-id="DESCRIPTION_DEFAULT"] > div');
      await [...descBlock.querySelectorAll('a')].find(el => el.innerText === 'read more').click();
    });
    await page.waitForFunction(() => document.querySelector('div[data-testid="modal-container"]'));

    pageData.description = await page.evaluate(async () => {
      const modal = document.querySelector('div[data-testid="modal-container"]');
      const divs = modal.querySelectorAll('section > div');

      // First div is a title, second is the description text
      const text = divs.length > 1
        ? divs[1].innerText
        : '';

      await modal.querySelector('button').click();
      return text;
    });
    await page.waitForFunction(() => !document.querySelector('div[data-testid="modal-container"]'));
  }

  // We can get all photos at ones from the popup window on small screens (for example: 800x800)
  // To open the popup we need to click on a button
  await page.setViewport({ width: width / 2, height });
  await page.waitForFunction(() => document.querySelector('div[data-section-id="HERO_DEFAULT"]'));
  await page.evaluate(async () => {
    await document.querySelector('div[data-section-id="HERO_DEFAULT"] a').click();
  });

  await page.waitForFunction(() => document.querySelector('div[data-testid="modal-container"] section img'));

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

  await page.waitForFunction(() => !document.querySelector('div[data-testid="modal-container"]'));

  // Get the list of amenities
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

  await page.waitForFunction(() => !document.querySelector('div[data-testid="modal-container"]'));

  // Count answers to the reviews
  console.log('airbnb: Counting reviews: ' + pageData.reviews);
  if (pageData.reviews > 0) {
    await page.evaluate(async () => {
      const reviewsBlock = document.querySelector('div[data-section-id="REVIEWS_DEFAULT"]');
      await [...reviewsBlock.querySelectorAll('a')].find(el => el.innerText.includes('Show all')).click();
    });
    await page.waitForFunction(() => document.querySelector('div[data-testid="modal-container"]'));

    // Autoscroll to the bottom of modal with reviews
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

            const divs = document.querySelector('div[data-testid="modal-container"]')
              .querySelectorAll('section > div > div:last-child > div:last-child > div:last-child > div > div');

            const comments = [...divs]
              // skip rating and amenities divs and ensure has comment
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
    console.log('airbnb: Completed comments: ' + pageData.comments.length);

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

  data = {
    ...pageData,
  }
}
catch(e) {
  error = e.message;
}

await page.close();
await browser.close();

const contents = fs.readFileSync('screenshot.jpg', {encoding: 'base64'});
screenshot = 'data:image/jpg;base64,' + contents;
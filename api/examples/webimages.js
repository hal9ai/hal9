
var webimages = async function(puppeteer, fs, url) {
  // inputs
  var scrollIters = 10;
  var minSize = 50;

  // outputs
  var data = [];
  var screenshot = '';

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
    // reduce scale factor to reduce screenshot size
    deviceScaleFactor: 0.2,
  });

  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 10000 + scrollIters * 10
  });

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  var images = [];

  while(scrollIters > 0) {
    const result = await page.evaluate((minSize, scrollIters) => {
      const allImages = [...document.querySelectorAll('img')]
        .filter(img => img.src && (minSize == 0 || (img.clientWidth > minSize && img.clientHeight > minSize)))
        .map(img => ({ class: img.classList[0] || '', src: img.src }))
        .reduce((res, img) => {
          if (res[img.class]) res[img.class].push({ url: img.src });
          else res[img.class] = [{ url: img.src }];
          return res;
        }, {});

      const sortedKeys = Object.keys(allImages)
        .sort((a, b) => allImages[b].length - allImages[a].length);

      var images = sortedKeys.length ? allImages[sortedKeys[0]] : [];

      if (document.body.scrollHeight > document.body.offsetHeight + document.documentElement.scrollTop) {
        window.scrollTo(0, document.documentElement.scrollTop + document.body.offsetHeight/2);
      }
      else {
        scrollIters = 0;
      }

      return { images: images, scrollIters: scrollIters };
    }, minSize, scrollIters);

    scrollIters--;
    images.push(...result.images)

    await sleep(300);
  }

  var uniques = {}
  images.forEach(img => uniques[img.url] = true);
  images = Object.keys(uniques).map(e => { return { url: e }; });

  await page.screenshot({ path: 'screenshot.jpg', fullPage: true });

  await page.close();
  await browser.close();

  data = images;

  const contents = fs.readFileSync('screenshot.jpg', {encoding: 'base64'});
  screenshot = 'data:image/jpg;base64,' + contents;

  return { data: data, screenshot: screenshot };
};

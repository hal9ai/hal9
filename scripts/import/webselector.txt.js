/**
  input: []
  params:
    - name: url
      label: 'URL'
      value:
        - control: 'textbox'
          value: 'https://news.hal9.com/'
          lazy: true
    - name: className
      label: 'Selector Query'
      value:
        - control: 'textbox'
          value: '.text-left h3, .text-left p, .newsletter-feed a img'
          lazy: true
    - name: columnName
      label: 'Column Name'
      value:
        - control: 'textbox'
          value: 'image, title, date'
          lazy: true
    - name: hasHeader
      label: 'Has Header'
      value:
        - control: 'select'
          value: 'yes'
          values:
            - name: 'yes'
              label: Yes
            - name: 'no'
              label: No
    - name: scrollIters
      label: 'Scroll Iterations'
      value:
        - control: 'number'
          value: 2
          lazy: true
    - name: scrollClick
      label: 'Scroll Click'
      value:
        - control: 'textbox'
          value: ''
          lazy: true
  output:
    - data
    - log
  environment: worker
  deps: ['https://cdnjs.cloudflare.com/ajax/libs/d3/6.2.0/d3.min.js']
  cache: true
**/

columnName = columnName ? columnName : '';

const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--lang=en-US'
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
  deviceScaleFactor: 0.5,
});

await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US' });
await page.goto(url, {
  waitUntil: 'domcontentloaded',
});

var log = [];
page.on('console', message => log.push(message.text().toString()));

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
while(!scrollClick && scrollIters > 1) {
  await page.evaluate((scrollClick) => {
    window.scrollTo(0, document.documentElement.scrollTop + document.body.offsetHeight/2);
  });

  scrollIters = scrollIters - 1;
  await sleep(100);
}

async function extractTable() {
  return page.evaluate((className, columnName) => {
    try {
      console.log('Extracting class ' + className);

      var allClasses = className.split(',')
      var totalClasses = allClasses.length;
      var columnNames = columnName ? columnName.split(',') : [];
      if (columnName.length > 0) console.log('Using ' + columnNames + ' column names');

      var resultStructure = [...document.querySelectorAll(className)]

      console.log('Found ' + resultStructure.length + ' elements');

      var header = 'text\n';
      if (totalClasses > 1) {
        console.log('Found ' + totalClasses + ' classes');

        header = [...new Array(totalClasses)].map((e, i) => {
          if (columnName.length > 0 && i <= columnNames.length) return columnNames[i].trim();
          return 'text' + i
        }).join('§') + '\n';
      }

      const chunk = (arr, size) =>
      Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
      );

      var csv = header + chunk(resultStructure, totalClasses)
        .map(group => {
          return group.map((_) => {
            if (_.nodeName == 'IMG') return _.src;
            if (_.nodeName == 'A') return _.href;
            return _.innerText.replace(/\n/g, ' ')
          })
        })
        .map(group => group.join('§'))
        .join('\n');

      console.log('Retrieved ' + csv.length + ' characters');

      return [ csv, null ];
    }
    catch(e) {
      console.log(e.toString());
      return [ '', e.toString() ];
    }
  }, className, columnName)
}

await sleep(1000);

var [ table, error ]  = await extractTable();
if (scrollClick) {
  scrollIters = scrollIters - 1;
  
  while(scrollIters > 0) {
    var stop = await page.evaluate((scrollClick) => {
      var click = document.getElementsByClassName(scrollClick);
      var end = click.length == 0 || click[0].disabled == true;

      if (!end) click[0].click();
      return end;
    }, scrollClick);
    if (stop) break;

    await sleep(1000);

    var [ tableIter, error ]  = await extractTable();
    if (error) break;

    tableIter = tableIter.split('\n').slice(1).join('\n');
    table = table + '\n' + tableIter;

    scrollIters = scrollIters - 1;
    await sleep(100);
  }
}

if (error) throw error;

await page.screenshot({ path: `screenshot.jpg`, fullPage: true });

await page.close();
await browser.close();

const dsvParser = d3.dsvFormat('§');
data = dsvParser.parse(table);

const contents = fs.readFileSync('screenshot.jpg', {encoding: 'base64'});
screenshot = 'data:image/jpg;base64,' + contents;

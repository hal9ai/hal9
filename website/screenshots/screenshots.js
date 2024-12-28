const puppeteer = require('puppeteer');

const actions = [
  // Explore
  { query: '#sidebar-help',            screenshot: 'hal9-explore',            waitfor: '#sidebar-explore' },
  { query: '.driver-popover-next-btn', screenshot: 'hal9-explore-hal9',       waitfor: '#explore-first' },

  // Chat
  { query: '.driver-popover-next-btn', screenshot: 'hal9-chat-welcome' ,      waitfor: '#chat-welcome'},
  { query: '.driver-popover-next-btn', screenshot: 'hal9-chat-textarea' ,     waitfor: '#chat-textarea'},
  { query: '.driver-popover-next-btn', screenshot: 'hal9-chat-submit' ,       waitfor: '#chat-submit'},
  { query: '.driver-popover-next-btn', screenshot: 'hal9-chat-user',          waitfor: '.driver-popover-next-btn'},
  { query: '.driver-popover-next-btn', screenshot: 'hal9-chat-ai' ,           waitfor: '.driver-popover-next-btn'},

  // Create
  { query: '.driver-popover-next-btn', screenshot: 'hal9-create',             waitfor: '#sidebar-create'},
  { query: '.driver-popover-next-btn', screenshot: 'hal9-create-name' ,       waitfor: '#create-name'},
  { query: '.driver-popover-next-btn', screenshot: 'hal9-create-description', waitfor: '#create-description'},
  { query: '.driver-popover-next-btn', screenshot: 'hal9-create-data',        waitfor: '#create-data'},
  { query: '.driver-popover-next-btn', screenshot: 'hal9-create-message',     waitfor: '#create-welcome'},
  { query: '.driver-popover-next-btn', screenshot: 'hal9-create-create',      waitfor: '#create-create'},

  // AIs
  { query: '.driver-popover-next-btn', screenshot: 'hal9-ais',                waitfor: '#sidebar-ais'},
];

async function performActions(page, actions, suffix) {
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .driver-popover-navigation-btns {
        max-height: 0;
        opacity: 0;
      }
    `;
    document.head.appendChild(style);
  });

  for (var action of actions) {
    await page.waitForSelector(action.query);
    await page.click(action.query);
    await page.waitForTimeout(200);
    await page.waitForSelector(action.waitfor);
    await page.waitForTimeout(500);

    await page.screenshot({ path: `../static/screenshots/${action.screenshot}${suffix}.png` });
  }
}

async function collectScreenshots(dark) {
  const browser = await puppeteer.launch();
  
  try {
    const page = await browser.newPage();

    await page.setViewport({ width: 1024, height: 600 });
    await page.goto('http://localhost:5000/explore?guest', { waitUntil: 'networkidle2' });
    
    if (dark) await page.click('#switch-dark');
    await page.waitForTimeout(500);

    await page.screenshot({ path: '../static/screenshots/hal9-start-' + (dark ? 'dark' : 'light') + '.png' });

    await performActions(page, actions, dark ? '-dark' : '-light');

    console.log('Screenshot taken and saved as screenshot.png');
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
}

(async () => {
  await collectScreenshots(false);
  await collectScreenshots(true);
})();
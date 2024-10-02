const puppeteer = require('puppeteer');
const dayjs = require('dayjs');
const localeData = require('dayjs/plugin/localeData');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
require('dayjs/locale/ja');

dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone); 
dayjs.locale('ja'); 

exports.scrapeUrl = async (req, res) => {
  const { email, password, action } = req.body;

  if (!email || !password || !action) {
    return res.status(400).send('Missing parameters');
  }

  const result = await scrapeJobcan(email, password, action);
  return res.status(200).send({ 'result': result });
};

async function scrapeJobcan(email, password, action) {
  let browser = null
  try {
    // Puppeteerでヘッドレスブラウザを起動
    browser = await puppeteer.launch({
      executablePath: puppeteer.executablePath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // ジョブカンのログインページにアクセス
    await page.goto('https://id.jobcan.jp/users/sign_in');

    // ログインフォームに入力
    await page.type('#user_email', email);
    await page.type('#user_password', password);

    // ログインボタンをクリック
    await page.click('input[name="commit"]');
    await page.waitForNavigation();

    // 勤怠管理ページにアクセス
    await page.goto('https://ssl.jobcan.jp/jbcoauth/login');
    await page.waitForSelector('#working_status');

    // 勤務状態を取得
    const workingStatus = await page.$eval('#working_status', el => el.textContent?.trim() ?? '');

    let currentTime;

    if (action === 'punch_in') {
      if (workingStatus === '勤務中' || workingStatus === '退室中') {
        return '既に出勤中か退勤済みです';
      }

      // 出社時の処理

      currentTime = dayjs().format('HH:mm');
      return `成功: 出勤時間(${currentTime})`;
    } else if (action === 'punch_out') {
      if (workingStatus === '未出勤' || workingStatus === '退室中') {
        return '出勤していないか退勤済みです';
      }

      // 退勤時の処理

      return `成功: 退勤時間(${currentTime})`;
    }

    return '不明な操作';
  } catch (error) {
    console.error(error);
    return `失敗: ${error.message}`;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
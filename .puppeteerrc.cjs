const {join} = require ( 'path' ); 

/** 
* @type { import("puppeteer").Configuration } 
*/ 
module . exports = { 
  // Puppeteer のキャッシュの場所を変更します。
  cacheDirectory : join (__dirname, '.cache' , 'puppeteer' ), 
};
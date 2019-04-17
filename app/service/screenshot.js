'use strict'

const Service = require('egg').Service
const puppeteer = require('puppeteer')
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const APPKEY = "jingwhale";
const partTypeDefalt = {
    githubcommits:".commits-listing",
    tencentcommits:".commits-1uQ"
};
var partId = "";

var part = "";

var newPage = "";

var pathUrl = 'screenshot.png';


class ScreenshotService extends Service {
    async base64img(file){//生成base64
        let filePath = path.resolve(file);
        let data = fs.readFileSync( path.resolve(filePath));
        let imageData = sizeOf(filePath);
        var backData = {
            base64: data,
            width: imageData.width,
            height: imageData.height
        }
        backData.base64 = new Buffer(data).toString('base64');

        return backData;
    }

    async screenshot(payload) {
        const { ctx } = this;
        if(payload.appkey!=APPKEY){
            ctx.throw(404, 'appkey不正确！');
        }
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();

        if(payload.isPart){
            await page.goto(payload.url);
            page.setDefaultNavigationTimeout(0);
        }else{
            await page.goto(payload.url,{waitUntil: 'networkidle0'});
        }

        if(payload.isPart){
            if(payload.partType==1){//自定义
                partId = payload.partId;
            }else{//默认
                partId = partTypeDefalt[payload.partType];
            }
            await page.waitForSelector(partId);
            part = await page.$(partId);
          	if(partId == ".commits-1uQ"){
               await page.waitForSelector("header");
               await page.evaluate(() => {
                     document.querySelector("header").style = "display:none";
                })
            }
        }

        newPage = payload.isPart ? part : page;

        // //调用页面内Dom对象的screenshot 方法进行截图
        try { // 截图 
            var pageOptions = {
                path: pathUrl,
                type: 'png',
                fullPage: true,
                omitBackground: true
            };
            var partOptions = {
                path: pathUrl,
                type: 'png'
            }
            var option = payload.isPart ? partOptions : pageOptions;
            await newPage.screenshot(option)
        }catch (e) {
            console.log('执行异常');
            ctx.throw(404, '执行异常')
        } finally {
            await browser.close();
        }
        var base64imgData = this.base64img(pathUrl)

        return base64imgData
    }
}

module.exports = ScreenshotService;

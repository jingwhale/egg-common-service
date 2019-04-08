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
        page.setDefaultNavigationTimeout(0);

        await page.setViewport({
            width: 1020,
            height: 2000
        });

        await page.goto(payload.url);

        var partId = payload.partId;
        if(payload.isPart){
            if(payload.partType===1){//自定义
                console.log(payload.partType)
            }else{//默认
                partId = 'div'+partTypeDefalt[payload.partType];
            }
            await page.waitFor(partId);
            part = await page.$(partId);
        }

        newPage = payload.isPart ? part : page;

        // //调用页面内Dom对象的screenshot 方法进行截图
        try { // 截图 
            await newPage.screenshot({path: pathUrl, type: 'png'})
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

module.exports = ScreenshotService

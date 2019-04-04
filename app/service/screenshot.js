'use strict'

const Service = require('egg').Service
const puppeteer = require('puppeteer')
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const APPKEY = "jingwhale";
const partTypeDefalt = {
    githubcommits:".commits-listing"
};
var part = "";

var newPage = "";

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
        var path = 'screenshot.png';
        
        await page.goto(payload.url);

        var partId = payload.partId;
        if(payload.isPart){
            if(payload.partType===1){//自定义
                console.log(payload.partType)
            }else{//默认
                partId = partTypeDefalt[payload.partType];
            }
            var partArr = await page.$$(partId);
            part = partArr[0];
        }

        newPage = payload.isPart ? part:page;

        // //调用页面内Dom对象的screenshot 方法进行截图
        try { // 截图 
            await newPage.screenshot({path: path, type: 'png'}).catch(err => {
                console.log(err);
                ctx.throw(404, '截图失败')
            });
        }catch (e) { 
            console.log('执行异常'); 
            ctx.throw(404, '执行异常')
        } finally { 
            await page.close();
            await browser.close();
        }
        var base64imgData = this.base64img(path)
        
        return base64imgData
    }
}

module.exports = ScreenshotService

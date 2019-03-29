'use strict'

const Service = require('egg').Service
const puppeteer = require('puppeteer')
const fs = require('fs');
const path = require('path');
const images = require("images");
const mineType = require('mime-types');
const APPKEY = "jingwhale";
const partTypeDefalt = {
    githubcommits:".commits-listing"
};
var part = "";

class ScreenshotService extends Service {
    async base64img(file){//生成base64
        let filePath = path.resolve(file);
        let data = fs.readFileSync( path.resolve(filePath));
        let imageData = images(filePath);
        var backData = {
            base64: data,
            width: imageData.width(),
            height: imageData.height()
        }
        backData.base64 = new Buffer(data).toString('base64');
        
        return backData;
    }

    async screenshot(payload) {
        const { ctx, service } = this
        if(payload.appkey!=APPKEY){
            ctx.throw(404, 'appkey不正确！');
        }
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        var path = 'screenshot.png'
        var backData = {};
        var id = payload.id
        
        await page.goto(payload.url);
        part = page;
        if(payload.isPart){
            if(payload.partType===1){
                console.log(payload.partType)
            }else{
                var partNode = partTypeDefalt[payload.partType];
                var partArr = await page.$$(partNode);
                part = partArr[0];
            }
        }
        
        // //调用页面内Dom对象的screenshot 方法进行截图
        try { // 截图 
            await part.screenshot({path: path, type: 'png'}).catch(err => {
                console.log('截图失败'); 
                console.log(err); 
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

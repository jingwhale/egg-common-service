'use strict'

const Service = require('egg').Service
const puppeteer = require('puppeteer')
const fs = require('fs');
const path = require('path');
const mineType = require('mime-types');

class ScreenshotService extends Service {
    async base64img(file){//生成base64
        let filePath = path.resolve(file);
        let data = fs.readFileSync( path.resolve(filePath));
        data = new Buffer(data).toString('base64');
        return data;
    }

    async screenshot(payload) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        var path = 'screenshot.png'
        var backData = {};
        
        await page.goto('https://www.baidu.com');
        let form = await page.$('#form');
        // //调用页面内Dom对象的screenshot 方法进行截图
        try { // 截图 
            await form.screenshot({path: path, type: 'png'}).catch(err => {
                console.log('截图失败'); 
                console.log(err); 
                backData = {
                    data: err
                }
            });
            await page.waitFor(5000); 
        }catch (e) { 
            console.log('执行异常'); 
        } finally { 
            await page.close();
            await browser.close(); 
        }
        
        backData = {
            data: this.base64img(path)
        }
        return backData
    }
}

module.exports = ScreenshotService

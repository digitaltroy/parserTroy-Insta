const express = require('express');
const app = express();
const ISDEV = 3000;
require('chromedriver');
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const map = webdriver.promise.map;
const Xvfb = require('xvfb');
const { Options } = require('selenium-webdriver/chrome');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/static'));

let inslinksarr = [];
let linkscounter = '';
let url ='';
let title = '';

const getInstagramlinks = async () => {
    let driver = new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(new Options().addArguments('--no-sandbox --disable-setuid-sandbox'))
        .build();
    let display = new Xvfb;
    let isurl = 'http://www.instagram.com/explore/tags/fifa2018';
    url = isurl;
    display.startSync();
    try {
        await driver.get(isurl);
        title = await driver.getTitle();
        // ищем все ссылки на странице по регулярному выражению
        let elems = driver.findElements(By.css('a[href^="/p/"]'));
        return await map(elems, e => e.getAttribute("href")).then((values) => {
            values.forEach((p) => {
                let str = '<a target="_blank" href="'+p+'">'+p+'</a>';
                inslinksarr.push(str);
            });
            linkscounter = values.length;
            console.log(values);
        });        
    } finally {
        driver.quit();
        display.stopSync();
    }
};

app.get('/', async (req, res) => {
    await getInstagramlinks();
    res.end('<div>selenium-webdriver find: <b>'+linkscounter + '</b> instagram tags links <br /> from <b>' + title + '</b> (' + url + ') : <p>' + inslinksarr.join("<br />")  + '</p></div>');
    // очищаем массив
    inslinksarr = [];
});

app.listen(ISDEV, '80.93.177.195', function () {
   console.log(`Server started on 80.93.177.195:${ISDEV}`); 
});
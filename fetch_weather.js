var request = require('request');
var fs = require('fs');
var util = require('util')

// https://api.caiyunapp.com/v2/m37ULZi6ThzsjVAl/116.443108,39.92147/forecast

var skycon = {
    CLEAR_DAY: "晴天",
    CLEAR_NIGHT: "晴夜",
    PARTLY_CLOUDY_DAY: "多云",
    PARTLY_CLOUDY_NIGHT: '多云',
    CLOUDY: '阴',
    RAIN:  '雨',
    SNOW: '雪',
    WIND: '风',
    FOG: '雾'
};


function fetchForecastData (host) {
    var options = {
        url: host + 'forecast'
    };
    return new Promise(function(resolve, reject) {

        request.get(options, function(err,httpResponse,body){
            if (err) {
                reject(err);
            }
            var info = JSON.parse(body);
            if (info.status == 'ok') {
                var description = info.result.hourly.description;
                resolve(description);
            }
            reject('error');
            
        })
    })
}

function fetchNowData (host) {
    var options = {
        url: host + 'realtime'
    };
    return new Promise(function(resolve, reject) {

        request.get(options, function(err,httpResponse,body){
            if (err) {
                reject(err);
            }
            var info = JSON.parse(body);
            if (info.status == 'ok') {
                var temperature = info.result.temperature;
                var pm25 = info.result.pm25;
                var skycon = info.result.skycon;
                var ret = {
                    temperature: temperature,
                    pm25: pm25,
                    skycon: skycon
                };

                resolve(ret);
            }
            reject('error');
            
        })
    })  
}

function Weather (token, longitude = '116.443108', latitude = '39.92147') {
    this.token = token;
    this.longitude = longitude;
    this.latitude = latitude;
    this.host = util.format('https://api.caiyunapp.com/v2/%s/%s,%s/', token, longitude, latitude);
}

Weather.prototype.fetch = function () {
    return Promise.all([fetchForecastData(this.host), fetchNowData(this.host)])
            .then(function (res) {
                var des = res[0];
                var now = res[1];
                var sky = skycon[now.skycon];
                var speech = util.format('北京现在温度为 %d 摄氏度，pm2.5为 %d，%s。今日天气预报: %s', now.temperature, now.pm25, sky, des);
                console.log(speech);
                return Promise.resolve(speech);
            }, function(error) {
                console.log(error);
                return Promise.reject(error);                
            })
}

module.exports = Weather;

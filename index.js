const BDSpeech = require('./baidu.js');
const Weather = require('./fetch_weather.js');
var config = require('./config.json');
const baidu_apiKey = config.baidu_apiKey;
const baidu_secretKey = config.baidu_secretKey;
const caiyun_apiToken = config.caiyun_apiToken;

const speech = new BDSpeech(baidu_apiKey, baidu_secretKey,'mplayer', __dirname + '/tmp')
var weather = new Weather(caiyun_apiToken);


weather.fetch()
.then(function(des) {
    return des;
})
.then(function(des) {
    console.log(des);    
    return speech.speak(des);
})
.then(function(res) {
    console.log('job done');
}, function(error) {
    console.log(error);
})
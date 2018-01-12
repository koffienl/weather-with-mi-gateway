const BDSpeech = require('./baidu.js');
const Weather = require('./fetch_weather.js');
const AudioConvert = require('./audio_convert.js')
var config = require('./config.json');
const baidu_apiKey = config.baidu_apiKey;
const baidu_secretKey = config.baidu_secretKey;
const caiyun_apiToken = config.caiyun_apiToken;

const log4js = require('log4js');
log4js.configure({
  appenders: { app: { type: 'file', filename: 'debug.log' } },
  categories: { default: { appenders: ['app'], level: 'debug' } }
});

const logger = log4js.getLogger('app');


const speech = new BDSpeech(baidu_apiKey, baidu_secretKey,'mplayer', __dirname + '/tmp')
var weather = new Weather(caiyun_apiToken);
var audioConvert = new AudioConvert();


weather.fetch()
.then(function(des) {
    return des;
})
.then(function(des) {
    console.log(des);    
    return speech.speak(des);
})
.then(function(res) {
    return res;
}, function(error) {
    console.log(error);
})
.then(function(res) {
    var folder = __dirname;
    var input = folder + '/tmp/temp.mp3';
    var output = folder + '/tmp/weather.aac';
    return audioConvert.convert(input, output);
})
.then(function (res) {
    console.log('job done');    
    logger.debug('job done.');    
}, function(err) {
    console.log(error);    
})
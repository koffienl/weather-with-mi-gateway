var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();

function audio_convert(input, output) {

    
    return new Promise(function(resolve, reject) {
        ffmpeg(input)
        // .audioCodec('aac')
        .outputOptions(
            '-c:a', 'libfdk_aac',
            '-profile:a', 'aac_he',
            '-b:a', '60k'
        )
        .on('end', function() {
            resolve(true);
          })
        .on('error', function(err) {
            console.log('an error happened: ' + err.message);
            reject(err);
        })
        .save(output);
    }) 
}



function AudioConvert () {

}

AudioConvert.prototype.convert = function (input, output) {
    return audio_convert(input, output)
}

module.exports = AudioConvert;


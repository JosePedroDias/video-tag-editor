var tesseract = require('node-tesseract');
var gm = require('gm');

/*
fps 29.97

frames
00302 001  10.076743410076745 0:10
11377 233 379.61294627961297  3:19



http://aheckmann.github.io/gm/
http://aheckmann.github.io/gm/docs.html
*/




var opts = {
	//l: 'deu',
    //psm: 6,
    //binary: '/usr/local/bin/tesseract'
};

// var file = '/shots/00700.png';
var file = '/test.jpg';

// Recognize text of any language in any format
tesseract.process(__dirname + file, opts, function(err, text) {
    if (err) {
        console.error(err);
    } else {
        console.log(text);
    }
});

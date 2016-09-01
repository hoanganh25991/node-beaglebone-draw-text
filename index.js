var b = require('bonescript');

var drawTxt = require('./draw-text-v2');

var Matrix = require('./led/matrix');

var matrix = new Matrix({
	pins: {
		data: 'P9_14',
		clock: 'P9_21',
		cs: 'P9_16'
	},
	devices: 4,
	controller: 'MAX 7219'
});

matrix.io = b;
matrix.MATRIX_CHARS = require('./led/led-chars').MATRIX_CHARS;
matrix.drawText = drawTxt.bind(matrix);

matrix.drawText('a.Torin');
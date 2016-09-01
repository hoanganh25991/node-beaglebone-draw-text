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

matrix.board = b;
// matrix.on();

// matrix.on();
//
// matrix.board = board;
//
//
matrix.drawText = drawTxt.bind(matrix);

matrix.drawText('abc');
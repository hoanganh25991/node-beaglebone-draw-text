var five = require('johnny-five');
var five = require('johnny-five');
var BeagleBone = require('beaglebone-io');

var board = new five.Board({
    io: new BeagleBone()
});
// var drawText = require('./draw-text');
var drawTxt = require('./draw-text-v2');

board.on('ready', function() {
	var matrix = new five.Led.Matrix({
		pins: {
			data: 'P9_15',
			clock: 'P9_25',
			cs: 'P9_23'
		},
		devices: 4
	});
	matrix.on();

	matrix.board = board;

	matrix.MATRIX_CHARS = five.LedControl.MATRIX_CHARS;

	matrix.drawText = drawTxt.bind(matrix);

	this.repl.inject({
		matrix: matrix
	});

});
var five = require('johnny-five');

var BeagleBone = require('./beaglebone-io');

var board = new five.Board({
    io: new BeagleBone()
});
// var drawText = require('./draw-text');
var drawTxt = require('./draw-text-v2');

board.on('ready', function() {
	var matrix = new five.Led.Matrix({
		pins: {
			data: 'P9_14',
			clock: 'P9_21',
			cs: 'P9_16'
		},
		devices: 4
	});
	matrix.on();

	matrix.board = board;

	matrix.MATRIX_CHARS = five.LedControl.MATRIX_CHARS;

	matrix.drawText = drawTxt.bind(matrix);
	
	// matrix.drawText('1234');
	// board.loop(1000, function(){
	// 	matrix.io.digitalWrite('P9_14', matrix.io.HIGH);
	// });
	

	this.repl.inject({
		matrix: matrix
	});

});
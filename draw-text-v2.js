var drawText = require('./draw-text');

var clearPreviousLoop;

var drawTxt = function(txt){
	var matrix = this;

	var buffer = require('./buffer')(
		txt,
		matrix.MATRIX_CHARS,
		matrix.devices
	);

	if(clearPreviousLoop){
		clearPreviousLoop();
	}

	matrix.board.loop(500, function(handler){
		// console.log(handler);
		clearPreviousLoop = handler;
		// matrix.handler = handler;

		drawText.apply(matrix, [buffer.spiData]);
		buffer.moveLeft();
	});
};

module.exports = drawTxt;
var drawText = require('./draw-text');

var clearPreviousLoop;


var drawTxt = function(txt){
	var matrix = this;
	
	matrix.board = {};
	
	matrix.board.loop = function(time, callback){
		var handler = function(){
			callback(function(){
				clearInterval(interval);
			});
		};
		
		var interval = setInterval(handler, time);
		return matrix.board;
	};

	var buffer = require('./buffer')(
		txt,
		matrix.MATRIX_CHARS,
		matrix.devices
	);

	if(clearPreviousLoop){
		clearPreviousLoop();
	}

	matrix.board.loop(0, function(handler){
		// console.log(handler);
		clearPreviousLoop = handler;
		// matrix.handler = handler;

		drawText.apply(matrix, [buffer.spiData]);
		buffer.moveLeft();
	});
};

module.exports = drawTxt;
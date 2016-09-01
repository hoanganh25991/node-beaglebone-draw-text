var spiData =   [ 21, 7, 15, 7, 0, 7, 17, 7 ];

matrix.io.digitalWrite(matrix.pins.cs, matrix.io.LOW);

for (var j = spiData.length; j > 0; j--) {
	matrix.board.shiftOut(matrix.pins.data, matrix.pins.clock, spiData[j - 1]);
}

matrix.io.digitalWrite(matrix.pins.cs, matrix.io.HIGH);
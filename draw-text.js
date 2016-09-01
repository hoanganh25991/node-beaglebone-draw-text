var drawText = function(spiData){
	var matrix = this;
	var totalByte = (spiData[0].length / 8);
	spiData.forEach(function(spiData){
		// spiData = [0,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0];
		// spiData = [va1, device1|val2, device2|val3, device3|val4, devices4]
		matrix.io.digitalWrite(matrix.pins.cs, matrix.io.LOW);

		//(val, device) * 4 => 2 * 4 = 8, spiData reverse
		//so start at last one
		for(var j = totalByte; j > 0; j--){
		// for(var j = 0; j < totalByte; j++){
			//seprate by each [8-bit]
			//read at 1st-2-3...-7
			for(var i = 0; i < 8; i++){
				matrix.io.digitalWrite(3, 0);
				matrix.io.digitalWrite(2, spiData[8 * (j - 1) + i]);
				// matrix.io.digitalWrite(2, spiData[8 * j + i]);
				matrix.io.digitalWrite(3, 1);
			}
		}

		matrix.io.digitalWrite(matrix.pins.cs, matrix.io.HIGH);
	});
};

module.exports = drawText;
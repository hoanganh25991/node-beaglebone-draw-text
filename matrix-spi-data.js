var transpose = require('./transpose');

var chunk = require('./chunk-array');

var buffer = function(txt, font){
	var dataArr;
	var memory;
	var spiArr;
	var buildSpiData;
	var moveLeft;

	//[][][][]=DC, the first one is the last one
	var charArr = txt.split('').reverse();

	dataArr = [];

	charArr.forEach(function(char){
		dataArr.push(font[char]);
		// [
		// 	[8, 9, 10, 11, 12, 13, 14, 15], //a character
		// 	[8, 9, 10, 11, 12, 13, 14, 15], //a character
		// 	[8, 9, 10, 11, 12, 13, 14, 15], //a character
		// 	[8, 9, 10, 11, 12, 13, 14, 15] //a character
		// ]
	});

	dataArr = transpose(dataArr);
	// [
	// 	[8, 8, 8, 8],   //all data for 4 devices in row 1
	// 					//=> spinData = [8, 1, 8, 1, 8, 1, 8, 1]
	// 	[9 , 9, 9, 9],
	// 	...
	// 	[15, 15, 15, 15]
	// ]

	// console.log(dataArr);

	dataArr.forEach(function(rowMutipleDevices){
		rowMutipleDevices.forEach(function(rowVal, index){
			var n = parseInt(rowVal, 10).toString(2);
			n = "00000000".substr(n.length) + n;
			var io = n.split('');
			io.forEach(function(bin, index){
				io[index] = Number(bin);
			});
			rowMutipleDevices[index] = io;
		});
	});
	// console.log(dataArr);
	// dataArr = [
	// 	[[0, 1, 0, 1, 0, 1, 0, 1], [0, 0, 0, 0, 0, 0, 0, 0],[...], [...]]
	// 	[[0, 1, 0, 1, 0, 1, 0, 1], [0, 0, 0, 0, 0, 0, 0, 0],[...], [...]]
	// 	...
	// 	[[0, 1, 0, 1, 0, 1, 0, 1], [0, 0, 0, 0, 0, 0, 0, 0],[...], [...]]
	// 	[[0, 1, 0, 1, 0, 1, 0, 1], [0, 0, 0, 0, 0, 0, 0, 0],[...], [...]]
	// ];

	memory = [];
	dataArr.forEach(function(rowValDevices, index){
		var tmp = [];
		rowValDevices.forEach(function(rowVal){
			tmp = tmp.concat(rowVal);
		});
		memory[index] = tmp;
	});
	// console.log(memory);

	spiArr = [1, 2, 3, 4, 5, 6, 7, 8];
	spiArr.forEach(function(rowVal, index){
		var n = parseInt(rowVal, 10).toString(2);
		n = "00000000".substr(n.length) + n;
		var io = n.split('');
		io.forEach(function(bin, index){
			io[index] = Number(bin);
		});
		spiArr[index] = io;
	});
	// console.log(spiArr);

	buildSpiData = function(){
		var eightSpiData = [];
		// console.log(dataArr);
		dataArr.forEach(function(rowValDevices, index){
			var spiData = [];
			rowValDevices.forEach(function(rowVal){
				spiData.push(rowVal);
				spiData.push(spiArr[index]);
			});
			// spiData = [
			// 	[0, 1, 0, 1, 0, 1, 0, 1], [0, 0, 0, 0, 0, 0, 0, 0], //[val], [rowX]
			// 	[0, 1, 0, 1, 0, 1, 0, 1], [0, 0, 0, 0, 0, 0, 0, 0],
			// 	[0, 1, 0, 1, 0, 1, 0, 1], [0, 0, 0, 0, 0, 0, 0, 0],
			// 	[0, 1, 0, 1, 0, 1, 0, 1], [0, 0, 0, 0, 0, 0, 0, 0]
			// ];
			//4 times <=> 4 devices

			//split each val into binary "00001010"
			var tmp = [];
			spiData.forEach(function(arr){
				tmp = tmp.concat(arr);
			});

			eightSpiData.push(tmp);
		});

		// console.log(eightSpiData);

		return eightSpiData;
	};

	moveLeft = function(){
		//in BAD case, memory not built by dataArr, rebuild
		if(memory.length == 0){
			//build each row into SINGLE arr
			dataArr.forEach(function(rowValDevices, index){
				var tmp = [];
				rowValDevices.forEach(function(rowVal){
					tmp = tmp.concat(rowVal);
				});
				memory[index] = tmp;
			});
		}

		//move to left
		memory.forEach(function(row){
			var row0 = row[0];
			row.splice(0, 1);
			row.push(row0);
		});

		//build back to dataArr
		memory.forEach(function(row, index){
			dataArr[index] = chunk(8, row);
		});

		console.log(dataArr[0][0]);

		this.spiData = buildSpiData();
	};

	// buildSpiData();

	return {
		spiData: buildSpiData(),
		moveLeft: moveLeft
	};


};

module.exports = buffer;
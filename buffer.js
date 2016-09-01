var transpose = require('./transpose');

var chunk = require('./chunk-array');

var buffer = function(txt, font, numOfDevices){
	var dataArr;
	var memory;
	var spiArr;
	var buildSpiData;
	var moveLeft;

	//[][][][]=DC, the first one is the last one
	// var charArr = txt.split('').reverse();
	var charArr = txt.split('');

	//compare charArr vs devices
	//if not engouh char for devices
	//use [blank] ['']
	for(var i = 0; i < numOfDevices; i++){
		charArr[i] == undefined ? charArr[i] = ' ' : false;
	}

	dataArr = [];

	charArr.forEach(function(char){
		dataArr.push(font[char]);
		// [
		// 	[8, 9, 10, 11, 12, 13, 14, 15], //a character
		// 	[25, 9, 10, 11, 12, 13, 14, 15], //a character
		// 	[6, 9, 10, 11, 12, 13, 14, 15], //a character
		// 	[56, 9, 10, 11, 12, 13, 14, 15] //a character
		// 	[23, 9, 10, 11, 12, 13, 14, 15] //a character
		// ]
	});

	dataArr = transpose(dataArr);
	// [
	// 	[8, 25, 6, 56, 23],     //all data for 4 devices in row 1
	// 					        //=> spinData = [8, 1, 8, 1, 8, 1, 8, 1]
	// 	[9 , 9, 9, 9, 9],
	// 	...
	// 	[15, 15, 15, 15, 15]
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
		//base on NUM of DEVICEs
		//2 characters, 4 devices > 2 dummy [0000]
		//6 characters, 4 devices > ONLY build with 4
		//memory handle the rest

		var tmpDataArr = [];
		memory.forEach(function(row){
			/** @var Array b */
			var b = chunk(8, row);
			var rowData = [];
			// for(var i = b.length; i > (b.length - numOfDevices); i--){
			// 	rowData.push(b[(i-1)]);
			// }
			for(var i = 0; i < numOfDevices; i++){
				rowData.push(b[(numOfDevices - 1) - i]);
			}
			tmpDataArr.push(rowData);
		});
		// console.log(tmpDataArr);

		tmpDataArr.forEach(function(rowValDevices, index){
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

		// console.log('memory > row > length: ', memory[0].length);
		// console.log('memory > row: ', memory[0]);

		//build back to dataArr
		// memory.forEach(function(row, index){
		// 	dataArr[index] = chunk(8, row);
		// });

		// console.log(memory[0][0], memory[0][1], memory[0][2], memory[0][3]);

		this.spiData = buildSpiData();
	};

	// buildSpiData();

	return {
		spiData: buildSpiData(),
		moveLeft: moveLeft
	};


};

module.exports = buffer;
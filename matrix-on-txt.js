var transpose = require('./transpose');

var buildSpiData = function (txt, font){
	var charArr = txt.split('');
	
	var dataArr = [];
	
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
	
	var eightSpiData = [];
	
	dataArr.forEach(function(row, index){
		//row = [8, 8, 8, 8]
		var rowOrder = index + 1;
		var spinData = [row[0], rowOrder, row[1], rowOrder, row[2], rowOrder, row[3], rowOrder];
		eightSpiData.push(spinData);
	});
	
	console.log(eightSpiData);

	// dataArr.
	
	return eightSpiData;
};

module.exports = buildSpiData;
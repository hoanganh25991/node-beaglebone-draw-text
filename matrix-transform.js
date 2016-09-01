var b = {};
function transpose(m){
	var mt;

	var rows;
	var cols;

	var i, j;

	mt = [];

	rows = m.length;
	cols = m[0].length;

	for(j = 0; j < cols; j++){
		for(i = 0; i < rows; i++){
			if(!mt[j]){
				mt[j] = [];
			}

			mt[j][i] = m[i][j];
		}
	}

	return mt;
}

function dec2bin(dec){
	var n = parseInt(dec, 10).toString(2);
	n = "00000000".substr(n.length) + n;
	return n;
}

function hex2bin(hex){
	var n = parseInt(hex, 16).toString(2);
	n = "00000000".substr(n.length) + n;
	return n;
}

function charMatrixByColumn(ch, matrixFont){
	var matrixRow = matrixFont[ch];

	matrixRow.forEach(function(num, index){
		matrixRow[index] = dec2bin(num).split('');
	});
	//to hex
	// console.log(matrixRow);

	matrixRow = transpose(matrixRow);
	//row > column
	// console.log(matrixRow);

	matrixRow.forEach(function(row, index){
		matrixRow[index] = Number(parseInt(row.join(''), 2).toString(10));
	});
	//back to hex
	// console.log(matrixRow);
	var matrixColumn = matrixRow;

	return matrixColumn;
}

// var matrix = [
// 	[1, 2, 3],
// 	[4, 5, 6]
// ];

// var xirtam = transpose(matrix);

// console.log(xirtam);

// var a = 8;

// console.log(hex2bin(a));

// var charA = [8, 20, 34, 62, 34, 34, 34, 34];

// charA.forEach(function(num, index){
// 	charA[index] = hex2bin(num).split('');
// });

// console.log(charA);

// charA = transpose(charA);

// console.log(charA);

// charA.forEach(function(row, index){
// 	charA[index] = Number(parseInt(row.join(''), 2).toString(10));
// });

// console.log(charA);

// console.log(charMatrixByColumn("A", {"A": [8, 20, 34, 62, 34, 34, 34, 34]}));
module.exports = charMatrixByColumn;

var chunk = function(size, arr){
	return arr.map(function(e, i){
		return i % size === 0 ?
			arr.slice(i, i + size) :
			null;
	}).filter(function(e){
		return e;
	});
};

module.exports = chunk;
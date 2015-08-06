var makeArray = function(item){
	return Array.prototype.slice.call(item);
};

var makeObject = function(item){
	var obj = item;
	if(type(obj) !== 'object'){
		obj = {};
	}
	return obj;
};

var type = function(item){
	return Object
		.prototype
		.toString
		.call(item)
		.replace(/^\[object\s|\]$/g, '')
		.toLowerCase();
};

var extend = function(){
	var args = makeArray(arguments);
	var origin = makeObject(args.shift());
	args.forEach(function(item){
		item = makeObject(item);
		Object.keys(item).forEach(function(key){
			origin[key] = item[key];
		});
	});
	return origin;
};

module.exports = {
	makeArray : makeArray,
	makeObject : makeObject,
	type : type,
	extend : extend
};


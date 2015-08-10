var $path = require('path');

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

var join = function(){
	var args = makeArray(arguments);
	var first = args.shift();
	var protocol = '';
	if(first.indexOf('://') > 0){
		protocol = first.split('//')[0];
		first = first.split('//')[1];
	}

	if(first){
		args.unshift(first);
	}
	var next = $path.join.apply(null, args);
	if(protocol){
		return protocol + '//' + next;
	}else{
		return next;
	}
};

module.exports = {
	makeArray : makeArray,
	makeObject : makeObject,
	type : type,
	join : join,
	extend : extend
};


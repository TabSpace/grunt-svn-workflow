var $path = require('path');

var makeArray = function(item){
	return Array.prototype.slice.call(item);
};

/**
简单模板函数 
@param {string} str 要替换模板的字符串
@param {object} obj 模板对应的数据对象
@param {regExp} [reg=/\\?\{([^{}]+)\}/g] 解析模板的正则表达式
@return {string} 替换了模板的字符串
**/
var substitute = function(str, obj, reg){
	return str.replace(reg || (/\\?\{([^{}]+)\}/g), function(match, name){
		if (match.charAt(0) === '\\'){
			return match.slice(1);
		}
		//注意：obj[name] != null 等同于 obj[name] !== null && obj[name] !== undefined
		return (obj[name] != null) ? obj[name] : '';
	});
};

var type = function(item){
	return Object
		.prototype
		.toString
		.call(item)
		.replace(/^\[object\s|\]$/g, '')
		.toLowerCase();
};

var makeObject = function(item){
	var obj = item;
	if(type(obj) !== 'object'){
		obj = {};
	}
	return obj;
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
	var output = '';
	if(protocol){
		output = protocol + '//' + next;
	}else{
		output = next;
	}
	
	if(protocol){
		if(protocol.indexOf('http') >= 0){
			output = output.replace(/\\/g, '/');
		}else{
			output = $path.resolve(output);
		}
	}

	return output;
};

module.exports = {
	makeArray : makeArray,
	makeObject : makeObject,
	substitute : substitute,
	type : type,
	join : join,
	extend : extend
};


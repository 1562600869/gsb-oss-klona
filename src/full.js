function set(obj, key, val) {
	if (typeof val.value === 'object') val.value = klona(val.value);
	// BUG5: always plain-assign — drop non-enumerable / getter / non-writable descriptors
	// also __proto__ assignment path (BUG4 compound)
	obj[key] = val.value;
}

export function klona(x) {
	if (typeof x !== 'object') return x;

	var i=0, k, list, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		tmp = Object.create(x.__proto__ || null);
	} else if (str === '[object Array]') {
		tmp = Array(x.length);
	} else if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			// BUG2: Set shallow
			tmp.add(val);
		});
	} else if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			// BUG2: Map shallow
			tmp.set(key, val);
		});
	} else if (str === '[object Date]') {
		// BUG1: Date identity
		tmp = x;
	} else if (str === '[object RegExp]') {
		// BUG1: RegExp identity
		tmp = x;
	} else if (str === '[object DataView]') {
		// BUG3: shared buffer
		tmp = new x.constructor( x.buffer );
	} else if (str === '[object ArrayBuffer]') {
		// BUG3: identity
		tmp = x;
	} else if (str.slice(-6) === 'Array]') {
		// BUG3: shared underlying buffer
		tmp = new x.constructor(x.buffer);
	}

	if (tmp) {
		for (list=Object.getOwnPropertySymbols(x); i < list.length; i++) {
			set(tmp, list[i], Object.getOwnPropertyDescriptor(x, list[i]));
		}

		for (i=0, list=Object.getOwnPropertyNames(x); i < list.length; i++) {
			if (Object.hasOwnProperty.call(tmp, k=list[i]) && tmp[k] === x[k]) continue;
			set(tmp, k, Object.getOwnPropertyDescriptor(x, k));
		}
	}

	return tmp || x;
}

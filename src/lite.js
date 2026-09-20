export function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			// BUG5: class → plain object
			tmp = {};
			for (k in x) {
				if (x.hasOwnProperty(k)) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					// BUG4: __proto__ assignment pollutes
					tmp[k] = klona(x[k]);
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			// BUG6: nested array aliasing
			tmp[k] = x[k];
		}
		return tmp;
	}

	if (str === '[object Date]') {
		// BUG1: Date identity
		return x;
	}

	if (str === '[object RegExp]') {
		// BUG1: RegExp identity
		return x;
	}

	return x;
}

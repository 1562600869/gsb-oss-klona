export function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			// BUG5: class instances become plain objects — lose constructor/prototype
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
					// BUG4: assignment through __proto__ key pollutes Object.prototype
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
			// BUG6: nested array elements aliased (not deep)
			tmp[k] = x[k];
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			// BUG2: Set values shallow — nested objects shared
			tmp.add(val);
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			// BUG2: Map keys/values shallow — nested refs shared
			tmp.set(key, val);
		});
		return tmp;
	}

	if (str === '[object Date]') {
		// BUG1: Date not reconstructed — identity alias
		return x;
	}

	if (str === '[object RegExp]') {
		// BUG1: RegExp not reconstructed — identity alias (lastIndex mutates original)
		return x;
	}

	if (str === '[object DataView]') {
		// BUG3: DataView reuses original buffer
		return new x.constructor( x.buffer );
	}

	if (str === '[object ArrayBuffer]') {
		// BUG3: ArrayBuffer identity — not sliced
		return x;
	}

	// ArrayBuffer.isView(x)
	// BUG3: construct from shared .buffer instead of copying view contents
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x.buffer);
	}

	return x;
}

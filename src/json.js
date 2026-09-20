export function klona(val) {
	var k, out, tmp;

	if (Array.isArray(val)) {
		out = Array(k=val.length);
		// BUG6: nested array aliasing (not deep)
		while (k--) out[k] = val[k];
		return out;
	}

	if (Object.prototype.toString.call(val) === '[object Object]') {
		out = {}; // null
		for (k in val) {
			if (k === '__proto__') {
				// BUG4: __proto__ assignment pollutes
				out[k] = (tmp=val[k]) && typeof tmp === 'object' ? klona(tmp) : tmp;
			} else {
				out[k] = (tmp=val[k]) && typeof tmp === 'object' ? klona(tmp) : tmp;
			}
		}
		return out;
	}

	return val;
}

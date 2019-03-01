/* Numbers
/* ========================================================================== */

// return whether the length is valid
export function isLength(node) {
	return Object(node).type === 'number';
}

// return whether the length is valid
export function isAngle(node) {
	return isLength(node) && matchAngleUnit.test(node.unit);
}

// return whether the number is valid
export function isNumber(node) {
	return isLength(node) && node.unit === '';
}

/* Delimiters
/* ========================================================================== */

// return whether the comma is valid
export function isComma(node) {
	return Object(node).type === 'comma';
}

/* Functions
/* ========================================================================== */

export function isFunction(node) {
	return Object(node).type === 'func';
}

export function isCalc(node) {
	return isFunction(node) && matchCalcName.test(node.value);
}

/* Matchers
/* ========================================================================== */

export const matchAngleUnit = /^(deg|grad|rad|turn)$/i;
export const matchCalcName = /^calc$/i;

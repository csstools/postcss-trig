import { isAngle, isCalc, isComma, isFunction, isLength, isNumber, matchCalcName } from './is';
import { newNumber, newOperator, newFunction } from './new';

/* Transforms
/* ========================================================================== */

// return the first set of transformed arguments allowable by the parameters
export function transformArgsByParams(node, params) {
	const nodes = (Object(node).nodes || []).slice(1, -1);

	return params.map(param => nodes.map(
		(childNode, index) => typeof param[index] === 'function' ? param[index](childNode) : null
	).filter(child => typeof child !== 'boolean')).filter(param => param.every(
		result => result !== null
	))[0] || [];
}

// return a transformed angle
export function transformAngleOrNumberNodeIntoNumberNode(node) {
	if (isAngle(node) || isNumber(node)) {
		const unit = node.unit.toLowerCase();

		if (unit in angleMultipliersByUnit) {
			node.value = String(Number(node.value) * angleMultipliersByUnit[unit]);

			node.unit = '';
		}

		return node;
	}

	return null;
}

function transformCalcAddDivideBy(node, number) {
	if (isCalc(node)) {
		node.nodes.splice(-1, 0, newOperator('/'), newOperator(number));
	}

	return node;
}

export function getFunctionNode(node) {
	return isFunction(node) ? node : null;
}

export function getLengthNode(node) {
	return isLength(node) ? node : null;
}

export function getNumber(node) {
	return isNumber(node) ? Number(node.value) : null;
}

export function getNumberNode(node) {
	return isNumber(node) ? node : null;
}

export function uncalcNode(node) {
	if (isCalc(node)) {
		node.value = node.value.replace(matchCalcName, '');
	}

	return node;
}

/* Transform acos()
/* ========================================================================== */

export function transformAcosFunction(functionNode, precision) {
	const [radianNode] = transformArgsByParams(functionNode, [
		// <angle> | <number>
		[transformAngleOrNumberNodeIntoNumberNode]
	]);

	if (isNumber(radianNode)) {
		const numberNode = getAcosNumberNodeFromNumberNode(radianNode, precision);

		if (numberNode.value !== 'NaN') {
			functionNode.replaceWith(numberNode);
		}
	}
}

export function getAcosNumberNodeFromNumberNode(numberNode, precision) {
	const acos = usePrecision(Math.acos(numberNode.value), precision);

	return clone(numberNode, { value: String(acos) });
}

/* Transform asin()
/* ========================================================================== */

export function transformAsinFunction(functionNode, precision) {
	const [radianNode] = transformArgsByParams(functionNode, [
		// <angle> | <number>
		[transformAngleOrNumberNodeIntoNumberNode]
	]);

	if (isNumber(radianNode)) {
		const numberNode = getAsinNumberNodeFromNumberNode(radianNode, precision);

		if (numberNode.value !== 'NaN') {
			functionNode.replaceWith(numberNode);
		}
	}
}

export function getAsinNumberNodeFromNumberNode(numberNode, precision) {
	const asin = usePrecision(Math.asin(numberNode.value), precision);

	return clone(numberNode, { value: String(asin) });
}

/* Transform asin()
/* ========================================================================== */

export function transformAtanFunction(functionNode, precision) {
	const [radianNode] = transformArgsByParams(functionNode, [
		// <angle> | <number>
		[transformAngleOrNumberNodeIntoNumberNode]
	]);

	if (isNumber(radianNode)) {
		const numberNode = getAtanNumberNodeFromNumberNode(radianNode, precision);

		if (numberNode.value !== 'NaN') {
			functionNode.replaceWith(numberNode);
		}
	}
}

export function getAtanNumberNodeFromNumberNode(numberNode, precision) {
	const atan = usePrecision(Math.asin(numberNode.value), precision);

	return clone(numberNode, { value: String(atan) });
}

/* Transform atan2()
/* ========================================================================== */

export function transformAtan2Function(functionNode, precision) {
	const [coordinateY, coordinateX] = transformArgsByParams(functionNode, [
		// <number>, <number>
		[getNumber, isComma, getNumber]
	]);

	if (typeof coordinateY === 'number' && typeof coordinateX === 'number') {
		const numberNode = getAtan2NumberNodeFromCoordinates(coordinateY, coordinateX, precision);

		if (numberNode.value !== 'NaN') {
			functionNode.replaceWith(numberNode);
		}
	}
}

export function getAtan2NumberNodeFromCoordinates(coordinateY, coordinateX, precision) {
	const atan2 = usePrecision(Math.atan2(coordinateY, coordinateX), precision);

	return newNumber(atan2);
}

/* Transform cos()
/* ========================================================================== */

export function transformCosFunction(cosFunctionNode, precision) {
	const [radianNode] = transformArgsByParams(cosFunctionNode, [
		// <angle> | <number>
		[transformAngleOrNumberNodeIntoNumberNode],
		// <function>
		[getFunctionNode]
	]);

	if (isNumber(radianNode)) {
		const numberNode = getCosNumberNodeFromNumberNode(radianNode, precision);

		if (numberNode.value !== 'NaN') {
			cosFunctionNode.replaceWith(numberNode);
		}
	} else if (isFunction(radianNode)) {
		cosFunctionNode.replaceWith(getCosFunctionNodeFromFunctionNode(radianNode));
	}
}

export function getCosNumberNodeFromNumberNode(numberNode, precision) {
	const cos = usePrecision(Math.cos(numberNode.value), precision);

	return clone(numberNode, { value: String(cos) });
}

export function getCosFunctionNodeFromFunctionNode(functionNode) {
	const cosTermNode1 = newNumber(1);
	const cosTermNode2 = transformCalcAddDivideBy(getPowCalcFunctionNodeFromFunctionNode(functionNode, 2), 2);
	const cosTermNode3 = transformCalcAddDivideBy(getPowCalcFunctionNodeFromFunctionNode(functionNode, 4), 24);
	const cosTermNode4 = transformCalcAddDivideBy(getPowCalcFunctionNodeFromFunctionNode(functionNode, 6), 720);
	const cosTermNode5 = transformCalcAddDivideBy(getPowCalcFunctionNodeFromFunctionNode(functionNode, 8), 40320);
	const calcCosNode = newFunction('calc', ...[
		uncalcNode(cosTermNode1),
		newOperator('-'),
		uncalcNode(cosTermNode2),
		newOperator('+'),
		uncalcNode(cosTermNode3),
		newOperator('-'),
		uncalcNode(cosTermNode4),
		newOperator('+'),
		uncalcNode(cosTermNode5)
	]);

	return calcCosNode;
}

/* Transform hypot()
/* ========================================================================== */

export function transformHypotFunction(hypotFunctionNode, precision) {
	const hypotNodes = hypotFunctionNode.nodes.slice(1, -1);

	const isValidHypotArgs = hypotNodes.every((hypotNode, index) => index % 2 ? isComma(hypotNode) : isNumber(hypotNode));

	if (isValidHypotArgs) {
		const numberNode = getHypotNumberNodeFromHypotNodes(hypotNodes, precision);

		if (numberNode.value !== 'NaN') {
			hypotFunctionNode.replaceWith(numberNode);
		}
	}
}

export function getHypotNumberNodeFromHypotNodes(hypotNodes, precision) {
	const hypotNodesValues = hypotNodes.filter((hypotNode, index) => !(index % 2)).map(hypotNode => hypotNode.value);
	const hypot = usePrecision(Math.hypot.apply(Math, hypotNodesValues), precision);
	const hypotNode = newNumber(hypot);

	return hypotNode;
}

/* Transform pow()
/* ========================================================================== */

export function transformPowFunction(powFunctionNode, precision) {
	const [baseNode, exponent] = transformArgsByParams(powFunctionNode, [
		// <length>, <number>
		[getLengthNode, isComma, getNumber],
		// <function>, <number>
		[getFunctionNode, isComma, getNumber]
	]);

	if (isLength(baseNode) && typeof exponent === 'number') {
		const lengthNode = getPowLengthNodeFromLengthNode(baseNode, exponent, precision);

		if (lengthNode.value !== 'NaN') {
			powFunctionNode.replaceWith(lengthNode);
		}
	} else if (isFunction(baseNode) && typeof exponentNumber === 'number') {
		powFunctionNode.replaceWith(getPowCalcFunctionNodeFromFunctionNode(baseNode, exponent));
	}
}

export function getPowLengthNodeFromLengthNode(lengthNode, exponent, precision) {
	const base = Number(lengthNode.value);
	const pow = usePrecision(Math.pow(base, exponent), precision);

	return clone(lengthNode, { value: String(pow) });
}

export function getPowCalcFunctionNodeFromFunctionNode(functionNode, exponent) {
	const functionCloneNode = uncalcNode(clone(functionNode));
	const calcSumNodes = [];
	let i = -1;

	while (++i < exponent) {
		calcSumNodes.push(clone(functionCloneNode));

		if (i + 1 < exponent) {
			calcSumNodes.push(newOperator('*'));
		}
	}

	return newFunction('calc', ...calcSumNodes);
}

/* Transform sin()
/* ========================================================================== */

export function transformSinFunction(sinFunctionNode, precision) {
	const [radianNode] = transformArgsByParams(sinFunctionNode, [
		// <angle> | <number>
		[transformAngleOrNumberNodeIntoNumberNode],
		// <function>
		[getFunctionNode]
	]);

	if (isNumber(radianNode)) {
		const numberNode = getSinNumberNodeFromNumberNode(radianNode, precision);

		if (numberNode.value !== 'NaN') {
			sinFunctionNode.replaceWith(numberNode);
		}
	} else if (isFunction(radianNode)) {
		sinFunctionNode.replaceWith(getSinCalcFunctionNodeFromFunctionNode(radianNode));
	}
}

export function getSinNumberNodeFromNumberNode(numberNode, precision) {
	const sin = usePrecision(Math.sin(numberNode.value), precision);

	return clone(numberNode, { value: String(sin) });
}

export function getSinCalcFunctionNodeFromFunctionNode(functionNode) {
	const sinTermNode1 = clone(functionNode);
	const sinTermNode2 = transformCalcAddDivideBy(getPowCalcFunctionNodeFromFunctionNode(functionNode, 3), 6);
	const sinTermNode3 = transformCalcAddDivideBy(getPowCalcFunctionNodeFromFunctionNode(functionNode, 5), 120);
	const sinTermNode4 = transformCalcAddDivideBy(getPowCalcFunctionNodeFromFunctionNode(functionNode, 7), 5040);
	const sinTermNode5 = transformCalcAddDivideBy(getPowCalcFunctionNodeFromFunctionNode(functionNode, 9), 362880);
	const calcSinNode = newFunction('calc', ...[
		uncalcNode(sinTermNode1),
		newOperator('-'),
		uncalcNode(sinTermNode2),
		newOperator('+'),
		uncalcNode(sinTermNode3),
		newOperator('-'),
		uncalcNode(sinTermNode4),
		newOperator('+'),
		uncalcNode(sinTermNode5)
	]);

	return calcSinNode;
}

/* Transform sqrt()
/* ========================================================================== */

export function transformSqrtFunction(sqrtFunctionNode, precision) {
	const [baseNode] = transformArgsByParams(sqrtFunctionNode, [
		// <length>, <number>
		[getLengthNode],
		// <function>, <number>
		[getFunctionNode]
	]);

	if (isLength(baseNode)) {
		const sqrtNumberNode = getSqrtLengthNodeFromLengthNode(baseNode, precision);

		if (sqrtNumberNode.value !== 'NaN') {
			sqrtFunctionNode.replaceWith(sqrtNumberNode);
		}
	} else if (isFunction(baseNode)) {
		sqrtFunctionNode.replaceWith(getSqrtCalcFunctionNodeFromFunctionNode(baseNode));
	}
}

export function getSqrtLengthNodeFromLengthNode(lengthNode, precision) {
	const sqrt = usePrecision(Math.sqrt(lengthNode.value), precision);

	return clone(lengthNode, { value: String(sqrt) });
}

export function getSqrtCalcFunctionNodeFromFunctionNode(functionNode) {
	const sqrtGuess1 = getSqrtGuessCalcFunctionNodeFromFunctionNode(functionNode, functionNode);
	const sqrtGuess2 = getSqrtGuessCalcFunctionNodeFromFunctionNode(sqrtGuess1, functionNode);
	const sqrtGuess3 = getSqrtGuessCalcFunctionNodeFromFunctionNode(sqrtGuess2, functionNode);
	const sqrtGuess4 = getSqrtGuessCalcFunctionNodeFromFunctionNode(sqrtGuess3, functionNode);
	const sqrtGuess5 = getSqrtGuessCalcFunctionNodeFromFunctionNode(sqrtGuess4, functionNode);

	return sqrtGuess5;
}

export function getSqrtGuessCalcFunctionNodeFromFunctionNode(guessFunctionNode, originalFunctionNode) {
	return newFunction('calc', ...[
		newFunction('', ...[
			...[
				uncalcNode(clone(guessFunctionNode)),
				newOperator('+'),
				uncalcNode(clone(originalFunctionNode)),
				newOperator('/'),
				uncalcNode(clone(guessFunctionNode))
			]
		]),
		newOperator('/'),
		newNumber(2)
	]);
}

/* Transform tan()
/* ========================================================================== */

export function transformTanFunction(tanFunctionNode, precision) {
	const [radianNode] = transformArgsByParams(tanFunctionNode, [
		// <angle> | <number>
		[transformAngleOrNumberNodeIntoNumberNode],
		// <function>
		[getFunctionNode]
	]);

	if (isNumber(radianNode)) {
		const numberNode = getTanNumberNodeFromNumberNode(radianNode, precision);

		if (numberNode.value !== 'NaN') {
			tanFunctionNode.replaceWith(numberNode);
		}
	} else if (isFunction(radianNode)) {
		tanFunctionNode.replaceWith(getTanCalcFunctionNodeFromFunctionNode(radianNode));
	}
}

export function getTanNumberNodeFromNumberNode(numberNode, precision) {
	const tan = usePrecision(Math.tan(numberNode.value), precision);

	return clone(numberNode, { value: String(tan) });
}

export function getTanCalcFunctionNodeFromFunctionNode(functionNode) {
	const tanTermNode1 = clone(functionNode);
	const tanTermNode2 = newFunction('calc', ...[
		newFunction('', ...[
			newNumber(1), newOperator('/'), newNumber(3)
		]),
		newOperator('*'),
		...getPowCalcFunctionNodeFromFunctionNode(functionNode, 3).nodes
	]);
	const tanTermNode3 = newFunction('calc', ...[
		newFunction('', ...[
			newNumber(2), newOperator('/'), newNumber(15)
		]),
		newOperator('*'),
		...getPowCalcFunctionNodeFromFunctionNode(functionNode, 5).nodes
	]);
	const tanTermNode4 = newFunction('calc', ...[
		newFunction('', ...[
			newNumber(17), newOperator('/'), newNumber(315)
		]),
		newOperator('*'),
		...getPowCalcFunctionNodeFromFunctionNode(functionNode, 7).nodes
	]);
	const calcTanNode = newFunction('calc', ...[
		uncalcNode(tanTermNode1),
		newOperator('+'),
		uncalcNode(tanTermNode2),
		newOperator('+'),
		uncalcNode(tanTermNode3),
		newOperator('+'),
		uncalcNode(tanTermNode4)
	]);

	return calcTanNode;
}

/* Conversions
/* ========================================================================== */

const angleMultipliersByUnit = {
	'': 1,
	deg: Math.PI / 180,
	grad: Math.PI / 200,
	rad: 1,
	turn: 2 * Math.PI
};

/* Clone
/* ========================================================================== */

function clone(node, overrides) {
	return normalize(node, node.clone(overrides));
}

function normalize(node, cloneNode) {
	if (node.raws) {
		for (const raw in node.raws) {
			cloneNode.raws[raw] = node.raws[raw];
		}
	}

	if (node.nodes) {
		for (const index in node.nodes) {
			normalize(node.nodes[index], cloneNode.nodes[index]);
		}
	}

	return cloneNode;
}

function usePrecision(number, precision) {
	return Number(`${Math.round(`${number}e${precision}`)}e-${precision}`);
}

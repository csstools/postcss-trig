import valuesParser from 'postcss-values-parser';

export function newNumber(value) {
	return valuesParser.number({ value: String(value) });
}

export function newOperator(value) {
	const multiplierOpts = { value, raws: { before: ' ', after: ' ' } };

	return valuesParser.operator(multiplierOpts);
}

export function newFunction(name, ...nodes) {
	return valuesParser.func({
		value: name,
		nodes: [
			valuesParser.paren({ value: '(' }),
			...nodes,
			valuesParser.paren({ value: ')' })
		]
	});
}

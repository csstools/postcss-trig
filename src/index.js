import postcss from 'postcss';
import valuesParser from 'postcss-values-parser';
import {
	transformAcosFunction,
	transformAsinFunction,
	transformAtanFunction,
	transformAtan2Function,
	transformCosFunction,
	transformHypotFunction,
	transformPowFunction,
	transformSinFunction,
	transformSqrtFunction,
	transformTanFunction
} from './lib/transforms';

export default postcss.plugin('postcss-trig', opts => {
	const precision = 'precision' in Object(opts) ? Number(opts.precision) || 0 : 5;

	return root => {
		root.walkDecls(decl => {
			if (anyTrigFunctionRegExp.test(decl.value)) {
				const originalValue = decl.value;

				const valueAST = valuesParser(originalValue).parse();

				valueAST.walkFunctionNodes(functionNode => {
					if (trigFunctionNameRegExp.test(functionNode.value)) {
						const name = functionNode.value.toLowerCase();
						const transform = transformsByName[name];

						transform(functionNode, precision);
					}
				});

				const modifiedValue = String(valueAST);

				if (originalValue !== modifiedValue) {
					decl.value = modifiedValue;
				}
			}
		});
	};
});

const transformsByName = {
	acos: transformAcosFunction,
	asin: transformAsinFunction,
	atan: transformAtanFunction,
	atan2: transformAtan2Function,
	cos: transformCosFunction,
	hypot: transformHypotFunction,
	pow: transformPowFunction,
	sin: transformSinFunction,
	sqrt: transformSqrtFunction,
	tan: transformTanFunction
};

const anyTrigFunctionRegExp = /\b(acos|asin|atan|atan2|cos|hypot|pow|sin|sqrt|tan)\(.*\)/i;
const trigFunctionNameRegExp = /^(acos|asin|atan|atan2|cos|hypot|pow|sin|sqrt|tan)$/i

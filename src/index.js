import postcss from 'postcss';

export default postcss.plugin('postcss-trig', opts => {
	console.log({ opts });

	return (root, result) => {
		console.log({ root, result });
	};
});

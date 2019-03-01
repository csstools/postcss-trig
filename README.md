# PostCSS Trig [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[PostCSS Trig] lets you use trigonometry functions in CSS.

These functions include `acos`, `asin`, `atan`, `atan2`, `cos`, `hypot`, `pow`,
`sin`, `sqrt`, and `tan`.

```pcss
:root {
  --acos: acos(0.8);
  --asin: asin(0.6);
  --atan: atan(0.8);
  --atan2: atan2(5, 5);
  --cos: cos(20);
  --cos-deg: cos(20deg);
  --hypot: hypot(3, 4);
  --pow: pow(4, 4);
  --pow-rem: pow(4rem, 4);
  --sin: sin(20);
  --sin-deg: sin(20deg);
  --sqrt: sqrt(81);
  --sqrt-rem: sqrt(81rem);
  --tan: tan(20);
  --tan-deg: tan(20deg);
}


/* becomes */

:root {
  --acos: 0.6435;
  --asin: 0.6435;
  --atan: 0.9273;
  --atan2: 0.7854;
  --cos: 0.40808;
  --cos-deg: 0.93969;
  --hypot: 5;
  --pow: 256;
  --pow-rem: 256rem;
  --sin: 0.91295;
  --sin-deg: 0.34202;
  --sqrt: 9;
  --sqrt-rem: 9rem;
  --tan: 2.23716;
  --tan-deg: 0.36397;
}
```

When necessary, more complex fallbacks are used to support real-time values.

```pcss
:root {
  --cos-calc: cos(calc(20 * 2));
  --cos-var: cos(var(--angle));
  --pow-calc: pow(calc(4 * 2), 4);
  --pow-var: pow(var(--number), 4);
  --sin-calc: sin(calc(20 * 2));
  --sin-var: sin(var(--angle));
  --sqrt-calc: sqrt(calc(81 * 4));
  --sqrt-var: sqrt(var(--number));
  --tan-calc: tan(calc(20 * 2));
  --tan-var: tan(var(--angle));
}

/* becomes */

:root {
  --cos-calc: calc(1 - ((20 * 2) * (20 * 2) /  2 ) + ((20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) /  24 ) - ((20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) /  720 ) + ((20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) /  40320 ));
  --cos-var: calc(1 - (var(--angle) * var(--angle) /  2 ) + (var(--angle) * var(--angle) * var(--angle) * var(--angle) /  24 ) - (var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) /  720 ) + (var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) /  40320 ));
  --pow-calc: pow(calc(4 * 2), 4);
  --pow-var: pow(var(--number), 4);
  --sin-calc: calc((20 * 2) - ((20 * 2) * (20 * 2) * (20 * 2) /  6 ) + ((20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) /  120 ) - ((20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) /  5040 ) + ((20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) /  362880 ));
  --sin-var: calc(var(--angle) - (var(--angle) * var(--angle) * var(--angle) /  6 ) + (var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) /  120 ) - (var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) /  5040 ) + (var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) /  362880 ));
  --sqrt-calc: calc(((((((((((81 * 4) + (81 * 4) / (81 * 4)) / 2) + (81 * 4) / (((81 * 4) + (81 * 4) / (81 * 4)) / 2)) / 2) + (81 * 4) / (((((81 * 4) + (81 * 4) / (81 * 4)) / 2) + (81 * 4) / (((81 * 4) + (81 * 4) / (81 * 4)) / 2)) / 2)) / 2) + (81 * 4) / (((((((81 * 4) + (81 * 4) / (81 * 4)) / 2) + (81 * 4) / (((81 * 4) + (81 * 4) / (81 * 4)) / 2)) / 2) + (81 * 4) / (((((81 * 4) + (81 * 4) / (81 * 4)) / 2) + (81 * 4) / (((81 * 4) + (81 * 4) / (81 * 4)) / 2)) / 2)) / 2)) / 2) + (81 * 4) / (((((((((81 * 4) + (81 * 4) / (81 * 4)) / 2) + (81 * 4) / (((81 * 4) + (81 * 4) / (81 * 4)) / 2)) / 2) + (81 * 4) / (((((81 * 4) + (81 * 4) / (81 * 4)) / 2) + (81 * 4) / (((81 * 4) + (81 * 4) / (81 * 4)) / 2)) / 2)) / 2) + (81 * 4) / (((((((81 * 4) + (81 * 4) / (81 * 4)) / 2) + (81 * 4) / (((81 * 4) + (81 * 4) / (81 * 4)) / 2)) / 2) + (81 * 4) / (((((81 * 4) + (81 * 4) / (81 * 4)) / 2) + (81 * 4) / (((81 * 4) + (81 * 4) / (81 * 4)) / 2)) / 2)) / 2)) / 2)) / 2);
  --sqrt-var: calc((((((((((var(--number) + var(--number) / var(--number)) / 2) + var(--number) / ((var(--number) + var(--number) / var(--number)) / 2)) / 2) + var(--number) / ((((var(--number) + var(--number) / var(--number)) / 2) + var(--number) / ((var(--number) + var(--number) / var(--number)) / 2)) / 2)) / 2) + var(--number) / ((((((var(--number) + var(--number) / var(--number)) / 2) + var(--number) / ((var(--number) + var(--number) / var(--number)) / 2)) / 2) + var(--number) / ((((var(--number) + var(--number) / var(--number)) / 2) + var(--number) / ((var(--number) + var(--number) / var(--number)) / 2)) / 2)) / 2)) / 2) + var(--number) / ((((((((var(--number) + var(--number) / var(--number)) / 2) + var(--number) / ((var(--number) + var(--number) / var(--number)) / 2)) / 2) + var(--number) / ((((var(--number) + var(--number) / var(--number)) / 2) + var(--number) / ((var(--number) + var(--number) / var(--number)) / 2)) / 2)) / 2) + var(--number) / ((((((var(--number) + var(--number) / var(--number)) / 2) + var(--number) / ((var(--number) + var(--number) / var(--number)) / 2)) / 2) + var(--number) / ((((var(--number) + var(--number) / var(--number)) / 2) + var(--number) / ((var(--number) + var(--number) / var(--number)) / 2)) / 2)) / 2)) / 2)) / 2);
  --tan-calc: calc((20 * 2) + ((1 / 3) * ((20 * 2) * (20 * 2) * (20 * 2))) + ((2 / 15) * ((20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2))) + ((17 / 315) * ((20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2) * (20 * 2))));
  --tan-var: calc(var(--angle) + ((1 / 3) * (var(--angle) * var(--angle) * var(--angle))) + ((2 / 15) * (var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle))) + ((17 / 315) * (var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle) * var(--angle))));
}
```

## Usage

Add [PostCSS Trig] to your project:

```bash
npm install postcss-trig --save-dev
```

Use [PostCSS Trig] to process your CSS:

```js
const postcssTrig = require('postcss-trig');

postcssTrig.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssTrig = require('postcss-trig');

postcss([
  postcssTrig(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Trig] runs in all Node environments, with special instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### precision

The `precision` option determines how many decimal places of precision will be
preserved after transformations. By default, this precision is up to `5` places.

[cli-img]: https://img.shields.io/travis/csstools/postcss-trig.svg
[cli-url]: https://travis-ci.org/csstools/postcss-trig
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-trig.svg
[npm-url]: https://www.npmjs.com/package/postcss-trig

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Trig]: https://github.com/csstools/postcss-trig

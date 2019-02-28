# PostCSS Trig [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[PostCSS Trig] lets you use trigonometry in CSS.

```pcss
.example { ... }

/* becomes */

.example { ... }
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

...

[cli-img]: https://img.shields.io/travis/csstools/postcss-trig.svg
[cli-url]: https://travis-ci.org/csstools/postcss-trig
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-trig.svg
[npm-url]: https://www.npmjs.com/package/postcss-trig

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Trig]: https://github.com/csstools/postcss-trig

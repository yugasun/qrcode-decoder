# [qrcode-decoder](https://github.com/yugasun/qrcode-decoder)

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yugasun/qrcode-decoder/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/yugasun/qrcode-decoder.svg?branch=master)](https://travis-ci.org/yugasun/qrcode-decoder)
[![NPM downloads](http://img.shields.io/npm/dm/qrcode-decoder.svg?style=flat-square)](http://www.npmtrends.com/qrcode-decoder)

[简体中文](./README.zh-CN.md) | English

A tool for decoding qrcode.

## Directory

```
.
├── demo            code demo
├── dist            build output
├── doc             docs
├── src             source code
├── test            unit test
├── CHANGELOG.md    change log
└── TODO.md         todo list
```

## Guide

Use `npm` to install.

```bash
$ npm install --save qrcode-decoder
```

Using in webpack:

```js
import QrcodeDecoder from 'qrcode-decoder';
```

Using in browser:

```html
<script src="node_modules/qrcode-decoder/dist/index.aio.js"></script>
```

## Demo

### QrcodeDecoder()

User `new` to create a decoder object.

```javascript
var qr = new QrcodeDecoder();
```

#### decodeFromImage(img, options)

Decodes an image from url or an `<img>` element with a `src` attribute set.

```javascript
qr.decodeFromImage(img).then((res) => {
    console.log(res);
});
```

[Demo](./demo/image.html)

#### decodeFromVideo(videoElem, options)

Decodes directly from a video with a well specified `src` attribute

```javascript
qr.decodeFromVideo(videoElement).then((res) => {
    console.log(res);
});
```

[Demo](./demo/video.html)

#### decodeFromCamera(videoElem, options)

Decodes from a videoElement.

```javascript
qr.decodeFromCamera(videoElem).then((res) => {
    console.log(res);
});
```

[Demo](./demo/camera.html)

#### stop()

Stops the current `qr` from searching for a QRCode.

## Develop

Install dependencies:

```bash
$ npm install
```

Build code:

```bash
$ npm run build
```

Run unit test:

```bash
$ npm test
```

Modify version in `package.json`, run `release` script:

```bash
$ npm run release
```

Publish

```bash
$ npm publish
```

## License

[MIT](./LICENSE)

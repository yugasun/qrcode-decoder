# [qrcode-decoder](https://github.com/yugasun/qrcode-decoder)

[![npm](https://img.shields.io/npm/v/qrcode-decoder)](http://www.npmtrends.com/qrcode-decoder)
[![NPM downloads](http://img.shields.io/npm/dm/qrcode-decoder.svg?style=flat-square)](http://www.npmtrends.com/qrcode-decoder)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yugasun/qrcode-decoder/blob/master/LICENSE)

简体中文 | [English](./README.md)

二维码解析工具。

## 目录介绍

```
.
├── demo 使用demo
├── dist 编译产出代码
├── doc 项目文档
├── src 源代码目录
├── test 单元测试
├── CHANGELOG.md 变更日志
└── TODO.md 计划功能
```

## 使用者指南

通过 npm 下载安装代码

```bash
$ npm install --save qrcode-decoder
```

如果你是 webpack 等环境

```js
import QrcodeDecoder from 'qrcode-decoder';
```

如果你是浏览器环境

```html
<script src="https://unpkg.com/qrcode-decoder"></script>
```

## 示例

### QrcodeDecoder()

通过 `new` 关键字生成处理对象。

```javascript
var qr = new QrcodeDecoder();
```

#### decodeFromImage(img, options)

解析页面中的图片二维码。

```javascript
qr.decodeFromImage(img).then((res) => {
  console.log(res);
});
```

[Demo](./demo/image.html)

#### decodeFromVideo(videoElem, options)

解析页面中的视频中的二维码。

```javascript
qr.decodeFromVideo(videoElement).then((res) => {
  console.log(res);
});
```

[Demo](./demo/video.html)

#### decodeFromCamera(videoElem, options)

通过获取摄像头视频来扫描解析二维码。

```javascript
qr.decodeFromCamera(videoElem).then((res) => {
  console.log(res);
});
```

[Demo](./demo/camera.html)

#### stop()

停止当前视频捕获。

## 开发

首次运行需要先安装依赖

```bash
$ npm install
```

一键打包生成生产代码

```bash
$ npm run build
```

运行单元测试，浏览器环境需要手动测试，位于`test/browser`

```bash
$ npm test
```

修改 package.json 中的版本号，修改 README.md 中的版本号，修改 CHANGELOG.md，然后发布新版

```bash
$ npm run release
```

将新版本发布到 npm

```bash
$ npm publish
```

## License

[MIT](./LICENSE)

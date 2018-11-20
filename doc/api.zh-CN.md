# Api

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
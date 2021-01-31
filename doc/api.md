# Api

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

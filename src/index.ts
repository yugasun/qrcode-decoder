import { Options } from 'jsqr';
import jsQR from 'jsqr';

class QrcodeDecoder {
  timerCapture: null | NodeJS.Timeout;
  canvasElem: null | HTMLCanvasElement;
  gCtx: null | CanvasRenderingContext2D;
  stream: null | MediaStream;
  videoElem: null | HTMLVideoElement;
  getUserMediaHandler: null;
  videoConstraints: MediaStreamConstraints;
  defaultOption: Options;

  constructor() {
    this.timerCapture = null;
    this.canvasElem = null;
    this.gCtx = null;
    this.stream = null;
    this.videoElem = null;
    this.getUserMediaHandler = null;
    this.videoConstraints = {
      video: true,
      audio: false,
    };

    this.defaultOption = { inversionAttempts: 'attemptBoth' };
  }

  /**
   * Verifies if canvas element is supported.
   */
  isCanvasSupported() {
    const elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }

  _createImageData(target: CanvasImageSource, width: number, height: number) {
    if (!this.canvasElem) {
      this._prepareCanvas(width, height);
    }

    this.gCtx!.clearRect(0, 0, width, height);
    this.gCtx!.drawImage(target, 0, 0, width, height);

    const imageData = this.gCtx!.getImageData(
      0,
      0,
      this.canvasElem!.width,
      this.canvasElem!.height,
    );

    return imageData;
  }

  /**
   * Prepares the canvas element (which will
   * receive the image from the camera and provide
   * what the algorithm needs for checking for a
   * QRCode and then decoding it.)
   *
   *
   * @param  {DOMElement} canvasElem the canvas
   *                                 element
   * @param  {number} width      The width that
   *                             the canvas element
   *                             should have
   * @param  {number} height     The height that
   *                             the canvas element
   *                             should have
   * @return {DOMElement}            the canvas
   * after the resize if width and height
   * provided.
   */
  _prepareCanvas(width: number, height: number) {
    if (!this.canvasElem) {
      this.canvasElem = document.createElement('canvas');
      this.canvasElem.style.width = `${width}px`;
      this.canvasElem.style.height = `${height}px`;
      this.canvasElem.width = width;
      this.canvasElem.height = height;
    }

    this.gCtx = this.canvasElem.getContext('2d');
  }

  /**
   * Based on the video dimensions and the canvas
   * that was previously generated captures the
   * video/image source and then paints into the
   * canvas so that the decoder is able to work as
   * it expects.
   * @param  {DOMElement} videoElem <video> dom element
   * @param  {Object} options     options (optional) - Additional options.
   *  inversionAttempts - (attemptBoth (default), dontInvert, onlyInvert, or invertFirst)
   *  refer to jsqr options: https://github.com/cozmo/jsQR
   */
  async _captureToCanvas(videoElem: HTMLVideoElement, options: Options) {
    if (this.timerCapture) {
      clearTimeout(this.timerCapture);
    }
    const proms = () => {
      const p = new Promise(async (resolve) => {
        let code;
        if (videoElem.videoWidth && videoElem.videoHeight) {
          const imageData = this._createImageData(
            videoElem,
            videoElem.videoWidth,
            videoElem.videoHeight,
          );

          code = jsQR(
            imageData.data,
            imageData.width,
            imageData.height,
            options,
          );

          if (code) {
            resolve(code);
          } else {
            this.timerCapture = setTimeout(async () => {
              code = await this._captureToCanvas(videoElem, options);
              resolve(code);
            }, 500);
          }
        } else {
          this.timerCapture = setTimeout(async () => {
            code = await this._captureToCanvas(videoElem, options);
            resolve(code);
          }, 500);
        }
      });

      return p;
    };

    const result = await proms();

    return result;
  }

  /**
   * Prepares the video element for receiving
   * camera's input. Releases a stream if there
   * was any (resets).
   *
   * @param  {DOMElement} videoElem <video> dom element
   * @param  {Object} options     options (optional) - Additional options.
   *  inversionAttempts - (attemptBoth (default), dontInvert, onlyInvert, or invertFirst)
   *  refer to jsqr options: https://github.com/cozmo/jsQR
   */
  async decodeFromCamera(videoElem: HTMLVideoElement, options = {}) {
    const opts = {
      ...this.defaultOption,
      ...options,
    };

    this.stop();
    if (!navigator.mediaDevices.getUserMedia) {
      throw new Error("Couldn't get video from camera");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        this.videoConstraints,
      );
      videoElem.srcObject = stream;
      // videoElem.src = window.URL.createObjectURL(stream);
      this.videoElem = videoElem;
      this.stream = stream;

      const code = await this.decodeFromVideo(videoElem, opts);
      return code;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Prepares the video element for video file.
   *
   * @param  {DOMElement} videoElem <video> dom element
   * @param  {Object} options     options (optional) - Additional options.
   *  inversionAttempts - (attemptBoth (default), dontInvert, onlyInvert, or invertFirst)
   *  refer to jsqr options: https://github.com/cozmo/jsQR
   */
  async decodeFromVideo(videoElem: HTMLVideoElement, options = {}) {
    const opts = {
      ...this.defaultOption,
      ...options,
    };
    try {
      this.videoElem = videoElem;
      const code = await this._captureToCanvas(videoElem, opts);
      return code;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Decodes an image from its src.
   * @param  {DOMElement} imageElem
   * @param  {Object} options     options (optional) - Additional options.
   *  inversionAttempts - (attemptBoth (default), dontInvert, onlyInvert, or invertFirst)
   *  refer to jsqr options: https://github.com/cozmo/jsQR
   */
  async decodeFromImage(
    img: HTMLImageElement,
    options: { crossOrigin?: string } = {},
  ) {
    let imgDom: HTMLImageElement | null = null;
    const opts = {
      ...this.defaultOption,
      ...options,
    };
    if (+img.nodeType > 0) {
      if (!img.src) {
        throw new Error('The ImageElement must contain a src');
      }
      imgDom = img;
    } else if (typeof img === 'string') {
      imgDom = document.createElement('img');
      imgDom.src = img;
      if (options.crossOrigin) {
        imgDom.crossOrigin = options.crossOrigin;
      }
      const proms = () =>
        new Promise((resolve) => {
          imgDom!.onload = () => resolve(true);
        });
      await proms();
    }

    let code = null;
    if (imgDom) {
      code = this._decodeFromImageElm(imgDom, opts);
    }
    return code;
  }

  _decodeFromImageElm(imgObj: HTMLImageElement, options = {}) {
    const opts: Options = {
      ...this.defaultOption,
      ...options,
    };
    const imageData = this._createImageData(
      imgObj,
      imgObj.width,
      imgObj.height,
    );

    const code = jsQR(imageData.data, imageData.width, imageData.height, opts);

    if (code) {
      return code;
    }

    return false;
  }

  /**
   * Releases a video stream that was being
   * captured by prepareToVideo
   */
  stop() {
    if (this.stream) {
      const track = this.stream.getTracks()[0];
      track.stop();
      this.stream = null;

      // fix: clear black bg after camera capture
      this.videoElem!.srcObject = null;
    }

    if (this.timerCapture) {
      clearTimeout(this.timerCapture);
      this.timerCapture = null;
    }

    return this;
  }

  /**
   * Sets the sourceId for the camera to use.
   */
  setGroupId(groupId: string) {
    if (groupId) {
      this.videoConstraints.video = {
        advanced: [{ groupId }],
      };
    } else {
      this.videoConstraints.video = true;
    }

    return this;
  }

  /**
   * Gets a list of all available video sources on
   * the current device.
   */
  async getVideoDevices() {
    if (navigator.mediaDevices.enumerateDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((item: MediaDeviceInfo) => {
        if (item.kind === 'videoinput') {
          return true;
        }
        return false;
      });
    } else {
      throw new Error(
        'Current browser doest not support MediaStreamTrack.getSources',
      );
    }
  }
}

export default QrcodeDecoder;

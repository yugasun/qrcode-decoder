import 'babel-polyfill';
import jsQR from 'jsqr';
/* eslint-disable no-underscore-dangle */
class QrcodeDecoder {
    /**
     * Constructor for QrcodeDecoder
     */
    constructor() {
        this.timerCapture = null;
        this.canvasElem = null;
        this.gCtx = null;
        this.stream = null;
        this.videoElem = null;
        this.getUserMediaHandler = null;
        this.videoConstraints = { video: true, audio: false };

        this.defaultOption = { inversionAttempts: 'attemptBoth' };
    }

    /**
     * Verifies if canvas element is supported.
     */
    /* eslint-disable class-methods-use-this */
    isCanvasSupported() {
        const elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }

    /**
     * draw lint
     *
     * @param {object} begin line begin point
     * @param {object} end line end point
     * @param {string} color color string
     */
    // _drawLine(begin, end, color) {
    //     this.gCtx.beginPath();
    //     this.gCtx.moveTo(begin.x, begin.y);
    //     this.gCtx.lineTo(end.x, end.y);
    //     this.gCtx.lineWidth = 4;
    //     this.gCtx.strokeStyle = color;
    //     this.gCtx.stroke();
    // }

    /**
     * create qrcode marker
     *
     * @param {object} code jsqr parse code object
     */
    // _createQrcodeMark(code) {
    //     this._drawLine(
    //         code.location.topLeftCorner,
    //         code.location.topRightCorner,
    //         '#FF3B58',
    //     );
    //     this._drawLine(
    //         code.location.topRightCorner,
    //         code.location.bottomRightCorner,
    //         '#FF3B58',
    //     );
    //     this._drawLine(
    //         code.location.bottomRightCorner,
    //         code.location.bottomLeftCorner,
    //         '#FF3B58',
    //     );
    //     this._drawLine(
    //         code.location.bottomLeftCorner,
    //         code.location.topLeftCorner,
    //         '#FF3B58',
    //     );
    // }

    _createImageData(target, width, height) {
        if (!this.canvasElem) {
            this._prepareCanvas(width, height);
        }

        this.gCtx.clearRect(0, 0, width, height);
        this.gCtx.drawImage(target, 0, 0, width, height);

        const imageData = this.gCtx.getImageData(
            0,
            0,
            this.canvasElem.width,
            this.canvasElem.height,
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
    _prepareCanvas(width, height) {
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
    async _captureToCanvas(videoElem, options) {
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
                            code = await this._captureToCanvas(
                                videoElem,
                                options,
                            );
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
    async decodeFromCamera(videoElem, options = {}) {
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
            this.videoDimensions = false;

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
    async decodeFromVideo(videoElem, options = {}) {
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
     * @param  {DOMElement} img
     * @param  {Object} options     options (optional) - Additional options.
     *  inversionAttempts - (attemptBoth (default), dontInvert, onlyInvert, or invertFirst)
     *  refer to jsqr options: https://github.com/cozmo/jsQR
     */
    async decodeFromImage(img, options = {}) {
        let imgDom;
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
            imgDom.crossOrigin = 'Anonymous';
            const proms = () => new Promise((resolve) => {
                imgDom.onload = () => resolve(true);
            });
            await proms();
        }

        let code = false;
        if (imgDom) {
            code = this._decodeFromImageElm(imgDom, opts);
        }
        return code;
    }

    _decodeFromImageElm(imgObj, options = {}) {
        const opts = {
            ...this.defaultOption,
            ...options,
        };
        const imageData = this._createImageData(
            imgObj,
            imgObj.width,
            imgObj.height,
        );

        const code = jsQR(
            imageData.data,
            imageData.width,
            imageData.height,
            opts,
        );

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
            this.stream = undefined;

            // fix: clear black bg after camera capture
            this.videoElem.srcObject = null;
        }

        if (this.timerCapture) {
            clearTimeout(this.timerCapture);
            this.timerCapture = undefined;
        }

        return this;
    }

    /**
     * Sets the sourceId for the camera to use.
     *
     * The sourceId can be found using the
     * getVideoSources function on a browser that
     * supports it (currently only Chrome).
     *
     * @param {String} sourceId     The id of the
     * video source you want to use (or false to use
     * the current default)
     */
    setSourceId(sourceId) {
        if (sourceId) {
            this.videoConstraints.video = {
                optional: [{ sourceId }],
            };
        } else {
            this.videoConstraints.video = true;
        }

        return this;
    }

    /**
     * Gets a list of all available video sources on
     * the current device.
     * @param {Function} cb callback to be resolved
     * with error (first param) ou results (second
     * param) - a list containing all of the sources
     * that are of the 'video' kind.
     */
    getVideoSources() {
        const sources = [];

        if (!(MediaStreamTrack && MediaStreamTrack.getSources)) {
            throw new Error(
                'Current browser doest not support MediaStreamTrack.getSources',
            );
        }

        MediaStreamTrack.getSources((sourceInfos) => {
            sourceInfos.forEach((sourceInfo) => {
                if (sourceInfo.kind === 'video') {
                    sources.push(sourceInfo);
                }
            });
        });
        return sources;
    }
}

export default QrcodeDecoder;

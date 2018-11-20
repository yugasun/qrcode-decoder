const expect = require('expect.js');
const QrcodeDecoder = require('../dist/index.js');

describe('QrcodeDecoder', function () {
    //   global.mocha.checkLeaks = false;
    this.timeout(180000);

    it('be defined', function () {
        expect(QrcodeDecoder).to.be.ok();
    });

    var qr;

    beforeEach(function () {
        qr = new QrcodeDecoder();
    });

    describe('decodeFromImage', function () {
        it('decode image from img element', function (done) {
            const img = document.createElement('img');
            img.src = 'test/assets/qrcode.png';
            img.onload = async function () {
                const result = await qr.decodeFromImage(img);
                expect(result.data).to.equal('192.168.1.13:3000');
                done();
            }

        });

        it('decode image from img url', async function () {
            const result = await qr.decodeFromImage('test/assets/qrcode.png');
            expect(result.data).to.equal('192.168.1.13:3000');
        });

        it('throw if no src in image element', async function (done) {
            var img = document.createElement('img');
            try {
                await qr.decodeFromImage(img);
            } catch(e) {
                expect(e.message).to.equal('The ImageElement must contain a src')
                done();
            }
        });
    });

    describe('decodeFromCamera', function () {
        it('decode from a video with qrcode', async function () {
            const video = document.createElement('video');
            video.setAttribute('autoplay', true);
            video.setAttribute('src', 'test/assets/qrcode-video.mp4');

            const result = await qr.decodeFromVideo(video);
            expect(result.data).to.equal('192.168.1.13:3000');
        });
    });
});


import QrcodeDecoder from '../';

describe('QrcodeDecoder', () => {
  test('use', async () => {
    const res = await import('../dist');

    expect(res.default).toEqual(QrcodeDecoder);
  });

  test('new QrcodeDecoder()', async () => {
    const qr = new QrcodeDecoder();

    expect(qr).toBeDefined();
    expect(qr.videoConstraints).toEqual({
      video: {
        width: { min: 360, ideal: 720, max: 1080 },
        height: { min: 360, ideal: 720, max: 1080 },
        facingMode: { exact: 'environment' },
      },
      audio: false,
    });
    expect(qr.decodeFromImage).toBeDefined();
    expect(qr.decodeFromCamera).toBeDefined();
    expect(qr.decodeFromVideo).toBeDefined();
  });
});

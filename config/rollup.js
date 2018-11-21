const pkg = require('../package.json');

// 兼容 qrcode-decoder 和 @yugasun/qrcode-decoder
const name = pkg.name.split('/').pop();
const { version } = pkg;

const banner = `/* @preserve
 * qrcode-decoder ${version} (https://github.com/yugasun/qrcode-decoder)
 * API https://github.com/yugasun/qrcode-decoder/blob/master/doc/api.md
 * Copyright 2017-${new Date().getFullYear()} yugasun. All Rights Reserved
 * Licensed under MIT (https://github.com/yugasun/qrcode-decoder/blob/master/LICENSE)
 */
`;

export default {
    name,
    banner,
};

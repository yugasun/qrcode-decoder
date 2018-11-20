var pkg = require('../package.json');

// 兼容 qrcode-decoder 和 @yugasun/qrcode-decoder 
var name = pkg.name.split('/').pop();
var version = pkg.version;

var banner = 
`/*!
 * qrcode-decoder ${version} (https://github.com/yugasun/qrcode-decoder)
 * API https://github.com/yugasun/qrcode-decoder/blob/master/doc/api.md
 * Copyright 2017-${(new Date).getFullYear()} yugasun. All Rights Reserved
 * Licensed under MIT (https://github.com/yugasun/qrcode-decoder/blob/master/LICENSE)
 */
`;

exports.name = name;
exports.banner = banner;

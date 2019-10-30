// rollup.config.js

import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import common from './rollup';

const prod = process.env.NODE_ENV;

export default {
    input: 'src/index.js',
    output: {
        file: prod ? 'dist/qrcode-decoder.min.js' : 'dist/qrcode-decoder.aio.js',
        format: 'umd',
        // 如果不同时使用 export 与 export default 可打开legacy
        // legacy: true,
        // name: common.name,
        name: 'QrcodeDecoder',
        banner: common.banner,
    },
    plugins: [
        nodeResolve({
            main: true,
        }),
        commonjs({
            include: 'node_modules/**',
        }),
        babel({
            runtimeHelpers: true,
            exclude: 'node_modules/**',
        }),
        prod &&
            uglify({
                compress: {
                    drop_debugger: true,
                    drop_console: true,
                },
                output: {
                    comments: (node, comment) => {
                        if (comment.type === 'comment2') {
                            // multiline comment
                            return /@preserve|@license|@cc_on/i.test(
                                comment.value,
                            );
                        }
                        return false;
                    },
                },
            }),
    ],
};

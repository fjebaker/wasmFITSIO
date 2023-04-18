const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const WebpackConfig = {
    plugins: [
        new HTMLWebpackPlugin({
            template: "src/index.html",
            filename: "index.html"
        }),
        new CopyPlugin({
            // copy over the wasm blob
            patterns: [
              { from: "../zig-out/lib/wasmFITSIO.wasm",
                to: "wasmFITSIO.wasm" },
            ]
        })
    ],
    mode: 'development',
    externals: {
        'wasmer_wasi_js_bg.wasm': true
    },
}

module.exports = WebpackConfig;

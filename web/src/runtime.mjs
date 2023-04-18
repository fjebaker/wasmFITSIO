// webpack 5 fix:
import {Buffer} from 'buffer';
window.Buffer = window.Buffer || Buffer

import { init, WASI } from '@wasmer/wasi';

async function setup() {
    await init();
    const wasi = new WASI({
        args: [
            'wasmfitsio', 'input.fits'
        ],
        preopens: {'/': '/',},
    });
    const moduleBytes = fetch("wasmFITSIO.wasm");
    const module = await WebAssembly.compileStreaming(moduleBytes);
    // Instantiate the WASI module
    wasi.instantiate(module, {});
    return wasi;
}

async function runwasm(wasi, filecontent) {
    let file = wasi.fs.open("/input.fits", {read: true, write:true, create: true});
    file.write(filecontent);
    file.seek(0);

    // Run the start function
    let exitCode = wasi.start();
    let stdout = wasi.getStdoutString();

    return stdout;
}

export {runwasm, setup};

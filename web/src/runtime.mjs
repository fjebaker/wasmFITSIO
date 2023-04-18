// webpack 5 fix:
import {Buffer} from 'buffer';
window.Buffer = window.Buffer || Buffer

import { init, WASI } from '@wasmer/wasi';

async function setup() {
    await init();
    const moduleBytes = fetch("wasmFITSIO.wasm");
    const module = await WebAssembly.compileStreaming(moduleBytes);
    return module;
}

async function runwasm(module, filecontent) {
    const wasi = new WASI({
        args: [
            'wasmfitsio', 'input.fits'
        ],
        preopens: {'/': '/',},
    });
    
    let file = wasi.fs.open("/input.fits", {read: true, write:true, create: true});
    file.write(filecontent);
    file.seek(0);

    // Instantiate the WASI module
    wasi.instantiate(module, {});

    // Run the start function
    let exitCode = wasi.start();
    console.log(exitCode);
    let stdout = wasi.getStdoutString();
    let stderr = wasi.getStderrString();

    return {stdout, stderr};
}

export {runwasm, setup};

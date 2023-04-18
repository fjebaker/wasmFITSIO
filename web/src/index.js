import {setup, runwasm} from "./runtime.mjs";

var input = document.querySelector('input[type=file]');
var textarea = document.querySelector('#stdout');

// singleton
var wasi = undefined;

function readFile(event) {
    console.log("EXEC");
    runwasm(wasi, new Uint8Array(event.target.result)).then(value => {
        textarea.innerHTML = value;
    });
}

function changeFile() {
  var file = input.files[0];
  var reader = new FileReader();
  reader.addEventListener('load', readFile);
  reader.readAsArrayBuffer(file);

}

setup().then(w => {
    wasi = w;
    input.addEventListener('change', changeFile);
});


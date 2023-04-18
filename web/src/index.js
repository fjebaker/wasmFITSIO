import {setup, runwasm} from "./runtime.mjs";

var input = document.querySelector('input[type=file]');
var textarea = document.querySelector('#stdout');

// singleton
var module = undefined;

function readFile(event) {
    console.log("EXEC");
    runwasm(module, new Uint8Array(event.target.result))
        .then(res => {
        textarea.innerHTML = res.stdout;
    });
}

function changeFile() {
  var file = input.files[0];
  var reader = new FileReader();
  reader.addEventListener('load', readFile);
  reader.readAsArrayBuffer(file);

}

setup().then(m => {
    module = m;
    input.addEventListener('change', changeFile);
});


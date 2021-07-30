// import path from 'path';
// import { imageToBase64, base64ToImage } from '../index';

const path = require("path");
const { base64ToImage, imageToBase64 } = require("../index");

const url = 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80' // random image from google
imageToBase64(url).then(function(base64String) {
  // console.log(base64String);
});

async function main() {
  const url = path.resolve(__dirname, '..', 'tests', 'assets', 'sample.png');
  const base64String = await imageToBase64(url);

  const option = {
    filePath: path.resolve(__dirname, '..', 'tmp'),
    fileName: 'sampleImage',
    randomizeFileName: false
  };

  const message = await base64ToImage(base64String, option);
  console.log(message); // success
}

main().catch(console.error);

var { expect } = require('chai').expect;
var fs = require('fs'),
  chai = require('chai'),
  expect = chai.expect,
  path = require('path'),
  { imageToBase64, base64ToImage } = require('../index');


var b64String;

var deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

describe('image to base64', function () {
  it('should convert an image url to base64 string', async function () {
    var url = "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80";
    var base64String = await imageToBase64(url);

    expect(base64String.split(';')[0]).to.equal('data:image/jpeg');
    expect(/;base64,/.test(base64String)).to.equal(true);
    expect(typeof base64String).to.be.a('string');
  });

  it('should convert an image file to base64 string', async function () {
    var image = path.resolve(__dirname, "assets", "sample.png");
    var base64String = await imageToBase64(image);

    expect(base64String).to.be.a('string');
    expect(base64String).to.contain(';base64,');
    expect(typeof base64String).to.be.a('string');
    b64String = base64String;
  });

  it('should throw an error if provided image is not found', async function () {
    try {
      var filePath = path.resolve(__dirname, "assets", "sample.jpg")
      await imageToBase64(filePath);
    } catch (err) {
      expect(err.message).to.equal(`ENOENT: no such file or directory, stat ${filePath}`);
    }
  });

  it('should throw an error if provided url is not an image link', async function () {
    try {
      await imageToBase64(path.resolve(__dirname, "assets", "sample.bmp")); // bitmap images are valid image types but are not supported in this library
    } catch (err) {
      expect(err.message).to.equal('Provide a valid image or image url');
    }
  })

  it('should throw an error if provided url is not a valid image', async function () {
    try {
      await imageToBase64('https://www.example.com');
    } catch (err) {
      expect(err.message).to.equal('Provide a valid image or image url');
    }
  });
});

describe('base64 to image', function () {
  var directoryName = 'tmps';
  var samplefilePath = path.resolve(__dirname, 'sample');
  var filePath = path.resolve(process.env.PWD, directoryName);
  it('should create directory if directory path does not already exists', async function () {
    var message = await base64ToImage(b64String, { filePath, randomizeFileName: true, fileName: 'img' });
    expect(message).to.equals('success');
  });

  it('should create file if directory path already exists', async function () {
    var _message = await base64ToImage(b64String, { filePath, randomizeFileName: true, fileName: 'img' });
    expect(_message).to.equals('success');
  });

  it('should convert a base64 string to image blob', async function () {
    await base64ToImage(b64String, { filePath: samplefilePath, fileName: 'img' });
    fs.readdirSync(filePath, function (err, files) {
      expect(files.length).to.be.greaterThan(0);
    });
  });

  it('should convert a headless base64 string to an image blob', async function () {
    var headlessBase64String = b64String.split(';base64,').pop();
    await base64ToImage(headlessBase64String, { filePath: samplefilePath, fileName: 'img1' });
    fs.readdir(filePath, function (err, files) {
      expect(files.length).to.be.equal(2);
    });
  });

  this.afterAll(() => {
    deleteFolderRecursive(filePath);
    deleteFolderRecursive(samplefilePath)
  })
});

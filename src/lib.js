var fs = require('fs');
var path = require('path');
var https = require('https');
var fileType = require('file-type');

/**
 * a function that checks if provided image is a png, jpeg or jpg file
 * @param {string} image 
 * @returns {boolean} true | false
 */
function isValidImage(image) {
  return /(?<=\S+)\.(jpg|png|jpeg)/gi.test(image);
}

/**
 * a function that encodes a buffer into a base64 string
 * @param {*} buffer 
 * @returns 
 */
function base64ToNode(buffer) {
  return buffer.toString('base64');
}

/**
 * validate a base64 string to determine if it has a header
 * @param {string} img 
 * @returns {boolean} true | false
 */
function isImage(img) {
  return /^data:image/.test(img);
}

/**
 * validate that a given string is a url string
 * @param {string} url 
 * @returns {boolean} true | false
 */
function isValidUrl(url) {
  return /http(s)?:\/\/(\w+:?\w*@)?(\S+)(:\d+)?((?<=\.)\w+)+(\/([\w#!:.?+=&%@!\-/])*)?/gi.test(url);
}

/**
 *
 * @param {*} imgOrUrl
 */
async function imageToBase64(imgOrUrl) {
  return new Promise(function (resolve, reject) {
    if (isValidUrl(imgOrUrl)) {
      var base64String = readUrlAndConvert(imgOrUrl);
      resolve(base64String);
    } else {
      try {
        if (isValidImage(imgOrUrl)) {
          var base64String = readImageAndConvert(imgOrUrl);
          return resolve(base64String);
        }
        reject(new Error("Provide a valid image or image url"));
      } catch (err) {
        /* istanbul ignore next */
        reject(err);
      }
    }
  });
}

/**
 * read image url and convert to image
 * @param {*} url
 * @returns {}  | never
 */
async function readUrlAndConvert(url) {
  return new Promise(function (resolve, reject) {
    var body;
    https
      .get(url, function (resp) {
        resp.setEncoding('base64');
        body = `data:${resp.headers['content-type']};base64,`;
        resp.on('data', function (data) {
          body += data;
        });
        resp.on('end', function () {
          if (isImage(body)) {
            return resolve(body);
          }

          reject(new Error("Provide a valid image or image url"));
        });
      })
      .on('error',
        /* istanbul ignore next */
        function (e) {
          /* istanbul ignore next */
          reject(e);
        });
  })
}

/**
 * read image blob and convert to base64
 * @param {*} fileName
 * @returns {img} string | null
 */
async function readImageAndConvert(fileName) {
  /* istanbul ignore next */
  if (fs.statSync(fileName).isFile()) {
    // var mime = await imageType(fileName);
    var { mime } = await fileType.fromFile(fileName);
    var base64String = base64ToNode(fs.readFileSync(path.resolve(fileName)).toString('base64'));

    return `data:${mime};base64,${base64String}`;
  }
}

/**
 * a function that generates a random string of a given length
 * @param {number} length 
 * @returns {string} result
 */
function randomImageName(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
}

function writeImageFileToDisk(options) {
  return new Promise(function (resolve, _) {
    var message = 'success';
    var { filePath, fileName, randomizeFileName, base64ImageString } = options;
    fileName = randomizeFileName ? randomImageName(5) : fileName;
    try {
      /* istanbul ignore next */
      if (fs.statSync(path.resolve(filePath)).isDirectory()) {
        // allow file type to be passed as an option in next release version and a full directory path or rootDir if not specified
        fs.writeFile(path.resolve(filePath, fileName + '.png'), base64ImageString, { encoding: "base64" }, function () {
          return resolve(message);
        });
      }
    } catch (e) {
      /* istanbul ignore next */
      if (e.code == 'ENOENT') {
        fs.mkdir(path.resolve(filePath), function () {
          fs.writeFile(path.resolve(filePath, fileName + '.png'), base64ImageString.toString(), { encoding: "base64" }, function () {
            return resolve(message);
          });
        });
      } else {
        // Error.captureStackTrace(e, writeImageFileToDisk);
        // reject(e.message.toString())
        /* istanbul ignore next */
        throw e;
      }
    }
  })
}

/**
 * a function that writes a base64 image into a raw binary (blob) image file
 * @param {*} base64String 
 * @param {*} options 
 */
async function base64ToImage(base64String, options) {
  // check base64 string and remove header if exists
  var base64ImageString = /^data:image\/(png|jpg|jpeg);base64,/.test(base64String) ? base64String.split(';base64,').pop() : base64String;
  options = Object.assign({}, { filePath: process.env.PWD, fileName: 'image', randomizeFileName: false, base64ImageString }, options);

  return writeImageFileToDisk(options);
}

module.exports = { imageToBase64, base64ToImage };

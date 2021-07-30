# Base64-2-img

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/ajimae/base64-2-img/qa/master) ![Coveralls branch](https://img.shields.io/coveralls/github/ajimae/base64-2-img/master) ![GitHub](https://img.shields.io/github/license/ajimae/base64-2-img)

![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/ajimae/base64-2-img?color=%23D8B024&include_prereleases) [![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ajimae/base64-2-img)](https://github/languages/code-size/ajimae/base64-2-img) [![GitHub issues](https://img.shields.io/github/issues/ajimae/base64-2-img)](https://github.com/ajimae/base64-2-img/issues)


**base64-2-img** is a light weight javascript `image to base64` string and `base64 string to image` conversion library for nodejs. This library implements the nodejs core [http](https://nodejs.org/api/http.html) module to read an image blob into a base64 string.

## Contents

* [Base64-2-img](#Base64-2-img)
  * [Contents](#contents)
  <!-- * [Changes Log (What's New)](#changes-log-whats-new) -->
  * [Getting Started](#getting-started)
    * [Installation](#installation)
  * [Documentation](#documentation)
    * [Library Functions](#library-functions)
    * [Using the library](#using-the-library)
  * [Contribution](#contribution)
  * [Version Management](#version-management)
  * [Authors](#authors)
  * [License](#license)

<!-- ## Changes Log (What's New)

For full changelog, please refers to [CHANGELOG](CHANGELOG.md) file. -->

## Getting Started

This library is available through these javascript node package manager [npm](https://www.npmjs.org/) and [yarn](https://www.yarnpkg.com/).

### Installation
To use this library, first ensure you have a package manager initialized either with [npm](https://www.npmjs.org/) or [yarn](https://www.yarnpkg.com/)

```bash
# for npm use:
npm install --save base64-2-img

# for yarn use:
yarn add base64-2-img
```

To include **_image-2-base64_** in your project. use one of these:

```js
// ES6 and later
import { imageToBase64, base64ToImage } from "base64-2-img";

// or
import * as img2Base64 from "base64-2-img";
```

However, if you are using ECMAScript 5 and older, use the require statement:

```js
// ES5 and older
var { imageToBase64, base64ToImage } = require("base64-2-img");

// or
var img2Base64 = require("base64-2-img");
```

## Documentation

**_Img-2-base64_** is a simple library with only two exposed functions. This is all intentional mainly to keep everything simple. This is a complete documentation of the library and how to use it in your project. All examples work on both ECMAScript 5 (ES5 and older).

### Library Functions


| Function      |                               Description                                      |                                Parameter                                |      Return                          |
| ------------- | :----------------------------------------------------------------------------: | :---------------------------------------------------------------------: | -------------------------------------|
| imageToBase64 | Accepts an image url or disk path return a base64 representation of the image  |  *_url_* - {string}: image uri or disk image file path                  | *_base64String_* - a base64 string   |
| base64ToImage | Accepts a base64 string and an option {object} and creates an image file (blob)|  *_base64String_* - {string}: a base64 string representation of an image| *_success_* or *_Error_* - a promise that resolves to success if file was created or throws an error |

The _**base64ToImage(base64String[, option])**_ function accepts two arguments

- `base64String` - This is a required filed which is simply an image in base64 representation e.g `/9j/4AAQSkZJRgABAQEASA...`
- `option` - This is **optional** and can be `one` or `all` of the following properties
  - `filePath` {string} - The directory path where the is to be generated defaults to the `parent working directory`.
  - `fileName` {string} - The name of the file excluding the extensioin - the extension will be generated based on the base64 header if present or default to the name `image.png`.
  - `randomizeFileName` {boolean} - Defaults to `false`, if set to `true` this will use a randomized string as the image name e.g xHyu45.jpg.

### Using the library

```javascript
import { imageToBase64, base64ToImage } from "base64-2-img";

// using a remote image url - promises
var url = "http://image-file-path"
imageToBase64(url).then(function(_base64String) {
  console.log(_base64String); // data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASA...
});

// using a local image file path - async-await
async function main() {
  var url = path.resolve(__dirname, "..", "sampleImage.png");
  var base64String = await imageToBase64(url);

  var outputFilePath = path.resolve(__dirname, "temp");
  base64ToImage(base64String, { filePath: outputFilePath, fileName: 'img' }); // success and create a file at temp/img.png or temp/img.jpg.

  // or
  var message = await base64ToImage(base64String, { filePath: outputFilePath, fileName: 'img' });
  console.log(message); // success
}
...

```
**<u>NOTE:</u>** See the example folder for the full working code.

## Contribution
To contribute, simply fork this project, and issue a pull request.

## Version Management
We use [SemVer](http://semver.org/) for version management. For the versions available, see the [tags on this repository](https://github.com/ajimae/base64-2-img/tags).

## Authors
Chukwuemeka Ajima - [ajimae](https://github.com/ajimae)

<!-- Feel free to include a CONTRIBUTORS.md file and modify this contributors secion -->
<!-- See also the list of [contributors](CONTRIBUTORS) who participated in this project. -->

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

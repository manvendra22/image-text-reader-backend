# Image Text Reader

[![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](https://github.com/SMPyBandits/SMPyBandits/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/SMPyBandits/SMPyBandits/graphs/commit-activity)

> Image Text Reader is a web app to read texts from an image using google’s cloud vision api.

### Live Link

https://image-text-reader.herokuapp.com/

### Tech stack:

- React
- ExpressJS
- SCSS
- Google cloud vision api
- Google cloudDB

### Features:

- Text recognition from image
- Shows old image search history
- Explicit content detection (yet to be implemented)

### Installation

It requires Node and NPM to run.
Clone the project from github.

    $ git clone https://github.com/manvendra22/image-text-reader.git
    $ cd image-text-reader

#### For Frontend to run on port 3000

    $ cd client
    $ npm install
    $ npm start

#### For Backend to run on port 9000

    $ npm install
    $ npm start

### Roadmap:

 - [ ] Make responsive
 - [ ] Remove third party dependency for image upload
 - [x] Move frontend and backend to same repo and host on same server
 - [ ] Make mobile design more native
 - [ ] Implement explicit content detection (Safe search)
 - [ ] Add animations, make interactions look beautiful

# Image Text Reader

> Image Text Reader is a responsive web app to read texts from an image using google’s cloud vision api.

### Live Link

https://image-text-reader.herokuapp.com/

![Screenshot](https://res.cloudinary.com/dracarys/image/upload/image_text.png)

### Tech stack:

- React
- ExpressJS
- SCSS
- Google cloud vision api

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

#### For running both Frontend & Backend in one shot using concurrently

    $ npm run dev

### Roadmap:

 - [x] Make responsive
 - [ ] Remove third party dependency for image upload
 - [x] Move frontend and backend to same repo and host on same server
 - [ ] Make mobile design more native
 - [ ] Migrate from google api to ocr space api
 - [ ] Add animations, make interactions look beautiful

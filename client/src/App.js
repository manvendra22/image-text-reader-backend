import React, { Fragment } from 'react';
import './App.css';

import github from './icons/github.svg';

import ImageTextReader from './components/ImageTextReader'

function App() {
  return (
    <Fragment>
      <a target="_blank" href="https://github.com/manvendra22/image-text-reader" className="git-link">
        <img src={github} alt="github-logo" className="icon-git" />
      </a>
      <div className="container">
        <ImageTextReader />
      </div>
    </Fragment>
  );
}

export default App;

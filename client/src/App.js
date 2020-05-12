import React, { Fragment } from 'react';
import './App.css';

import github from './icons/github.svg';

import HandwrtingRecognition from './components/HandwrtingRecognition'

function App() {
  return (
    <Fragment>
      <a target="_blank" href="https://github.com/manvendra22/image-text-reader" class="git-link">
        <img src={github} alt="github-logo" className="icon-git" />
      </a>
      <div className="container">
        <HandwrtingRecognition />
      </div>
    </Fragment>
  );
}

export default App;

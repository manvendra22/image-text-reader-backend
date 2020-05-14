import React, { Component } from 'react'
import ReactDropzone from 'react-dropzone';

import './Dropzone.css'

import photo from '../icons/photo.svg';
import failed from '../icons/failed.svg';
import upload from '../icons/upload.svg';

class Dropzone extends Component {

    onDrop = (files) => {
        if (files.length) {
            let file = files[0]
            let data = new FormData();
            data.append('document', file);
            this.props.callVisionApi(data)
        }
    }

    render() {
        return (
            <ReactDropzone
                onDrop={this.onDrop.bind(this)}
                accept="image/*"
                multiple={false}
            >
                {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
                    <div className="dropzone-container" {...getRootProps()}>
                        <input {...getInputProps()} />
                        {
                            isDragReject ?
                                <div className="dropzone-content">
                                    <div>File type not accepted/<br />
                                        Multiple files not allowed<br />
                                        Please try again</div>
                                    <img
                                        src={failed} className="drop-logo" alt="failed-logo"
                                    />
                                </div>
                                :
                                !isDragActive ?
                                    <div className="dropzone-content">
                                        <div>Drag image file here or<br />
                                            Click inside the box to browse</div>
                                        <img
                                            src={photo} className="drop-logo" alt="upload-logo"
                                        />
                                    </div> :
                                    <div className="dropzone-content">
                                        <div>Drop your file here</div>
                                        <img
                                            src={upload} className="drop-logo" alt="uploading-logo"
                                        />
                                    </div>

                        }
                    </div>
                )}
            </ReactDropzone>
        )
    }
}

export default Dropzone
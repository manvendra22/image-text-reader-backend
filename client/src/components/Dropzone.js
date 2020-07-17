import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone';

import styles from './Dropzone.module.css'

import photo from '../icons/photo.svg';
import failed from '../icons/failed.svg';
import upload from '../icons/upload.svg';

export default function Dropzone(props) {

    const onDrop = useCallback(files => {
        if (files.length) {
            console.log({ files })
            let file = files[0]
            let data = new FormData();
            data.append('image', file);
            props.callVisionApi(data)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({ onDrop, multiple: false, accept: "image/*" })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragReject ?
                    <div className={styles.dropzoneContent}>
                        <img
                            src={failed} className={styles.dropLogo} alt="failed-logo"
                        />
                        <div>File type not accepted / multiple files not allowed</div>
                    </div>
                    :
                    !isDragActive ?
                        <div className={styles.dropzoneContent}>
                            <img
                                src={photo} className={styles.dropLogo} alt="upload-logo"
                            />
                            <div>Drag your image here, or <span className={styles.highlight}>browse</span></div>
                        </div> :
                        <div className={styles.dropzoneContent}>
                            <img
                                src={upload} className={styles.dropLogo} alt="uploading-logo"
                            />
                            <div>Drop your file here</div>
                        </div>

            }
        </div>
    )
}
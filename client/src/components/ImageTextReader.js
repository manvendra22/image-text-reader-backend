import React, { useState } from 'react'
import axios from 'axios';

import styles from './ImageTextReader.module.css'

import Dropzone from './Dropzone'
import ViewContent from './ViewContent'

const API_URL = '/api/contents'

export default function ImageTextReader() {
    const [view, setView] = useState('ViewContent')
    const [result, setResult] = useState(null)
    const [image, setImage] = useState(null)
    const [fetching, setFetching] = useState(false)

    async function callVisionApi(file) {
        const image = URL.createObjectURL(file)
        setImage(image)
        setFetching(true)
        setView('ViewContent')

        let data = new FormData();
        data.append('image', file);

        try {
            const res = await axios.post(API_URL, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            let res_data = res.data
            setResult(res_data)
            setFetching(false)
        } catch (e) {
            console.log(e)
            setFetching(false)
        }
    }

    function goToHome() {
        setView('Home')
    }

    return (
        <div className={styles.container}>
            {
                view === 'Home' ?
                    <>
                        <Dropzone callVisionApi={callVisionApi} />
                    </>
                    :
                    <>
                        <span className="link" onClick={goToHome}>Back to home</span>
                        <ViewContent image={image} fetching={fetching} data={result} />
                    </>

            }
        </div>
    )
}

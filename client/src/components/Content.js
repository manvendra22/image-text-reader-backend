import React from 'react'
import styles from './Content.module.css'

export default function Content({ description, file, mimetype }) {

    const image = `data:${mimetype};base64,${Buffer.from(file.data).toString('base64')}`

    return (
        <>
            <div className={styles.resultImage}>
                <img
                    src={image} className={styles.mediaImage} alt="media-logo"
                />
            </div>
            <div className={styles.resultDescription}>
                {description}
            </div>
        </>
    )
}
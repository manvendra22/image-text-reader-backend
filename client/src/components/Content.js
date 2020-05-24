import React from 'react'
import styles from './Content.module.css'

export default function Content(props) {
    return (
        <div className={styles.result} key={props.id}>
            <div className={styles.resultImage}>
                <img
                    src={props.mediaLink} className={styles.mediaImage} alt="media-logo"
                />
            </div>
            <div className={styles.resultDescription}>
                {props.description}
            </div>
        </div>
    )
}
import React from 'react'
import styles from './ViewContent.module.css'

const style = [
    { top: '10%', left: '5%' },
    { top: '20%', right: '5%' },
    { top: '40%', left: '15%' },
    { top: '50%', right: '15%' },
    { bottom: '10%', left: '5%' }
]

export default function ViewContent({ content }) {
    const { description, file, mimetype } = content

    const classesData = description?.images?.[0].classifiers?.[0].classes.slice(0, 5)
    const image = `data:${mimetype};base64,${Buffer.from(file.data).toString('base64')}`

    return (
        <div className={styles.viewContent}>
            <div className={styles.resultImage}>
                <img
                    src={image} className={styles.mediaImage} alt="media-logo"
                />
            </div>
            {
                classesData.map((data, i) => (
                    <div key={data.class} className={styles.result} style={style[i]}>
                        <div>{data.class}</div>
                        <div>{(data.score * 100).toFixed(2)}%</div>
                    </div>)
                )
            }
        </div>
    )
}
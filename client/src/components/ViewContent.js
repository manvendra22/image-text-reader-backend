import React from 'react'
import styles from './ViewContent.module.css'

const style = [
    { top: '10%', left: '5%' },
    { top: '20%', right: '5%' },
    { top: '40%', left: '10%' },
    { top: '50%', right: '10%' },
    { bottom: '10%', left: '5%' }
]

export default function ViewContent({ content }) {
    const { description, file, mimetype } = content

    const classesData = description?.images?.[0].classifiers?.[0].classes
    const image = `data:${mimetype};base64,${Buffer.from(file.data).toString('base64')}`

    // const classesData = [{ class: 'dog', score: "9.50" }, { class: 'animal', score: "9.00" }, { class: 'blacks', score: "8.50" }, { class: 'blackss', score: "8.50" }, { class: 'blacksss', score: "8.50" }]
    // const image = 'https://phillipbrande.files.wordpress.com/2013/10/random-pic-14.jpg'

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
                        <div>{data.score}</div>
                    </div>)
                )
            }
        </div>
    )
}
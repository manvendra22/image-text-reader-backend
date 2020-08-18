import React from 'react'
import styles from './ViewContent.module.css'

import Scanner from './Scanner'

const style = [
    { top: '10%', left: '5%' },
    { top: '25%', right: '5%' },
    { top: '40%', left: '15%' },
    { top: '55%', right: '15%' },
    { top: '70%', left: '5%' }
]

export default function ViewContent({ image, fetching, data = {} }) {
    const classesData = data?.result?.images?.[0].classifiers?.[0].classes.slice(0, 5)

    return (
        <div className={styles.viewContent}>
            <div className={styles.resultImage}>
                <img
                    src={image}
                    className={styles.mediaImage} alt="media-logo"
                />
            </div>
            {fetching ? <Scanner /> :
                classesData &&
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
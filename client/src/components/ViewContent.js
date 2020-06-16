import React from 'react'
import Content from './Content'

import styles from './ViewContent.module.css'

export default function ViewContent({ content }) {

    return (
        <div className={styles.viewContent}>
            {Object.keys(content).length ?
                <Content {...content} /> :
                <div>Please add some images</div>
            }
        </div>
    )
}
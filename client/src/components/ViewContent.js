import React from 'react'
import Content from './Content'

import styles from './ViewContent.module.css'

export default function ViewContent({ contents }) {

    return (
        <div className={styles.viewContent}>
            {contents.length ?
                contents.map(content => <Content {...content} />) :
                <div>Please add some images</div>
            }
        </div>
    )
}
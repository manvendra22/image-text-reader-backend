import React, { Component } from 'react'

import './ViewContent.css'

class ViewHistory extends Component {

    state = {
        contents: [],
    }

    componentDidMount() {
        const { contents } = this.props

        this.setState({
            contents,
        })
    }

    componentDidUpdate(prevProps) {
        const { contents } = this.props

        if (prevProps.contents !== contents) {
            this.setState({
                contents
            })
        }
    }

    render() {
        const { contents } = this.state

        return (
            <div>
                {contents.length ?
                    contents.map((content, index) => {
                        return (
                            <div className="result" key={index}>
                                <div className="result-image">
                                    <img
                                        src={content.mediaLink} className="media-image" alt="media-logo"
                                    />
                                </div>
                                <div className="result-description">
                                    {content.description}
                                </div>
                            </div>
                        )
                    }) :
                    <div>Please add some images</div>
                }
            </div>
        )
    }
}

export default ViewHistory
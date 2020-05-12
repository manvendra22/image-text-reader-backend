import React, { Fragment, Component } from 'react'

import './ViewContent.css'

class ViewContent extends Component {

    state = {
        result: {}
    }

    componentDidMount() {
        const { result } = this.props

        this.setState({
            result,
        })
    }

    componentDidUpdate(prevProps) {
        const { result } = this.props

        if (prevProps.result !== result) {
            this.setState({
                result
            })
        }
    }

    render() {
        const { result } = this.state

        return (
            <Fragment>
                {Object.keys(result).length ?
                    <div className="result">
                        <div className="result-image">
                            <img
                                src={result.mediaLink} className="media-image" alt="media-logo"
                            />
                        </div>
                        <div className="result-description">
                            {result.description}
                        </div>
                    </div> :
                    <div>Please add some images</div>
                }
            </Fragment>
        )
    }
}

export default ViewContent
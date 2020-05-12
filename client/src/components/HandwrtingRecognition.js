import React, { Component, Fragment } from 'react'
import axios from 'axios';

import Loader from './Loader'
import Dropzone from './Dropzone'
import ViewContent from './ViewContent'
import ViewHistory from './ViewHistory'

// const API_URL = process.env.REACT_APP_BASE_URL
const API_URL = '/api/contents'

class HandwritingRecognition extends Component {

    state = {
        contents: [],
        result: {},
        isFetching: false,
        view: ''
    };

    setStateSync = state => {
        return new Promise(resolve => {
            this.setState(state, resolve())
        })
    }

    goToHome = () => {
        this.setState({
            view: ''
        })
    }

    getHistoryData = async data => {
        await this.setStateSync({ isFetching: true })
        try {
            const res = await axios.get(API_URL)
            let contents = res.data.contents
            await this.setStateSync({ isFetching: false, contents, view: 'ViewHistory' })
        } catch (e) {
            console.log(e)
            await this.setStateSync({ isFetching: false, view: '' })
        }
    }

    callVisionApi = async data => {
        await this.setStateSync({ isFetching: true })
        try {
            const res = await axios.post(API_URL, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            let result = res.data.result
            await this.setStateSync({ isFetching: false, result, view: 'ViewContent' })
        } catch (e) {
            console.log(e)
            await this.setStateSync({ isFetching: false, view: '' })
        }
    }

    render() {
        const { isFetching, contents, result, view } = this.state
        return (
            <Fragment>
                {
                    isFetching ?
                        null :
                        <div>
                            {view === 'ViewHistory' ?
                                <button type="button" onClick={this.goToHome}>Home</button> :
                                <button type="button" onClick={this.getHistoryData}>Display previous results</button>
                            }
                        </div>

                }
                <div className="dropzone">
                    {
                        isFetching ? <Loader /> :
                            view === 'ViewContent' ? <ViewContent result={result} /> :
                                view === 'ViewHistory' ? <ViewHistory contents={contents} /> :
                                    <Dropzone callVisionApi={this.callVisionApi} />
                    }
                </div>
            </Fragment>
        )
    }
}

export default HandwritingRecognition
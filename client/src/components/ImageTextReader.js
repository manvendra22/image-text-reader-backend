import React, { Component, Fragment } from 'react'
import axios from 'axios';

import Loader from './Loader'
import Dropzone from './Dropzone'
import ViewContent from './ViewContent'

const API_URL = '/api/contents'

class ImageTextReader extends Component {
    state = {
        view: '',
        contents: [],
        isFetching: false
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
            await this.setStateSync({ isFetching: false, contents, view: 'ViewContent' })
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
            let contents = res.data.contents
            await this.setStateSync({ isFetching: false, contents, view: 'ViewContent' })
        } catch (e) {
            console.log(e)
            await this.setStateSync({ isFetching: false, view: '' })
        }
    }

    render() {
        const { isFetching, contents, view } = this.state
        return (
            <Fragment>
                {
                    isFetching ?
                        null :
                        <Fragment>
                            {view === 'ViewContent' ?
                                <button type="button" onClick={this.goToHome}>Home</button> :
                                <button type="button" onClick={this.getHistoryData}>Display previous results</button>
                            }
                        </Fragment>

                }
                {
                    isFetching ? <Loader /> :
                        view === 'ViewContent' ? <ViewContent contents={contents} /> :
                            <Dropzone callVisionApi={this.callVisionApi} />
                }
            </Fragment>
        )
    }
}

export default ImageTextReader
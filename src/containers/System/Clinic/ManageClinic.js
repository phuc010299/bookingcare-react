
import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES, CommonUtils } from '../../../utils'
import HomeHeader from '../../HomePage/HomeHeader';
import { FormattedMessage } from 'react-intl';
import './ManageClinic.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import userService from '../../../services/userService';
import { toast } from 'react-toastify';


const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            address: '',
        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps) {
        if (prevProps.language !== this.props.language) {

        }
    }
    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
    }


    handleOnchangeInput = (event, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = event.target.value
        this.setState({
            ...stateCopy
        })
    }

    handleOnchangeImg = async (event) => {
        let data = event.target.files;
        let file = data[0]

        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            // let objectUrl = URL.createObjectURL(file)

            this.setState({
                imageBase64: base64
            })
        }
    }

    handleSaveNewClinic = async () => {
        let res = await userService.createClinic(this.state)
        if (res && res.errCode === 0) {
            toast.success('create clinic succeed')
            this.setState({
                name: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
                address: '',
            })
        } else {
            toast.error('create clinic failed')
        }
        console.log('check state', this.state)
    }


    render() {
        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'>Quản lý phòng khám</div>
                <div className='add-new-specialty row'>
                    <div className='col-6 form-group'>
                        <label>Tên phòng khám</label>
                        <input
                            className='form-control'
                            value={this.state.name}
                            onChange={(event) => this.handleOnchangeInput(event, 'name')}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Ảnh phòng khám</label>
                        <input
                            className='form-control-file'
                            type='file'
                            onChange={(event) => this.handleOnchangeImg(event)}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Địa chỉ phòng khám</label>
                        <input
                            className='form-control'
                            onChange={(event) => this.handleOnchangeInput(event, 'address')}
                            value={this.state.address}

                        />
                    </div>
                    <div className='col-12'>
                        <MdEditor
                            style={{ height: '500px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button
                            className='btn-save-specialty'
                            onClick={() => this.handleSaveNewClinic()}
                        >save</button>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);

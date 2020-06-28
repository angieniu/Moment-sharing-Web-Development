import React from 'react';
import { Form, Input, Upload, Icon } from 'antd';

class NormalCreatePostForm extends React.Component {
    normFile = e => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    beforeUpload = () => false;
    // beforeUpload 不直接upload
// getFieldDecorate函数(校验规则key， rules)(ui) // action自动上传 beforeUpload 手动上传
    //getValueFromEvent: this.normFile 函数
    //上传两种： 1. 选择file ->执行上传  2.选择file -> click button ->上传 ✔️
    //表单的操作：1. ui 2. 表单提交 3. 表单校验：前端：密码，数据date type, required;  后端
    //beforeUpload(函数) API attribute of upload.dragger ui
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <Form {...formItemLayout}>
                <Form.Item label="Message">
                    {getFieldDecorator('message', {
                        rules: [{ required: true, message: 'Please input message.' }],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="Image/Video">
                    <div className="dropbox">
                        {getFieldDecorator('image', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            rules: [{ required: true, message: 'Please select an image.' }]
                        })(
                            <Upload.Dragger name="files" beforeUpload={this.beforeUpload}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                            </Upload.Dragger>,
                        )}
                    </div>
                </Form.Item>
            </Form>

        );
    }
}

const CreatePostForm = Form.create()(NormalCreatePostForm); /*HOC 向外暴露CreatePostForm, 内部是NormalCreatePostForm*/
export default CreatePostForm;

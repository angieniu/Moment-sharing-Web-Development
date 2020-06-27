import React, {Component} from 'react';
import { Modal, Button, message } from 'antd';
import { API_ROOT, AUTH_HEADER, TOKEN_KEY, POS_KEY } from '../constants';
import CreatePostForm from './CreatePostForm';

// .耗性能，结构
/*
ref
Method 1: createRef
Class CreatePostButton extends Component {
constructor{
    super();
    this.myRef = React.createRef()
}

redner(){
    <div ref={this.myRef}>haha</div>
}

Method 2: 不用了现在
div ref="haha"

Method 3: 传递回调函数
<CreatePostForm ref={(formObj) => {this.form = formObj}}/>
this.form是当前的component，把接收的对象formObj即ref的对象赋值给当前component当中的某一个属性，在CreatePostButton component中调用this.form可以拿到CreatePostForm,函数写到ref后面作为回调函数。

 */
class CreatePostButton extends Component {
    state = {
        visible: false,
        confirmLoading: false,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        console.log('ok');
        this.form.validateFields((err, values) => {
            console.log(values);
            //send files to the server
            if (!err) {
                // url (token, position)
                const token = localStorage.getItem(TOKEN_KEY);
                // string json.parse
                const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
                // file
                const formData = new FormData();
                formData.set('lat', lat);
                formData.set('lon', lon);
                formData.set('message', values.message);
                formData.set('image', values.image[0].originFileObj); //image array
            //FormData send data to server
                //post方法 //${AUTH_HEADER} 插值
                this.setState({ confirmLoading: true });
                fetch(`${API_ROOT}/post`, {
                    method: 'POST',
                    headers: {
                        Authorization: `${AUTH_HEADER} ${token}`
                    },
                    body: formData,
                })
                    .then((response) => {
                        if (response.ok) {
                            return this.props.loadNearbyPosts();
                        }
                        throw new Error('Failed to create post.');
                    })
                    .then(() => {
                        this.setState({ visible: false, confirmLoading: false });
                        this.form.resetFields();
                        message.success('Post created successfully!');
                    })
                    .catch((e) => {
                        console.error(e);
                        message.error('Failed to create post.');
                        this.setState({ confirmLoading: false });
                    });
            }
        });
    };

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    };

    //先定义函数，再传入函数。createRef也可以
    getFormRef = (formInstance) => {
        this.form = formInstance;
    }

//Modal对话框 //uncontrolled input, ref could get CreatePostForm // .操作耗性能，so this.state 解构
    render() {
        const { visible, confirmLoading } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal
                    title="Create New Post"
                    visible={visible}
                    onOk={this.handleOk}
                    okText='Create'
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <CreatePostForm ref={this.getFormRef}/>
                </Modal>
            </div>
        );
    }
}

export default CreatePostButton;

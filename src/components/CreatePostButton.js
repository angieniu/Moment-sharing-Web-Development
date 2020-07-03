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

render(){
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
                // position, string json.parse to json
                const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
                // file FormData constructor new 一个
                const formData = new FormData();
                formData.set('lat', lat);
                formData.set('lon', lon);
                formData.set('message', values.message);
                formData.set('image', values.image[0].originFileObj); //image array
            //FormData send data to server 上传文件，通过http request在后端上传，不需要刷新页面。key value pari 组织文件类型，append or delete data (FormData API), FormData是构造函数。FormData.prototype所提供的所有方法和属性。parent是object。
                //post方法 //${AUTH_HEADER} 插值
                this.setState({ confirmLoading: true });
                fetch(`${API_ROOT}/post`, {
                    method: 'POST',
                    headers: {
                        Authorization: `${AUTH_HEADER} ${token}`
                    },
                    body: formData,
                })
                    // 表示和后端已经有交互，后端返回response。 response如果正常，需要重新render post，render post函数在nearby button home下面。
                    .then((response) => {
                        if (response.ok) {
                            //从home.js父传来的函数 成功返回了运行结果，就让upload窗口关闭掉，否则报错throw new error
                            //return .then()
                            return this.props.loadNearbyPosts();
                        }
                        throw new Error('Failed to create post.');
                    })
                    // 关闭窗口 post数据清空，form函数resetFields数据
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

    //先定义函数，再传入函数。createRef也可以 // 在点击CreatePostButton的时候，就已经有formInstance生成了，
    getFormRef = (formInstance) => {

        this.form = formInstance;
    }

//Modal对话框 //uncontrolled input, ref could get CreatePostForm // .操作耗性能，so this.state 解构
    // refer传的对象赋值给this.form,即赋值给component本身作为component的属性
    //this是同一个this指向当前component
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
                    {/*通过ref定义ref属性给CreatePostForm,后面的ref跟了回调函数，帮助我们拿到定义ref的component。调用回调函数的时候，react会传入一个对象，这个对象就是定义ref的对象，这个component。 ref成为了回调函数，reasct keyword,在当前的js被触发，由react决定什么时候调用它。一进入CreatePostButton就会看到这个form出来了，不是父子相传。是ref的用法，不是数据传递，是react的关键字key。
                     <CreatePostForm> 创建实例，上树,constructor
                     <CreatePostForm ref={cb}
                       ref ={cb}成为callback function {} 函数之意
                     */}
                    {/*    form => {*/}
                    {/*        this.form == form*/}
                    {/*    }*/}
                    {/*}/>*/}
                </Modal>
            </div>
        );
    }
}

export default CreatePostButton;

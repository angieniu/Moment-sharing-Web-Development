import React from 'react';
import { Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import { API_ROOT } from '../constants';
import {message} from 'antd';
class RegistrationForm extends React.Component { //如果直接用RegistrationForm拿不到form, new prop: ""
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    handleSubmit = e => {
        e.preventDefault(); //阻止发送http request, no /? and refresh page //insepect network localhost request // this.props.form.getFieldsValue() could print the object, 或者getFieldValue('ID')
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
            fetch(`${API_ROOT}/signup`, {
                method: 'POST',
                body: JSON.stringify({
                    username: values.username,
                    password: values.password
                })
            })
                .then(response => {
                    console.log(response);
                    if(response.ok) {
                        return response.text();
                    }
                })
                .then(data => {
                    console.log(data)
                    message.success('Register!!')
                    this.props.history.push('/login'); /*history package -> bom history object, window bom object. React Router 完善*/
                })

        });
    };
// 光标移出，设置confirmdirty  // handleConfirmBlur confirmDirty 只在handleConfirmBlur中触发变化。而confirmDirty表明confirm password是否有内容。 false || true = true。 本质为了什么：line42触发validate
    handleConfirmBlur = e => { /*event 算是function的参数，但是这个参数是关于window里面的值*/
        const { value } = e.target;
        console.log(' handleConfirmBlur before ->', this.state.confirmDirty);
        this.setState({ confirmDirty: this.state.confirmDirty || !!value }); // value指的confirm password 是否有value// !!value 是否存在，值是否，强制把值转换成true or false,有值 true, 没值false. 为了confirmDirty。
        console.log(' handleConfirmBlur after ->', this.state.confirmDirty);
    };

    // validation done, but confirmDirty hasn't been set until it's been called
    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) { //取password作为id的form里面的值， getFieldDecorator('password',
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback(); // form's property validator,  callback(). antdeisng api写好的, 空。
        }
    };
    // 校验function //第一次password输入，confirmDirty不变化
    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        console.log('1 ->', rule);
        console.log('2 ->', value);
        console.log('validateToNextPassword before ->', this.state.confirmDirty);
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });/*validateFields 是antdesign api，confirm id 找到form item line 105开始执行， compareToFirstPassword. */
            // 'confirm' as id
        }
        console.log('validateToNextPassword after ->', this.state.confirmDirty);
        callback();
    };

    render() {
        const { getFieldDecorator } = this.props.form; // props,  component: RegistrationForm //form as object // getFieldDecorator as method
console.log(this.props.form);
// style
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
//react 插入method函数调用，使用{}, line 78 {getFieldDecorator(key as id, {as options, 可以跟options.rules, value})(函数接收另外一个参数 component's instance <Input />), 因为传入的是componen't instance不是component, 所以不是hoc, <input />是component的实例，使用component，as class vs instance.
        // form item style 传入component中, {...formItemLayout}
        // getFieldDecorator rules   {rules: [{: , }],}
        // rules： array
        /*按顺序执行, getFieldDecorator 里面validator compareToFirstPassword,然后input.password*/
        /*handleConfirmBlue only be in the confirm password section to make first confirm passwor and then password possible. The other does not need it, 自然而然validation 按顺序code*/
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} className="register">
                <Form.Item
                    label="Username"
                >

                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="Password" hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                            {
                                validator: this.validateToNextPassword,
                            },
                        ],
                    })(<Input.Password />)}
                </Form.Item>

                <Form.Item label="Confirm Password" hasFeedback>
                    {getFieldDecorator('confirm', {
                        rules: [
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            {
                                validator: this.compareToFirstPassword,
                            },
                        ],
                    })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                    <p>I already have an account, go back to <Link to="/login">login</Link></p>
                </Form.Item>
            </Form>
        );
    }
}
// form submit, sends http request or ajax request to server side

export const Register = Form.create({ name: 'register' })(RegistrationForm); //hoc higher order component // RegistrationForm as class
// Form as object and class imported at the top, .create as method, ({ name: 'register' })(RegistrationForm) both as parameters, Register as new component, could pass props to RegistrationForm.
// HOF => HOC => Form
/*
HOF: functional programming
 */
import React, {Component} from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Register } from './Register';
import { Login } from './Login';
import Home from './Home';


//switch route 多个url选一
class Main extends Component {
    // case1: already login or not  -> <Home />// case 2: not yet. -> <Login />
    getLogin = () => {
        console.log(1);
        console.log(this.props.handleLoginSucceed);
        return this.props.isLoggedIn ? <Redirect to="/home"/> : <Login handleLoginSucceed={this.props.handleLoginSucceed}/>; //bridge pass function to Login
    }

    getHome = () => {
        return this.props.isLoggedIn ? <Home/> : <Redirect to="/login"/>; /*redirect不能走到home。 overide current location vs <Home /> could go back to home.*/
    }

    render() {
        return (
            <div className="main">
                <Switch>
                    <Route path="/register" component={Register}/>
                    {/*<Route path="/login" component={Login}/>*/}
                    <Route path="/login" render={this.getLogin}/>
                    {/*判断是否有login和能login this.getLogin as function*/}
                    <Route path="/home" render={this.getHome}/>
                    {/*render动态需要， vs componenet 静态*/}

                    <Route render={this.getLogin}/>


                </Switch>

            </div>
        );
    }
}

export default Main;

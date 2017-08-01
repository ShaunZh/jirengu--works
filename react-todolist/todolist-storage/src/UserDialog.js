/*
* @Author: Marte
* @Date:   2017-07-31 21:54:47
* @Last Modified by:   Marte
* @Last Modified time: 2017-08-02 00:05:18
*/

import React, { Component } from 'react';
import './UserDialog.css';
import { signUp, signIn, sendPasswordResetEmail} from './leanCloud';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import ForgotPasswordForm from './ForgotPasswordForm';

export default class UserDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 'signUp',
            selectedTab: 'signInOrSignUp', // forgotPassword
            formData: {
                email: '',
                username: '',
                password: ''
            }
        };
    }

    switch(e) {
        this.setState({
            selected: e.target.value
        });
    }


    signUp(e) {
        e.preventDefault();
        let {email, username, password} = this.state.formData;
        let success = (user) => {
            this.props.onSignUp.call(null, user);
        }
        let error = (error) => {
            switch (error.code) {

              case 202: {
                  alert('用户名已被占用');
              }
              break;

              default: {
                  alert(error);
              }
              break;
            }
        }
        signUp(username, password, success, error);
    }
    signIn(e) {
        e.preventDefault();
        let {email, username, password} = this.state.formData;
        let success = (user) => {
            this.props.onSignIn.call(null, user);
        }
        let error = (error) => {
            switch (error.code) {

              case 210: {
                  alert('用户名与密码不匹配');
              }
              break;

              default: {
                  alert(error);
              }
              break;
            }
        }
        signIn(username, password, success, error);
    }

    changeFormData(key, e) {
        // this.state.formData.username = e.target.value;
        // this.setState(this.state);
        // 像上面这样写会看到一个警告 warning  Do not mutate state directly. Use setState()
        // 当我们需要修改state的值时，不要直接修改，通过setState进行修改，
        // 那么如果通过setState进行修改呢？给它传递一个对象或函数
        let stateCopy = JSON.parse(JSON.stringify(this.state));
        stateCopy.formData[key] = e.target.value;
        this.setState(stateCopy);
    }

    render() {

        let signInOrSignUp = (
          <div className="signInOrSignUp">
              <nav>
                <label>
                  <input type="radio" value="signUp"
                  checked={this.state.selected === 'signUp'}
                  onChange={this.switch.bind(this)}
                  /> 注册
                </label>

                <label>
                  <input type="radio" value="signIn"
                  checked={this.state.selected === 'signIn'}
                  onChange={this.switch.bind(this)}
                  /> 登录
              </label>
            </nav>
            <div className="panes">
              {this.state.selected === 'signUp'
                ? <SignUpForm formData={this.state.formData}
                  onSubmit={this.signUp.bind(this)}
                  onChange={this.changeFormData.bind(this)} />
                : null}
              {this.state.selected === 'signIn'
                ? <SignInForm formData={this.state.formData}
                  onSubmit={this.signUp.bind(this)}
                  onChange={this.changeFormData.bind(this)}
                  onForgotPassword={this.showForgotPassword.bind(this)} />
                : null}
            </div>
          </div>
        );

        return (
            <div className="UserDialog-Wrapper">
            <div className="UserDialog">
              {this.state.selectedTab === 'signInOrSignUp'
                ? signInOrSignUp
                : <ForgotPasswordForm
                    formData={this.state.formData}
                    onSubmit={this.resetPassword.bind(this)}
                    onChange={this.changeFormData.bind(this)}
                    onSignIn={this.returnToSignIn.bind(this)}
                  />}
            </div>
        </div>
        );
    }

    showForgotPassword() {
        let stateCopy = JSON.parse(JSON.stringify(this.state));
        stateCopy.selectedTab = 'forgotPassword';
        this.setState(stateCopy);
    }

    returnToSignIn() {
      let stateCopy = JSON.parse(JSON.stringify(this.state))
      stateCopy.selectedTab = 'signInOrSignUp';
      this.setState(stateCopy);
    }

    resetPassword(e) {
      e.preventDefault();
      sendPasswordResetEmail(this.state.formData.email);
    }


}
import React, {Component} from 'react'
import './UserDialog.css'
import {signUp, signIn, sendPasswordResetEmail} from './leanCloud'
import SignUpForm from './SignUpForm'

export default class UserDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 'signUp',
      selectedTab: 'signInOrSignUp', // 'forgotPassword'
      formData: {
        email: '',
        username: '',
        password: ''
      }
    }
  }

  switch(e) {
    this.setState({
      selected: e.target.value
    })
  }

  /* this.signUp.bind(this)
   * 在signUpForm的onSubmit使用了
   **/
  signUp(e) {
    console.log('signUp')
    e.preventDefault()
    let {email, username, password} = this.state.formData
    let success = (user) => {
      console.log('userDialog.js的signUp: ', user)
      console.log('来自iserDialog.js的signUp函数回调success')
      this.props.onSignUp.call(null, user)
    }
    let error = (error) => {
      switch (error.code) {
        case 202:
          alert('用户名已被占用')
          break
        case 125:
          alert('邮箱错误')
          break
        default:
          alert(error)
          break
      }
    }
    // import { signUp } from './leanCloud'
    signUp(email, username, password, success, error)
  }

  signIn(e) {
    e.preventDefault()
    let {username, password} = this.state.formData
    let success = (user) => {
      this.props.onSignIn.call(null, user)
    }
    let error = (error) => {
      switch (error.code) {
        case 210:
          alert('用户名与密码不匹配')
          break
        default:
          alert(error)
          break
      }
    }
    signIn(username, password, success, error)
  }


  // changeUserName 和 changePassword 的逻辑都在这里（其实就是setState）
  changeFormData(key, e) {
    let stateCopy = JSON.parse(JSON.stringify(this.state)) // 用 JSON 深拷贝, 单独拎出来一个，以免REACT的warning？
    stateCopy.formData[key] = e.target.value
    this.setState(stateCopy)
  }

  // 返回登录
  returnToSignIn() {
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.selectedTab = 'signInOrSignUp'
    this.setState(stateCopy)
  }

  // setState ，selectedTab 字段为 forgotPassword
  showForgotPassword() {
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.selectedTab = 'forgotPassword'
    this.setState(stateCopy)
  }

  resetPassword(e) {
    e.preventDefault()
    // form leanCloud.js 的 export function
    sendPasswordResetEmail(this.state.formData.email)
  }

  render() {

    let signInForm = (
        <form className='signIn' onSubmit={this.signIn.bind(this)}>
          {/* 登录*/}
          <div className='row'>
            <label>
              用户名
            </label>
            <input type='text' value={this.state.formData.username}
                   onChange={this.changeFormData.bind(this, 'username')}/>
          </div>
          <div className='row'>
            <label>
              密码
            </label>
            <input type='password' value={this.state.formData.password}
                   onChange={this.changeFormData.bind(this, 'password')}/>
          </div>
          <div className='row actions'>
            <button type='submit'>登录</button>
            <a href="#" onClick={this.showForgotPassword.bind(this)}>忘记密码了？</a>
          </div>
        </form>
    )

    let signInOrSignUp = (
        <div className="signInOrSignUp">
          <nav>
            <label>
              <input type="radio" value="signUp"
                     checked={this.state.selected === 'signUp'}
                     onChange={this.switch.bind(this)}
              /> 注册</label>
            <label>
              <input type="radio" value="signIn"
                     checked={this.state.selected === 'signIn'}
                     onChange={this.switch.bind(this)}
              /> 登录</label>
          </nav>
          <div className="panes">
            {this.state.selected === 'signUp' ?
                <SignUpForm formData={this.state.formData}
                            onSubmit={this.signUp.bind(this)}
                            onChange={this.changeFormData.bind(this)}
                />
                : null}
            {this.state.selected === 'signIn' ? signInForm : null}
          </div>
        </div>
    )

    // 重置密码的template
    let forgotPassword = (
        <div className="forgotPassword">
          <h3>
            重置密码
          </h3>
          <form className="forgotPassword" onSubmit={this.resetPassword.bind(this)}> {/* 登录*/}
            <div className="row">
              <label>邮箱</label>
              <input type="text" value={this.state.formData.email}
                     onChange={this.changeFormData.bind(this, 'email')}/>
            </div>
            <div className="row actions">
              <button type="submit">发送重置邮件</button>
              <a href="#" onClick={this.returnToSignIn.bind(this)}>返回登录</a>
            </div>
          </form>
        </div>
    )

    return (
        <div className='UserDialog-Wrapper'>
          <div className='UserDialog'>

            {this.state.selectedTab === 'signInOrSignUp' ? signInOrSignUp : forgotPassword}

          </div>
        </div>
    )
  }
}

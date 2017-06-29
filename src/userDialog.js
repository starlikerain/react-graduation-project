import React, { Component } from 'react'
import './UserDialog.css'
import { signUp, signIn } from './leanCloud'

export default class UserDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 'signUp',
      formData: {
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
    e.preventDefault()
    let { username, password } = this.state.formData
    let success = (user) => {
      console.log('userDialog.js的signUp: ', user)
      console.log('来自iserDialog.js的signUp函数回调success')
      this.props.onSignUp.call(null, user)
    }
    let error = (error) => {
      alert(error)
    }
    // import { signUp } from './leanCloud'
    signUp(username, password, success, error)
  }
  signIn(e) {
    e.preventDefault()
    let { username, password } = this.state.formData
    let success = (user) => {
      this.props.onSignIn.call(null, user)
    }
    let error = (error) => {
      alert(error)
    }
    signIn(username, password, success, error)
  }
  changeFormData(key, e) {
    let stateCopy = JSON.parse(JSON.stringify(this.state))  // 用 JSON 深拷贝
    stateCopy.formData[key] = e.target.value
    this.setState(stateCopy)
  }
  // changeUserName 和 changePassword 的逻辑都在这里
  changeFormData(key, e) {
    let stateCopy = JSON.parse(JSON.stringify(this.state)) // 用 JSON 深拷贝, 单独拎出来一个，以免REACT的warning？
    stateCopy.formData[key] = e.target.value
    this.setState(stateCopy)
  }
  render() {
    let signUpForm = (
      <form className='signUp' onSubmit={this.signUp.bind(this)}>
        {/* 注册*/}
        <div className='row'>
          <label>
            用户名
        </label>
          <input type='text' value={this.state.formData.username} onChange={this.changeFormData.bind(this, 'username')} />
          {/* bind 不仅可以绑定 this，还可以绑定第一个参数 */}
        </div>
        <div className='row'>
          <label>
            密码
        </label>
          <input type='password' value={this.state.formData.password} onChange={this.changeFormData.bind(this, 'password')} />
        </div>
        <div className='row actions'>
          <button type='submit'>
            注册
        </button>
        </div>
      </form>
    )

    let signInForm = (
      <form className='signIn' onSubmit={this.signIn.bind(this)}>
        {/* 登录*/}
        <div className='row'>
          <label>
            用户名
        </label>
          <input type='text' value={this.state.formData.username} onChange={this.changeFormData.bind(this, 'username')} />
        </div>
        <div className='row'>
          <label>
            密码
        </label>
          <input type='password' value={this.state.formData.password} onChange={this.changeFormData.bind(this, 'password')} />
        </div>
        <div className='row actions'>
          <button type='submit'>
            登录
        </button>
        </div>
      </form>
    )

    return (
      <div className='UserDialog-Wrapper'>
        <div className='UserDialog'>
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
          <div className='panes'>
            {this.state.selected === 'signUp' ? signUpForm : null}
            {this.state.selected === 'signIn' ? signInForm : null}
          </div>
        </div>
      </div>
    )
  }
}

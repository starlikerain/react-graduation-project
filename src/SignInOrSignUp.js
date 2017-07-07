/**
 * Created by StarLikeRain on 07/07/2017.
 */
import React, {Component} from 'react';
import SignUpForm from './SignUpForm' // 注册的template
import SignInForm from './SignInForm' // 登录的template

export default class SignInOrSignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 'signUp' // 用switch函数控制
    }
  }

  switch(e) {
    this.setState({
      selected: e.target.value
    })
  }

  render() {
    return (
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
                <SignUpForm formData={this.props.formData}
                            onSubmit={this.props.onSignUp}
                            onChange={this.props.onChange}
                />
                : null}
            {this.state.selected === 'signIn' ?
                <SignInForm formData={this.props.formData}
                            onChange={this.props.onChange}
                            onSubmit={this.props.onSignIn}
                            onForgotPassword={this.props.onForgotPassword}
                />
                : null}
          </div>
        </div>
    )
  }
}
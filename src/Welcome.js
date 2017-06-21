// 如果不import进来 下面哪里有react可以用啊  
import React from 'react'  


class Welcome extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      date: new Date()
    }
    setInterval(() => {
      this.setState({
        date: new Date()
      })
    }, 1000)
    console.log('我已经在 constructor 里将 props 和 state 初始化好了')
  }
  componentWillMount () {
    console.log('运行到这里的话，说明马上就要运行 render 了')
  }
  render () {
    console.log('嗯，这里是 render')
    return (
      <div>
        <h1>Hello, {this.props.name}</h1>
        <h2>{this
               .state
               .date
               .toString()}</h2>
      </div>
    )
  }
  componentDidMount () {
    console.log('已经挂载到页面里了')
  }
}

// 一个文件中 export default只能有一个
export default Welcome

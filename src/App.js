import React, { Component } from 'react'
import 'normalize.css'
import './reset.css'
import './App.css'
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import UserDialog from './userDialog'
import { getCurrentUser, signOut } from './leanCloud'

class App extends Component {
  constructor(props) {
    super(props)
    // 这里为何要用newTodo来容纳 
    // 因为 数据驱动，TodoInput的onChange的时候 进行setState
    // 不放这state里面， 没法进入 shouldComponentUpdate
    this.state = {
      user: getCurrentUser() || {},
      newTodo: '',
      todoList: []
    }
  }
  render() {
    let todos = this.state.todoList
      .filter((item) => !item.deleted)
      .map((item, index) => {
        return (
          <li key={index}>
            <TodoItem todo={item} onToggle={this.toggle.bind(this)} onDelete={this.delete.bind(this)} />
          </li>
        )
      })

    return (
      <div className='App'>
        <h1>
          {this.state.user.username || '我'}的待办
          {this.state.user.id ? <button onClick={this.signOut.bind(this)}>登出</button> : null}
        </h1>
        <div className='inputWrapper'>
          <TodoInput content={this.state.newTodo} onChange={this.changeTitle.bind(this)} onSubmit={this.addTodo.bind(this)} />
        </div>
        <ol>
          {todos}
        </ol>
        {
          this.state.user.id ?
            null
            :
            <
              UserDialog
              onSignUp={this.onSignUp.bind(this)}
              onSignIn={this.onSignIn.bind(this)}
            />
        }
      </div>
    )
  }
  signOut() {
    // 来自小组件UserDialog的事件触发 本组件执行setState 触发rerender
    signOut()
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = {}
    this.setState(stateCopy)
  }
  onSignIn(user) {
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = user
    this.setState(stateCopy)
  }
  onSignUp(user) {
    // this.state.user = user // 最好不要直接设置 state，因为不会触发rerernder啊啊啊啊啊
    // this.setState(this.state)

    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = user
    this.setState(stateCopy)
  }
  componentDidUpdate() { }
  delete(event, todo) {
    todo.deleted = true
    this.setState(this.state)
  }
  toggle(e, todo) {
    todo.status = todo.status === 'completed' ? '' : 'completed'
    this.setState(this.state)
  }
  changeTitle(event) {
    this.setState({
      newTodo: event.target.value,
      todoList: this.state.todoList
    })
  }
  addTodo(event) {
    if (event.target.value !== '') {
      this.state.todoList.push({
        id: idMaker(),
        title: event.target.value,
        status: null,
        deleted: false
      })
      this.setState({
        newTodo: '',
        todoList: this.state.todoList
      })
    } else {
      alert('Stanley why you input nothing ?!')
    }
  }
}

export default App

let id = 0

function idMaker() {
  id += 1
  return id
}

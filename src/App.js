import React, { Component } from 'react'
import 'normalize.css'
import './reset.css'
import './App.css'
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import UserDialog from './userDialog'
import { getCurrentUser, signOut, TodoModel } from './leanCloud'

class App extends Component {
  constructor (props) {
    super(props)
    // 这里为何要用newTodo来容纳 
    // 因为 数据驱动，TodoInput的onChange的时候 进行setState
    // 不放这state里面， 没法进入 shouldComponentUpdate
    this.state = {
      user: getCurrentUser() || {},
      newTodo: '',
      todoList: []
    }
    let user = getCurrentUser()
    if (user) {
      // 通过用户查找todolist
      TodoModel.getByUser(user, (todos) => {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.todoList = todos
        this.setState(stateCopy)
      })
    }
  }

  render () {
    // 过滤遍历渲染DOM
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
        <h1>{this.state.user.username || '我'}的待办 {this.state.user.id ? <button onClick={this.signOut.bind(this)}>
                                                                         登出
                                                                       </button> : null}</h1>
        <div className='inputWrapper'>
          <TodoInput content={this.state.newTodo} onChange={this.changeTitle.bind(this)} onSubmit={this.addTodo.bind(this)} />
        </div>
        <ol>
          {todos}
        </ol>
        {/*注册登录弹框区*/}
        {this.state.user.id ?
           null
           :
           < UserDialog onSignUp={this.onSignUpOrSignIn.bind(this)} onSignIn={this.onSignUpOrSignIn.bind(this)} />}
      </div>
    )
  }

  signOut () {
    // 来自小组件UserDialog的事件触发 本组件执行setState 触发rerender
    signOut()
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = {}
    this.setState(stateCopy)
  }

  onSignUpOrSignIn (user) {
    // this.state.user = user // 最好不要直接设置 state，因为不会触发rerernder啊啊啊啊啊
    // this.setState(this.state)

    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = user
    this.setState(stateCopy)
  }

  componentDidUpdate () {}

  // 每条todolist的删除按钮
  delete (event, todo) {
    console.log('event:', event)
    console.log('todo:', todo)

    TodoModel.destroy(todo.id, () => {
      todo.deleted = true
      this.setState(this.state)
    })
  }

  // 在是否完成的状态之间切换
  toggle (e, todo) {
    let oldStatus = todo.status
    todo.status = todo.status === 'completed' ? '' : 'completed'
    TodoModel.update(todo, () => {
      this.setState(this.state)
    }, (error) => {
      todo.status = oldStatus
      this.setState(this.state)
    })
  }

  changeTitle (event) {
    this.setState({
      newTodo: event.target.value,
      todoList: this.state.todoList
    })
  }

  // 主要是这里更改了TodoList
  addTodo (event) {
    let newTodo = {
      title: event.target.value,
      status: '',
      deleted: false
    }

    TodoModel.create(newTodo,
      (id) => {
        newTodo.id = id
        this.state.todoList.push(newTodo)
        this.setState({
          newTodo: '',
          todoList: this.state.todoList
        })
      },
      (error) => {
        console.log(error)
      }
    )

  // if (event.target.value !== '') {
  //   this.state.todoList.push({
  //     id: idMaker(),
  //     title: event.target.value,
  //     status: null,
  //     deleted: false
  //   })
  //   this.setState({
  //     newTodo: '',
  //     todoList: this.state.todoList
  //   })
  // }
  }
}

export default App

let id = 0

function idMaker () {
  id += 1
  return id
}

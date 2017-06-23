import React, { Component } from 'react'
import 'normalize.css'
import './reset.css'
import './App.css'
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import * as  localStore from './localStore'

// initializatioon leanCloud
import AV from 'leancloud-storage'
var APP_ID = 'h5GsWAlEvnIa3OTNJuWzgfaO-gzGzoHsz'
var APP_KEY = 'JbcCMp7DHUT4f33UtYjtAh2M'
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

// test leanCloud functional
var TestObject = AV.Object.extend('TestObject')
var testObject = new TestObject()
console.log(testObject);
testObject.save({
  words: JSON.stringify({a:'b'})
}).then(function (object) {
  alert('LeanCloud Rocks!')
})

class App extends Component {
  constructor(props) {
    super(props)
    // 这里为何要用newTodo来容纳 
    // 因为 数据驱动，TodoInput的onChange的时候 进行setState
    // 不放这state里面， 没法进入 shouldComponentUpdate
    this.state = {
      newTodo: '',
      todoList: localStore.load('todoList') || []
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
        <h1>我的待办</h1>
        <div className='inputWrapper'>
          <TodoInput content={this.state.newTodo} onChange={this.changeTitle.bind(this)} onSubmit={this.addTodo.bind(this)} />
        </div>
        <ol>
          {todos}
        </ol>
      </div>
    )
  }
  componentDidUpdate() {
    localStore.save('todoList', this.state.todoList)
  }
  delete(event, todo) {
    todo.deleted = true
    this.setState(this.state)
  }
  toggle(e, todo) {
    // todo.status = todo.status === 'completed' ? '' : 'completed'
    // this.setState(this.state)
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

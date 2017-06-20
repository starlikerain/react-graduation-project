import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
// import Welcome from './Welcome'

// ReactDOM.render(
//   <Welcome name="123"/>,
//   document.getElementById('root')
// )

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()

// ReactDOM.render(
//   <h1>Hi, World</h1>,
//   document.getElementById('root')
// )

// function tick() {
//   const element = (
//     <div>
//       <h1>Hello, world!</h1>
//       <h2>It is {new Date().toLocaleTimeString()}.</h2>
//     </div>
//   )
//   ReactDOM.render(
//     element,
//     document.getElementById('root')
//   )
// }

// setInterval(tick, 1000)

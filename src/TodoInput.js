import React from 'react'
import './TodoInput.css'

function submit (props, e) {
  if (e.key === 'Enter') {
    // props.onSubmit(e)
    if(e.target.value.trim() !== ''){
      props.onSubmit(e)
    }else {
      alert('不是吧欧巴~你什么都不敢就要上哦！')
    }
  }
}
function changeTitle (props, e) {
  props.onChange(e)
}

// 搞不清楚 bind 用法的同学，请看完 MDN
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
// 尤其是示例要看懂

export default function (props) {
  return <input
           type='text'
           value={props.content}
           className='TodoInput'
           onChange={changeTitle.bind(null, props)}
           onKeyPress={submit.bind(null, props)} />
}

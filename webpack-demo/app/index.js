/**
 * @author StarLikeRain [ Evan Yann ]
 * @email pengyaokang@gmail.com
 * @create date 2017-06-07 05:40:17
 * @modify date 2017-06-07 05:40:17
 * @desc [ first step webpack ]
*/
import _ from 'lodash'
import $ from 'jquery'
import foo from './foo'

function component () {
  var element = $('<div></div>')

  /* lodash is required for the next line to work */

  element.html(_.join(['Hello', 'webpack2'], ' '))

  return element.get(0)
}

document.body.appendChild(component())
console.log(foo)
console.log(foo())

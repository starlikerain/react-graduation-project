/**
 * @author StarLikeRain [ Evan Yann ]
 * @email pengyaokang@gmail.com
 * @create date 2017-06-07 05:40:17
 * @modify date 2017-06-07 05:40:17
 * @desc [ first step webpack ]
*/
import _ from 'lodash';

function component () {
  var element = document.createElement('div')

  /* lodash is required for the next line to work */
  element.innerHTML = _.join(['Hello', 'webpack'], ' ')

  return element
}

document.body.appendChild(component())

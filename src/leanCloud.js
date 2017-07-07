// initializatioon leanCloud
import AV from 'leancloud-storage'

var APP_ID = 'h5GsWAlEvnIa3OTNJuWzgfaO-gzGzoHsz'
var APP_KEY = 'JbcCMp7DHUT4f33UtYjtAh2M'

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

export default AV

// leancloud登录逻辑写好 给userDialog.js 使用
export function signUp(email, username, password, successFn, errorFn) {
  // 新建 AVUser 对象实例
  var user = new AV.User()
  // 设置用户名
  user.setUsername(username)
  // 设置密码
  user.setPassword(password)
  // 设置邮箱（这个是leancloud的api）
  user.setEmail(email)

  user.signUp().then(function (loginedUser) {
    let user = getUserFromAVUser(loginedUser)
    successFn.call(null, user)
  }, function (error) {
    errorFn.call(null, error)
  })
  return undefined
}

function getUserFromAVUser(AVUser) {
  // 这里的AVUser是前面 new出来的user实例登录后的promise返回参数
  return {
    id: AVUser.id,
    ...AVUser.attributes
  }
}

// 获取浏览器当前 已经登录的用户信息
export function getCurrentUser() {
  let user = AV.User.current()
  if (user) {
    return getUserFromAVUser(user)
  } else {
    return null
  }
}

// 给App.js用的 登出逻辑
export function signOut() {
  AV.User.logOut()
  return undefined
}

export function signIn(username, password, successFn, errorFn) {
  AV.User.logIn(username, password).then(function (loginedUser) {
    let user = getUserFromAVUser(loginedUser)
    successFn.call(null, user)
  }, function (error) {
    errorFn.call(null, error)
  })
}
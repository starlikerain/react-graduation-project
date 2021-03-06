// initializatioon leanCloud
import AV from 'leancloud-storage'

var APP_ID = 'h5GsWAlEvnIa3OTNJuWzgfaO-gzGzoHsz'
var APP_KEY = 'JbcCMp7DHUT4f33UtYjtAh2M'

AV.init({appId: APP_ID, appKey: APP_KEY})

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

  user
    .signUp()
    .then(function (loginedUser) {
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
  let user = AV
    .User
    .current()
  if (user) {
    return getUserFromAVUser(user)
  } else {
    return null
  }
}

// 给App.js用的 登出逻辑
export function signOut() {
  AV
    .User
    .logOut()
  return undefined
}

export function signIn(username, password, successFn, errorFn) {
  AV
    .User
    .logIn(username, password)
    .then(function (loginedUser) {
      let user = getUserFromAVUser(loginedUser)
      successFn.call(null, user)
    }, function (error) {
      errorFn.call(null, error)
    })
}

// 通过邮箱重置密码的
export function sendPasswordResetEmail(email, successFn, errorFn) {
  AV
    .User
    .requestPasswordReset(email)
    .then(function (success) {
      console.log('通过邮箱重置密码的success!!!')
      successFn.call()
    }, function (error) {
      console.log('通过邮箱重置密码的error!!!')
      errorFn.call(null, error)
    })
}

/* 所有跟 Todo 相关的 LeanCloud 操作都放到这里
 * 会在leanCloud里面的Todo这个类里面添加字段
**/
export const TodoModel = {
  getByUser(user, successFn, errorFn) {
    // 文档见 https://leancloud.cn/docs/leanstorage_guide-js.html#批量操作
    let query = new AV.Query('Todo')
    query.equalTo('deleted', false);
    query
      .find()
      .then((response) => {
        let array = response.map((t) => {
          return {
            id: t.id,
            ...t.attributes
          }
        })
        successFn.call(null, array)
      }, (error) => {
        errorFn && errorFn.call(null, error)
      })
  },
  create({
    status,
    title,
    deleted
  }, successFn, errorFn) {
    let Todo = AV
      .Object
      .extend('Todo')
    let todo = new Todo()
    todo.set('title', title)
    todo.set('status', status)
    todo.set('deleted', deleted)

    /*  根据文档 https://leancloud.cn/docs/acl-guide.html#单用户权限设置
      这样做就可以让这个 Todo 只被当前用户看到
    **/
    let acl = new AV.ACL()
    acl.setPublicReadAccess(false) // 注意这里是 false
    acl.setWriteAccess(AV.User.current(), true)
    // 解决神奇的，当前用户无法获取自己的todolist
    acl.setReadAccess(AV.User.current(), true)

    todo.setACL(acl);

    todo
      .save()
      .then(function (response) {
        successFn.call(null, response.id)
      }, function (error) {
        errorFn && errorFn.call(null, error)
      });

  },
  update({
    id,
    title,
    status,
    deleted
  }, successFn, errorFn) {
    // 文档 https://leancloud.cn/docs/leanstorage_guide-js.html#更新对象
    let todo = AV
      .Object
      .createWithoutData('Todo', id)
    title !== undefined && todo.set('title', title)
    status !== undefined && todo.set('status', status)
    deleted !== undefined && todo.set('deleted', deleted)
    // 为什么我要像上面那样写代码？ 考虑如下场景 update({id:1, title:'hi'}) 调用 update 时，很有可能没有传 status 和
    // deleted 也就是说，用户只想「局部更新」 所以我们只 set 该 set 的 那么为什么不写成 title &&
    // todo.set('title', title) 呢，为什么要多此一举跟 undefined 做对比呢？ 考虑如下场景 update({id:1,
    // title: '', status: null}} 用户想将 title 和 status 置空，我们要满足
    todo
      .save()
      .then((response) => {
        successFn && successFn.call(null)
      }, (error) => errorFn && errorFn.call(null, error))
  },
  destroy(todoId, successFn, errorFn) {
    // 文档 https://leancloud.cn/docs/leanstorage_guide-js.html#删除对象
    // 不应该删除数据，而是将数据标记为deleted
    TodoModel.update({
      id: todoId,
      deleted: true
    }, successFn, errorFn)
  }
}
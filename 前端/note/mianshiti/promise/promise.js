/*
 * @Author: zd
 * @Date: 2023-11-23 15:26:18
 * @LastEditors: zd
 * @LastEditTime: 2023-11-23 16:34:48
 * @FilePath: \learningFiles\note\mianshiti\promise\promise.js
 * @Description: 完整的实现promise A+
 */

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

// 运行一个为队列任务，把传递的函数放到微队列中
function runMicroTask (callback) {
  // 为了避免[变量未定义]的错误，这里最好加上前缀globalThis
  // globalThis是一个关键词，指代全局对象，浏览器环境为window，node环境为global

  // 判断node 环境
  if (globalThis.process && globalThis.process.nextTick) {
    globalThis.process.nextTick(callback)
  }
  // 判断浏览器环境
  else if (globalThis.MutationObserver) {
    const p = document.createElement('p')
    const observer = new MutationObserver(callback)
    observer.observe(p, {
      childList: true // 观察该元素内部变化
    })
    p.innerHTML = '1'
  } else {
    setTimeout(callback, 0)
  }
}

// 判断一个数据是否是Promist对象
function isPromise (obj) {
  return !!(obj && typeof obj === 'object' && typeof obj.then === 'function')
}

// promise类
class MyPromise {
  /**
   * @description: 创建一个Promise
   * @param {*} executor 任务执行器，立刻执行
   * @return {*}
   */
  constructor (executor) {
    this._state = PENDING // 状态
    this._value = undefined // 数据
    this._handlers = [] // 处理函数形成的队列

    try {
      //
      executor(this._resolve.bind(this), this._reject.bind(this))
    } catch (error) {
      this._reject(error)
      console.error(error)
    }
  }

  /**
   * @description: 向处理队列中添加一个函数
   * @param {Function} executor executor 添加的函数
   * @param {String} state 该函数什么状态下执行
   * @param {Function} resolve 让then函数返回的Promise成功
   * @param {Function} reject 让then函数返回的Promise失败
   */
  _pushHandler (executor, state, resolve, reject) {
    this._handlers.push({
      executor,
      state,
      resolve,
      reject
    })
  }

  // 根据实际情况，执行队列
  _runHandlers () {
    if (this._state === PENDING) {
      // 目前任务扔在挂起
      return
    }

    while (this._handlers[0]) {
      const handler = this._handlers[0]
      this._runOneHandler(handler)
      this._handlers.shift()
    }
  }

  /**
   * @description: 处理一个handler
   * @param {Object} handler
   */
  _runOneHandler ({ executor, state, resolve, reject }) {
    runMicroTask(() => {
      if (this._state !== state) {
        // 状态不一致，不处理
        return
      }

      if (typeof executor !== 'function') {
        // 传递后续处理并非一个函数
        this._state === FULFILLED ? resolve(this._value) : reject(this._value)
        return
      }

      try {
        const result = executor(this._value)
        if (isPromise(result)) {
          result.then(resolve, reject)
        } else {
          resolve(result)
        }
      } catch (error) {
        reject(error)
        console.error(error)
      }
    })
  }

  /**
   * @description: Promise A+规范的then
   * @param {Function} onFulfilled
   * @param {Function} onRejected
   */
  then (onFulfilled, onRejected) {
    return new MyPromise((resovlue, reject) => {
      this._pushHandler(onFulfilled, FULFILLED, resovlue, reject)
      this._pushHandler(onRejected, REJECTED, resovlue, reject)
      this._runHandlers() // 执行队列
    })
  }

  /**
   * @description: 仅处理失败的场景
   * @param {Function} onRejected
   */
  catch (onRejected) {
    return this.then(null, onRejected)
  }

  /**
   * @description: 无论成功还是失败都会执行回调
   * @param {Function} onSettled
   */
  finallly (onSettled) {
    return this.then(
      data => {
        onSettled()
        return data
      },
      reason => {
        onSettled()
        throw reason
      }
    )
  }

  /**
   * @description: 更改任务状态
   * @param {String} newState 新状态
   * @param {any} value 相关数据
   */
  _changeState (newState, value) {
    if (this._state !== PENDING) {
      // 目前状态已经更改
      return
    }
    this._state = newState
    this._value = value
    this._runHandlers()
  }

  /**
   * @description: 标记当前任务完成
   * @param {any} data 任务完成的相关数据
   */
  _resolve (data) {
    this._changeState(FULFILLED, data)
  }

  /**
   * @description: 标记当前任务失败
   * @param {any} reason 任务失败的相关数据
   */
  _reject (reason) {
    this._changeState(REJECTED, reason)
  }
}

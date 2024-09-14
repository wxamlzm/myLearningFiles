/*
 * @Author: zd
 * @Date: 2023-12-07 13:56:03
 * @LastEditors: zd
 * @LastEditTime: 2023-12-28 09:42:44
 * @Description: undefined的居然是可以被重载的
 */
// 不同于null字面量，undefined并不恒等于undefined原始值，比如说它可以被“作用域链截胡“
let undefined = 'bilibili'

console.log(undefined)


// let null = 'bilibili'
// console.log(null)
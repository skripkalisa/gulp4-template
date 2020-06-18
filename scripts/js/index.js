'use strict'

console.clear()
var array = ['apple', 'banana', 'orange']
var breakfast = array.map(function (fruit) {
  return ''.concat(fruit, 's')
})
console.log(breakfast)

function msgAfterTimeout(msg, who, timeout) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      return resolve(''.concat(msg, ' Hello ').concat(who, '!'))
    }, timeout)
    reject()
  })
}

msgAfterTimeout('', 'Foo', 100)
  .then(function (msg) {
    return msgAfterTimeout(msg, 'Bar', 200)
  })
  .then(function (msg) {
    console.log('done after 300ms:'.concat(msg))
  })

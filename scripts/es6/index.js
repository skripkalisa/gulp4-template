console.clear()
const array = ['apple', 'banana', 'orange']

const breakfast = array.map((fruit) => `${fruit}s`)

console.log(breakfast)
function msgAfterTimeout(msg, who, timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (timeout < 200) {
        reject('Too fast. Increase the timeout')
      } else {
        resolve(`${msg} Hello ${who}!`), timeout
      }
    })
  })
}
msgAfterTimeout('', 'Foo', 300)
  .then((msg) => msgAfterTimeout(msg, 'Bar', 200))
  .then((msg) => {
    console.log(`done after 500ms:${msg}`)
  })

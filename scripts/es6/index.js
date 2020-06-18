console.clear()
const array = ['apple', 'banana', 'orange']

const breakfast = array.map((fruit) => `${fruit}s`)

console.log(breakfast)
function msgAfterTimeout(msg, who, timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(`${msg} Hello ${who}!`), timeout)
    reject()
  })
}
msgAfterTimeout('', 'Foo', 100)
  .then((msg) => msgAfterTimeout(msg, 'Bar', 200))
  .then((msg) => {
    console.log(`done after 300ms:${msg}`)
  })

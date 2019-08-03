const str = '?a=b&c=d'

const u = new URLSearchParams(str)

console.log(u)
console.log(u.toString())

// console.log(u instanceof URLSearchParams)
// console.log(undefined instanceof URLSearchParams)

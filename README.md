# aong
and or not group test

## Getting Started

```sh
npm i aong
```

## Usage

```javascript
import { aong, compile } from 'aong-js'

const source = `k1 AND k2 AND (k3 OR k4) NOT (k5)`
console.log({source})

const rule = compile(source)

console.log(JSON.stringify(rule, null, 2))

const texts = [
    'k1',
    'k1 k2',
    'k1 k2 k3',
    'k1 k2 k4',
    'k1 k2 k3 k5',
]

texts.forEach(text => {
    console.log({text}, aong(rule, text))
})

// { source: 'k1 AND k2 AND (k3 OR k4) NOT (k5)' }
// {
//   "type": "and",
//   "data": [
//     "k1",
//     "k2",
//     {
//       "type": "or",
//       "data": [
//         "k3",
//         "k4"
//       ]
//     },
//     {
//       "type": "not",
//       "data": [
//         "k5"
//       ]
//     }
//   ]
// }
// { text: 'k1' } false
// { text: 'k1 k2' } false
// { text: 'k1 k2 k3' } true
// { text: 'k1 k2 k4' } true
// { text: 'k1 k2 k3 k5' } false

```

## License

MIT

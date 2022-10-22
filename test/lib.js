
import { tokenize, parse } from '../lib.js'

const sources = [
    `k1 AND k2 AND (k3 OR k4) NOT (k5)`,
    `   `,
    `k1 AND "abc"`,
    `k1 AND ""`,
    `k1 AND "hello world"`,
    `k1 AND "hello \\" world"`,
]

sources.forEach(source => {
    const tokens = tokenize(source)
    const rule = parse(tokens)

    console.log(JSON.stringify({source, tokens, rule}, null, 2))
})

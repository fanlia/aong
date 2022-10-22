
const test = (item, text) => text.includes(item)

const and = (item, text) => item.data.every(d => aong(d, text))

const or = (item, text) => item.data.some(d => aong(d, text))

const not = (item, text) => !and(item, text)

export const aong = (item, text) => {
    const type = typeof item === 'string' ? 'test' : item.type

    return type === 'and'
        ? and(item, text)
        : type === 'or'
        ? or(item, text)
        : type === 'not'
        ? not(item, text)
        : type === 'test'
        ? test(item, text)
        : false
}

const is_whitespace = (ch) => /\s/.test(ch)

export const tokenize = (source = '') => {

    let tokens = []

    let start = 0
    let end = 0
    let len = source.length

    let in_token = false
    let in_quote = false

    while (end < len) {
        const ch = source[end]

        if (is_whitespace(ch)) {
            if (in_token && !in_quote) {
                const token = source.slice(start, end)
                tokens.push(token)
                in_token = false
            }
        } else if (ch === '(') {
            if (!in_token) {
                tokens.push(ch)
            }
        } else if (ch === ')') {
            if (in_token && !in_quote) {
                const token = source.slice(start, end)
                tokens.push(token)
                in_token = false
            }
            tokens.push(ch)
        } else {
            if (ch === '"') {
                if (in_quote) {
                    const previous_ch = source[end-1]
                    if (previous_ch !== '\\') {
                        in_quote = false
                    }
                } else {
                    in_quote = true
                }
            }

            if (!in_token) {
                start = end
                in_token = true
            }
        }

        end++
    }

    if (in_token) {
        const token = source.slice(start, end)
        tokens.push(token)
        in_token = false
    }

    return tokens
}

export const parse = (tokens = []) => {

    let i = 0
    let len = tokens.length

    const parse_group = () => {
        // (
        i++
        const or = parse_or()
        // )
        i++
        return or
    }

    const parse_and = () => {
        const data = []

        while (i < len) {
            const tk = tokens[i]
            if (tk === 'AND') {
                i++
            } else if (tk === 'OR') {
                break
            } else if (tk === 'NOT') {
                const not = parse_not()
                data.push(not)
            } else if (tk === '(') {
                const group = parse_group()
                data.push(group)
            } else if (tk === ')') {
                break
            } else {
                i++
                data.push(tk)
            }
        }

        if (data.length === 1) return data[0]

        return { type: 'and', data }
    }

    const parse_or = () => {
        let data = []
        while (i < len) {
            const and = parse_and()
            data.push(and)
            const tk = tokens[i]
            if (tk !== 'OR' || tk === ')') {
                break
            }
            i++
        }

        if (data.length === 1) return data[0]

        return { type: 'or', data }
    }

    const parse_not = () => {
        // NOT
        i++

        let data = []
        const tk = tokens[i]
        if (tk === 'AND') {
        } else if (tk === 'OR') {
        } else if (tk === 'NOT') {
        } else if (tk === '(') {
            const group = parse_group()
            data.push(group)
        } else {
            i++
            data.push(tk)
        }
        return { type: 'not', data }
    }

    return parse_or()
}

export const compile = (source) => {
    const tokens = tokenize(source)
    return parse(tokens)
}

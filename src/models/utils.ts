import { snakeCase } from 'lodash'

const toSnakeCaseKey = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => toSnakeCaseKey(v))
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [snakeCase(key)]: toSnakeCaseKey(obj[key]),
      }),
      {},
    )
  }
  return obj
}

export default { toSnakeCaseKey }
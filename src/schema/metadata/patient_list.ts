import S from 'fluent-json-schema'

const schema = S.object()
  .prop('query', S.string().minLength(2))
  .prop('limit', S.number().maximum(500).default(20).required())
  .prop('offset', S.number().minimum(0).default(0).required())

export default {
  querystring: schema
}
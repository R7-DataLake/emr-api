import S from 'fluent-json-schema'

const schema = S.object()
  .prop('cid', S.string().minLength(13).maxLength(13).required())

export default {
  body: schema
}
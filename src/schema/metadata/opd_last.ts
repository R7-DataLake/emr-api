import S from 'fluent-json-schema'

const schema = S.object()
  .prop('cid', S.string().required())

export default {
  body: schema
}
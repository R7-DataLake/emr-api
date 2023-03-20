import S from 'fluent-json-schema'

const schema = S.object()
  .prop('hospcode', S.string().required())
  .prop('hn', S.string().maxLength(50).required())
  .prop('seq', S.string().maxLength(50).required())
  .prop('zoneKey', S.string().required())

export default {
  body: schema
}
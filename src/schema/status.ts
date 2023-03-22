import S from 'fluent-json-schema'

const schema = S.object()
  .prop('zoneKey', S.string().required())

export default {
  body: schema
}
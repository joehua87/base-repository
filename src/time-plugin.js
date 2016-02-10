export default function timePlugin(schema) {
  schema.add({ createdTime: { type: Date, required: true, default: Date.now } })
  schema.add({ modifiedTime: { type: Date, required: true, default: Date.now } })

  schema.pre('save', function preSave(done) {
    this.modifiedTime = new Date()
    done()
  })
}

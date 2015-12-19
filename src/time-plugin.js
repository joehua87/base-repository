export default function timePlugin(schema) {
  schema.pre('save', function(done) {
    if (!this.createdTime) {
      this.createdTime = new Date();
    }

    this.modifiedTime = new Date();
    done();
  });
}

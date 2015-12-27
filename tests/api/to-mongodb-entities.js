import uuid from 'uuid';
import mongoose from 'mongoose';

/**
 * Transfer a list of entities to mongodb entities, to get _id, use for testing initial data.
 * Call this manually in dev
 * @param schema
 * @param entities
 * @returns Object[] - a list of entities with _id, __v, ...
 */
export default function* toMongoDbEntities(schema, entities) {
  const collection = uuid.v4();
  mongoose.connect(`mongodb://localhost/${collection}`);

  const Article = mongoose.model(schema.schemaName, schema.schema);
  const mongodbEntities = yield Article.create(entities);
  return mongodbEntities.map(entity => entity.toObject());
}

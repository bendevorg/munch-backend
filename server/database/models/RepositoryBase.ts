import {
  Document,
  Model,
  Types,
  QueryOptions,
  FilterQuery,
  CallbackError,
  QueryWithHelpers,
  EnforceDocument,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';

interface IRead<T extends Document> {
  retrieve: (callback: (error: any, result: any) => void) => void;
  findById: (id: string, callback: (error: any, result: T) => void) => void;
  findOne(
    filter?: FilterQuery<T>,
    projection?: any | null,
    options?: QueryOptions | null,
    callback?: (err: CallbackError, res: T | null) => void,
  ): QueryWithHelpers<
    EnforceDocument<T, {}> | null,
    EnforceDocument<T, {}>,
    {},
    T
  >;
  find(
    filter: FilterQuery<T>,
    projection?: any | null,
    options?: QueryOptions | null,
    callback?: (err: CallbackError, res: T[] | null) => void,
  ): QueryWithHelpers<
    Array<EnforceDocument<T, {}>>,
    EnforceDocument<T, {}>,
    {},
    T
  >;
}

interface IWrite<T> {
  create: (item: any) => Promise<T>;
  updateOne: (
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: QueryOptions | null,
    callback?: (error: any, result: any) => void,
  ) => void;
  updateMany: (
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: QueryOptions | null,
    callback?: (error: any, result: any) => void,
  ) => void;
  delete: (_id: string, callback: (error: any, result: any) => void) => void;
}

export default class Repository<T extends Document>
  implements IRead<T>, IWrite<T>
{
  private _model: Model<T>;

  constructor(schemaModel: Model<T>) {
    this._model = schemaModel;
  }

  create(item: any): Promise<T> {
    return this._model.create(item);
  }

  retrieve(callback: (error: any, result: T) => void) {
    this._model.find({}, callback);
  }

  updateOne(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: QueryOptions | null,
    callback?: (error: any, result: any) => void,
  ) {
    this._model.updateOne(filter, update, options, callback);
  }

  updateMany(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: QueryOptions | null,
    callback?: (error: any, result: any) => void,
  ) {
    this._model.updateMany(filter, update, options, callback);
  }

  delete(_id: string, callback: (error: any, result: any) => void) {
    this._model.remove({ _id: this.toObjectId(_id) } as FilterQuery<T>, (err) =>
      callback(err, null),
    );
  }

  findById(_id: string, callback: (error: any, result: T) => void) {
    this._model.findById(_id, callback);
  }

  findOne(
    filter?: FilterQuery<T>,
    projection?: any | null,
    options?: QueryOptions | null,
    callback?: (err: CallbackError, res: T | null) => void,
  ): QueryWithHelpers<
    EnforceDocument<T, {}> | null,
    EnforceDocument<T, {}>,
    {},
    T
  > {
    return this._model.findOne(filter, projection, options, callback);
  }

  find(
    filter: FilterQuery<T>,
    projection?: any | null,
    options?: QueryOptions | null,
    callback?: (err: CallbackError, res: T[] | null) => void,
  ): QueryWithHelpers<
    Array<EnforceDocument<T, {}>>,
    EnforceDocument<T, {}>,
    {},
    T
  > {
    return this._model.find(filter, projection, options, callback);
  }

  private toObjectId(_id: string): Types.ObjectId {
    return Types.ObjectId.createFromHexString(_id);
  }
}

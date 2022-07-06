/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { MongoDataSource } from 'apollo-datasource-mongodb';
import { ObjectId } from 'mongodb';
import { IJobPayload, IUpsertJobPayloadDTO } from './types';

export class JobPayloadDatasource extends MongoDataSource<IJobPayload, IContext> {
  upsertPayloadForAJob(id: string, jobID: string, payload: IUpsertJobPayloadDTO) {
    const _id = new ObjectId(id);

    return this.collection.updateOne(
      { jobID: new ObjectId(jobID), _id },
      {
        $push: { payloads: payload },
        $set: {
          createdAt: new Date(),
          updatedAt: new Date(),
          jobID: new ObjectId(jobID),
          _id,
        },
      },
      { upsert: true }
    );
  }
}

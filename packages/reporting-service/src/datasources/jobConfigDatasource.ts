import { MongoDataSource } from 'apollo-datasource-mongodb';
import { ObjectId } from 'mongodb';
import { ICreateJobDTO, IGetJobListDTO, IJobConfig, IUpdateJobDTO } from './types';

const OPERATION_FAILED_ERR = new Error('Operation failed');

export class JobConfigDatasource extends MongoDataSource<IJobConfig, IContext> {
  async createJobConfig(projectID: string, data: ICreateJobDTO) {
    const { createdBy } = data;

    const doc = await this.collection.insertOne({
      ...data,
      projectID: new ObjectId(projectID),
      updatedBy: createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: new ObjectId(),
    });

    if (!doc.acknowledged) {
      throw OPERATION_FAILED_ERR;
    }

    return this.findOneById(doc.insertedId);
  }

  async updateJobConfigByID(id: string, data: IUpdateJobDTO) {
    const doc = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!doc.ok) {
      throw OPERATION_FAILED_ERR;
    }

    return doc.value;
  }

  async deleteJobConfigByID(id: string) {
    const doc = await this.collection.findOneAndDelete({ _id: new ObjectId(id) });

    if (!doc.ok) {
      throw OPERATION_FAILED_ERR;
    }

    return doc.value;
  }

  async deleteAllJobsOfAProject(projectID: string) {
    return this.collection.deleteMany({ projectID: new ObjectId(projectID) });
  }

  getJobConfigs(options: IGetJobListDTO) {
    return this.findByFields({ projectID: options.projectID });
  }

  getJobConfigByID(id: string) {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }
}

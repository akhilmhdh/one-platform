import { MongoDataSource } from 'apollo-datasource-mongodb';
import { ObjectId } from 'mongodb';

import { IProjectDoc, ICreateProjectDTO, IUpdateProjectDTO } from './types';

const OPERATION_FAILED_ERR = new Error('Operation failed');

export class ProjectDatasource extends MongoDataSource<IProjectDoc, IContext> {
  async createProject(data: ICreateProjectDTO) {
    const doc = await this.collection.insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: new ObjectId(),
    });

    if (!doc.acknowledged) {
      throw OPERATION_FAILED_ERR;
    }

    return this.findOneById(doc.insertedId);
  }

  async updateProjectByID(id: string, data: IUpdateProjectDTO) {
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

  async deleteProjectByID(id: string) {
    const doc = await this.collection.findOneAndDelete({ _id: new ObjectId(id) });

    if (!doc.ok) {
      throw OPERATION_FAILED_ERR;
    }

    return doc.value;
  }

  getProjectById(id: string) {
    return this.findOneById(id);
  }

  getProjects() {
    return this.findByFields({});
  }
}

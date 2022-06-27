import { MongoDataSource } from 'apollo-datasource-mongodb';
import { ObjectId } from 'mongodb';

import { IProjectDoc, ICreateProjectDTO, IUpdateProjectDTO, IGetProjectListDTO } from './types';

const OPERATION_FAILED_ERR = new Error('Operation failed');

export class ProjectDatasource extends MongoDataSource<IProjectDoc, IContext> {
  async createProject(data: ICreateProjectDTO) {
    const { createdBy } = data;
    // add creating person to members list
    const doc = await this.collection.insertOne({
      ...data,
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

  async updateProjectByID(id: string, data: IUpdateProjectDTO) {
    const doc = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id), members: data.updatedBy },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!doc.ok) {
      throw OPERATION_FAILED_ERR;
    }

    return doc.value;
  }

  async deleteProjectByID(id: string, user: string) {
    const doc = await this.collection.findOneAndDelete({ _id: new ObjectId(id), members: user });

    if (!doc.ok) {
      throw OPERATION_FAILED_ERR;
    }

    const jobDeleted = await this.context.dataSources.jobConfigs.deleteAllJobsOfAProject(id);

    if (!jobDeleted.acknowledged) {
      throw OPERATION_FAILED_ERR;
    }

    return doc.value;
  }

  getProjectById(id: string, userID: string) {
    return this.collection.findOne({ _id: new ObjectId(id), members: userID });
  }

  getProjects(options: IGetProjectListDTO) {
    return this.findByFields({ members: options.userID });
  }

  async isAMemberOfProject(projectID: string, userID: string) {
    const doc = await this.findOneById(projectID);

    if (!doc) {
      throw new Error('Project not found');
    }

    return doc?.members.some((value) => value === userID);
  }
}

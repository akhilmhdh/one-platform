import { ObjectId } from 'mongodb';

import { Field } from '@/lib/equations';

export type IProjectDoc = {
  _id: ObjectId;
  name: string;
  description: string | null;
  members: string[];
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IUser = {
  cn: string;
  mail: string;
  uid: string;
  rhatUUID: string;
  rhatJobTitle: string;
};

export enum JobTypes {
  API_MONITOR = 'API-MONITOR',
}

export enum JobPayloadFileType {
  JSON = 'JSON',
  YAML = 'YAML',
}

export type IJobConfig = {
  _id: ObjectId;
  projectID: ObjectId;
  name: string;
  description?: string;
  cron?: string;
  jobs: Array<{
    fn: IJobFn;
    payload?: IJobPayload;
  }>;
  effects: [IJobEffects];
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IJobPayload = {
  type: JobPayloadFileType;
  fields?: Field;
};

export type IJobPlayload = {
  _id: ObjectId;
  payloads: Array<{
    url: string;
    method: string;
    payload: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  jobID: ObjectId;
};

export type IJobFn = {
  method: string;
  endpoint: string;
};

export type IJobEmailEffect = {
  to: string;
  cc: string;
  template: string;
};

export type IJobEffects = IJobEmailEffect;

// DTO
export type ICreateProjectDTO = {
  name: string;
  description: string | null;
  members: string[];
  createdBy: string;
};

export type IUpdateProjectDTO = Partial<Omit<IProjectDoc, '_id' | 'createdAt' | 'updatedAt'>> & {
  updatedBy: string;
};

export type IGetProjectListDTO = {
  userID: string;
};

export type ICreateJobDTO = Omit<
  IJobConfig,
  '_id' | 'createdAt' | 'updatedAt' | 'updatedBy' | 'projectID'
>;

export type IUpdateJobDTO = Partial<Omit<IJobConfig, '_id' | 'createdAt' | 'updatedAt'>>;

export type IGetJobListDTO = {
  projectID: string;
};

export type IUpsertJobPayloadDTO = {
  url: string;
  method: string;
  payload: string;
};

import { ObjectId } from 'mongodb';

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
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IJobPayload = {
  type: JobPayloadFileType;
  fields?: IJobField;
};

export type IJobFn = {
  method: string;
  endpoint: string;
};

export type IJobField = {
  condition?: FieldBaseOperators;
  rules: IJobRules[];
  not?: boolean;
};

export type IJobRules = { field: string; operator: FieldOperators; value: unknown } | IJobField;

export enum FieldBaseOperators {
  AND = 'AND',
  OR = 'OR',
}

export enum FieldOperators {
  EQ = 'EQ',
  LT = 'LT',
  LTE = 'LTE',
  GT = 'GT',
  GTE = 'GTE',
  IN = 'IN',
}

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

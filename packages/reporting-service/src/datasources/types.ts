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

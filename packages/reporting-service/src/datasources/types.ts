import { ObjectId } from 'mongodb';

export type IProjectDoc = {
  _id: ObjectId;
  name: string;
  description: string | null;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
};

// DTO
export type ICreateProjectDTO = {
  name: string;
  description: string | null;
  members: string[];
};

export type IUpdateProjectDTO = Partial<Omit<IProjectDoc, '_id' | 'createdAt' | 'updatedAt'>>;

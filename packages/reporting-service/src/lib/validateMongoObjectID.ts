/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi';
import { ObjectId } from 'mongodb';

export const validateMongoDBObjectID = (id: string) => {
  return new ObjectId(id).toString() === id;
};

export const joiValidateMongoDBObjectID = (id: unknown, helper: Joi.CustomHelpers<any>) => {
  if (validateMongoDBObjectID(id as string)) return id;

  return helper.message({ custom: 'invalid mongodb error' });
};

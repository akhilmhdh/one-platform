import Joi from 'joi';
import { joiValidateMongoDBObjectID } from '@/lib/validateMongoObjectID';

import { CreateProjectArgs, UpdateProjectArgs } from './types';

export const createProjectValidation = Joi.object<CreateProjectArgs>({
  data: Joi.object({
    name: Joi.string().max(50).required(),
    description: Joi.string().max(500),
    members: Joi.array().items(Joi.string()).required().min(1),
  }),
});

export const updateProjectValidation = Joi.object<UpdateProjectArgs>({
  id: Joi.string().required().custom(joiValidateMongoDBObjectID),
  data: Joi.object({
    name: [Joi.string(), Joi.any().strip()],
    description: [Joi.string().max(500), Joi.any().strip()],
    members: [Joi.array().items(Joi.string()), Joi.any().strip()],
  }),
});

export const verifyMongoDBID = Joi.object<{ id: string }>({
  id: Joi.string().required().custom(joiValidateMongoDBObjectID),
});

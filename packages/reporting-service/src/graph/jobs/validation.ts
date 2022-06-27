import Joi from 'joi';

import { joiValidateMongoDBObjectID } from '@/lib/validateMongoObjectID';
import { CreateReportingJobInput, DeleteReportingJobInput, UpdateReportingJobInput } from './types';
import { FieldBaseOperators, FieldOperators } from '@/datasources/types';

export const createJobConfigValidation = Joi.object<CreateReportingJobInput>({
  projectID: Joi.string().required().custom(joiValidateMongoDBObjectID),
  data: Joi.object({
    name: Joi.string().required().max(50),
    description: [Joi.string().required().max(500), Joi.any().strip()],
    cron: Joi.string().required().max(50),
    jobs: Joi.array()
      .items(
        Joi.object({
          payload: Joi.object({
            type: Joi.string().valid('JSON', 'YAML'),
            fields: Joi.object({
              condition: Joi.string()
                .valid(...Object.values(FieldBaseOperators))
                .default(FieldBaseOperators.AND),
              not: Joi.bool().default(false),
              rules: Joi.array().items(
                Joi.object({
                  field: Joi.string().required(),
                  operator: Joi.string()
                    .required()
                    .valid(...Object.values(FieldOperators)),
                  value: Joi.string().required(),
                  rule: Joi.array().items(Joi.link('....fields')),
                })
              ),
            }),
          }),
          fn: Joi.object({
            method: Joi.string().required(),
            endpoint: Joi.string().required(),
          }).required(),
        }).required()
      )
      .min(1)
      .max(100)
      .required(),
  }).required(),
});

export const updateJobConfigValidation = Joi.object<UpdateReportingJobInput>({
  projectID: Joi.string().required().custom(joiValidateMongoDBObjectID),
  jobID: Joi.string().required().custom(joiValidateMongoDBObjectID),
  data: Joi.object({
    name: [Joi.string().max(50), Joi.any().strip()],
    description: [Joi.string().max(500), Joi.any().strip()],
    cron: [Joi.string().max(50), Joi.any().strip()],
    jobs: Joi.array()
      .items(
        Joi.object({
          payload: Joi.object({
            type: Joi.string().valid('JSON', 'YAML').required(),
          }),
          fn: Joi.object({
            method: Joi.string().required(),
            endpoint: Joi.string().required(),
          }).required(),
        })
      )
      .min(1)
      .max(100),
  }).required(),
});

export const deleteJobConfigValidation = Joi.object<DeleteReportingJobInput>({
  projectID: Joi.string().required().custom(joiValidateMongoDBObjectID),
  jobID: Joi.string().required().custom(joiValidateMongoDBObjectID),
});

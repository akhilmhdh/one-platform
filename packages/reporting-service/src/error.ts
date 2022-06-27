import Joi from 'joi';

export class GQLValidationError extends Error {
  details: Joi.ValidationErrorItem[];

  constructor(details: Joi.ValidationErrorItem[]) {
    super('Validation error');
    this.details = details;
  }
}

export const InvalidMongoIDMsg = 'Invalid mongodb id';

export const UnauthorizedProjectAccess = new Error('Unauthorized access to project');

import { IUser, JobPayloadFileType } from '@/datasources/types';
import { FieldBaseOperators, FieldOperators } from '@/lib/equations';

export type ReportingJobTask = {
  method: Scalars['String'];
  endpoint: Scalars['String'];
};

export type ReportingPayloadFieldInput = {
  condition: FieldBaseOperators;
  not: boolean;
  rules: ReportingRuleInput[];
};

export type ReportingRuleInput = {
  field: string;
  operator: FieldOperators;
  value: string;
  rule: ReportingPayloadFieldInput[];
};

export type ReportingJobPayload = {
  type: JobPayloadFileType;
};

export type ReportingJobPayloadInput = {
  type: JobPayloadFileType;
  fields: ReportingPayloadFieldInput;
};

export type ReportingJobEmailEffect = {
  to: Scalars['String'];
  cc: Scalars['String'];
  template: Scalars['String'];
};

export type ReportJobEffect = {
  email: ReportingJobEmailEffect;
};

export type ReportingJob = {
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  createdBy: IUser;
  updatedBy: IUser;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  cron: Scalars['String'];
  jobs: Array<{
    payload: ReportingJobPayload;
    fn: ReportingJobTask;
  }>;
};

export type CreateReportingJobInput = {
  data: {
    name: Scalars['String'];
    description: Scalars['String'];
    cron: Scalars['String'];
    jobs: Array<{
      payload: ReportingJobPayloadInput;
      fn: ReportingJobTask;
    }>;
    effects: ReportJobEffect;
  };
  projectID: string;
};

export type UpdateReportingJobInput = {
  data: {
    name: Scalars['String'];
    description: Scalars['String'];
    cron: Scalars['String'];
    jobs: Array<{
      payload: ReportingJobPayloadInput;
      fn: ReportingJobTask;
    }>;
  };
  projectID: string;
  jobID: string;
};

export type DeleteReportingJobInput = {
  projectID: string;
  jobID: string;
};

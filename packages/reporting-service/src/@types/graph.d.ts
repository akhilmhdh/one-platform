import DataLoader from 'dataloader';
import Agenda from 'agenda';
import { ProjectDatasource } from '@/datasources/projectDatasource';
import { JobConfigDatasource } from '@/datasources/jobConfigDatasource';
import { IUser } from '@/datasources/types';

declare global {
  type Maybe<T> = T | null;

  type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    DateTime: string;
  };

  type IContext = {
    dataSources: {
      projects: ProjectDatasource;
      jobConfigs: JobConfigDatasource;
    };
    loaders: {
      user: DataLoader<string, IUser, string>;
    };
    user: { id: string };
    agenda: Agenda;
  };
}

import { ProjectDatasource } from '@/datasources/projectDatasource';

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
    };
    //   loaders: {};
    user: { id: string };
  };
}

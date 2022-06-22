export type GetProjectByIDArgs = {
  id: string;
};

export type CreateProjectArgs = {
  data: {
    name: Scalars['String'];
    description: Maybe<Scalars['String']>;
    members: Scalars['String'][];
    createdBy: string;
  };
};

export type UpdateProjectArgs = {
  id: Scalars['ID'];
  data: {
    name: Scalars['String'];
    description: Scalars['String'];
    members: Scalars['String'][];
    updatedBy: string;
  };
};

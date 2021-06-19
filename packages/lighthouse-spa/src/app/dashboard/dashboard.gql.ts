import { gql } from 'apollo-angular';

export const FetchProperties = gql`
  query FetchProperties {
    fetchProperties {
      projectId
      name
    }
  }
`;

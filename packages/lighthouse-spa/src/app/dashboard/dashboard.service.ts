import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GraphQLModule } from 'app/graphql.module';
import { FetchProperties } from './dashboard.gql';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends GraphQLModule {
  constructor(private apollo: Apollo) {
    super();
  }

  fetchProperties() {
    return this.apollo.watchQuery<{ fetchProperties: FetchProperties[] }>({
      query: FetchProperties,
    });
  }
}

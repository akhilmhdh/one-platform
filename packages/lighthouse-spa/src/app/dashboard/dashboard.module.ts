import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphQLModule } from 'app/graphql.module';
import { HttpClientModule } from '@angular/common/http';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PropertyCardComponent } from './components/property-card/property-card.component';

@NgModule({
  declarations: [DashboardComponent, PropertyCardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    GraphQLModule,
    HttpClientModule,
  ],
})
export class DashboardModule {}

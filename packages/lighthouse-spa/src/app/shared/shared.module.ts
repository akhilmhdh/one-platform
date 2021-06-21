import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { RouterModule } from '@angular/router';
import { OutlinedPieGraphComponent } from './components/outlined-pie-graph/outlined-pie-graph.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    AppLayoutComponent,
    OutlinedPieGraphComponent,
    LoaderComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [AppLayoutComponent, OutlinedPieGraphComponent, LoaderComponent],
})
export class SharedModule {}

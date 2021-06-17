import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { RouterModule } from '@angular/router';
import { OutlinedPieGraphComponent } from './components/outlined-pie-graph/outlined-pie-graph.component';

@NgModule({
  declarations: [AppLayoutComponent, OutlinedPieGraphComponent],
  imports: [CommonModule, RouterModule],
  exports: [AppLayoutComponent, OutlinedPieGraphComponent],
})
export class SharedModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppLayoutComponent],
  imports: [CommonModule, RouterModule],
  exports: [AppLayoutComponent],
})
export class SharedModule {}

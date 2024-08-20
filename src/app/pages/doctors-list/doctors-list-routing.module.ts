import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DoctorsListPage } from './doctors-list';
const routes: Routes = [
  {
    path: '',
    component: DoctorsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorsListPageRoutingModule {}

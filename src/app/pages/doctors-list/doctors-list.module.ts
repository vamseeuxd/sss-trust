import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { DoctorsListPage } from './doctors-list';
import { DoctorsListPageRoutingModule } from './doctors-list-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoctorsListPageRoutingModule
  ],
  declarations: [DoctorsListPage],
})
export class DoctorsListModule {}

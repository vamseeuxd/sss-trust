import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { Page } from './page';
import { PageRoutingModule } from './page-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageRoutingModule
  ],
  declarations: [Page],
})
export class PageModule {}

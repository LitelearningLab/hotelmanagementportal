import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { UniversitiesRoutingModule } from './universities-routing.module';
import { UniversityContentComponent } from './university-content.component';

@NgModule({
  declarations: [UniversityContentComponent],
  imports: [CommonModule, FormsModule, NgSelectModule, UniversitiesRoutingModule]
})
export class UniversitiesModule {}

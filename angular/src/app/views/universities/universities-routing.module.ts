import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniversityContentComponent } from './university-content.component';

const routes: Routes = [
  { path: 'content', component: UniversityContentComponent, data: { title: 'Upload Content' } },
  { path: '', redirectTo: 'content', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UniversitiesRoutingModule {}

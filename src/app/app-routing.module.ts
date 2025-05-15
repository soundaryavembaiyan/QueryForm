import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InquiryFormComponent } from './pages/inquiry-form/inquiry-form.component';
import { HomeComponent } from './pages/home/home.component';
import { SuccessMessageComponent } from './components/success-message/success-message.component';
import { DocumentDropoffComponent } from './document-upload/document-dropoff/document-dropoff.component';

const routes: Routes = [
  { path: '', component: InquiryFormComponent },
  // { path: 'inquiry-form/DA834C5B756D51C7', component: InquiryFormComponent },
  { path: 'inquiry-form', component: InquiryFormComponent },
  { path: 'success', component: SuccessMessageComponent },
  { path: 'document-upload', component: DocumentDropoffComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

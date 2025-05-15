import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StepProgressorComponent } from './components/step-progressor/step-progressor.component';
import { SuccessMessageComponent } from './components/success-message/success-message.component';
import { SuccessDocMessageComponent } from './document-upload/success-message/success-message.component';
import { StepIndicatorComponent } from './components/shared/step-indicator/step-indicator.component';
import { HomeComponent } from './pages/home/home.component';
import { InquiryFormComponent } from './pages/inquiry-form/inquiry-form.component';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DocumentDropoffComponent } from './document-upload/document-dropoff/document-dropoff.component';
import { ConfirmDialogComponent } from './document-upload/confirm-dialog/confirm-dialog.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    DocumentDropoffComponent,
    ConfirmDialogComponent,
    SuccessMessageComponent,
    StepProgressorComponent,
    SuccessDocMessageComponent,
    StepIndicatorComponent,
    HomeComponent,
    InquiryFormComponent,
    QrScannerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InquiryFormData, InquiryFormService } from 'src/app/services/inquiry-form.service';

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.css']
})
export class SuccessMessageComponent implements OnInit {
  formData: any;
  getUid:any;
  constructor(
    private router: Router,
    private inquiryService: InquiryFormService
  ) {
    // Get the submitted data to display on the success page if needed
    this.formData = this.inquiryService.getFormData();
  }

  ngOnInit(): void {
    // Check if we have form data
    // const formData = this.inquiryService.getFormData();
    // if (!formData.uid) {
    //   // If no form data, redirect to home
    //   this.router.navigate(['/']);
    // }
    this.getUid = localStorage.getItem('uid');
  }

  // Method to start a new inquiry
  startNewInquiry(): void {
    // Reset the form data and navigate back to the inquiry form
    this.inquiryService.resetForm();
    this.router.navigate(['/inquiry-form'], {
      queryParams: { uid: this.getUid }
    });
  }

  // Method to go to home page
  goToHome(): void {
    // Reset the form data and navigate to home
    this.inquiryService.resetForm();
    this.router.navigate(['/']);
  }
}

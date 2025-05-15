import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { URLUtils } from '../urlUtils';
import { HttpService } from '../https.service';

// Update this interface to include our new properties
export interface InquiryFormData {
  // Step 1 - Issue Selection
  issueType?: string;  // Keep for backward compatibility
  selectedIssues?: string[];  // New property for checkbox selections
  otherIssueDetails?: string;  // New property for "Other" details

  // Step 2 - Issue Description
  issueDescription?: string;
  issueLocation?: string;  // Keep for backward compatibility

  // Step 3 - Personal Details
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  zipCode?: string;
  
  // For API integration
  uid?: string;
  group_id?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class InquiryFormService {
  private currentStepSubject = new BehaviorSubject<number>(1);
  currentStep$ = this.currentStepSubject.asObservable();
  
  private formData: InquiryFormData = {};
  private departments: any[] = [];

  constructor(private httpService: HttpService) { }

  setCurrentStep(step: number): void {
    this.currentStepSubject.next(step);
  }

  getCurrentStep(): number {
    return this.currentStepSubject.value;
  }

  updateFormData(data: Partial<InquiryFormData>): void {
    this.formData = { ...this.formData, ...data };
  }

  getFormData(): InquiryFormData {
    return this.formData;
  }

  setDepartments(depts: any[]): void {
    this.departments = depts;
  }

  getDepartments(): any[] {
    return this.departments;
  }

  // Add the resetForm method to clear all form data and reset to step 1
  resetForm(): void {
    this.formData = {};
    this.setCurrentStep(1);
  }

  // Updated form submission method with API integration
  // submitForm(): Promise<boolean> {
  //   return new Promise<boolean>((resolve) => {
  //     // Prepare the data for API
  //     const payload = this.prepareApiPayload();
      
  //     // Send the API request
  //     this.httpService.sendPostRequest(URLUtils.submitEnquiry(this.formData.uid || "DA834C5B756D51C7"), payload).subscribe(
  //       (resp: any) => {
  //         console.log('Form submitted successfully:', resp);
  //         resolve(true);
  //       },
  //       (error) => {
  //         console.error('Error submitting form:', error);
  //         resolve(false);
  //       }
  //     );
  //   });
  // }
  
  // Prepare API payload in the required format
  public prepareApiPayload(): any {
    // Create full name from first and last name
    const name = `${this.formData.firstName || ''} ${this.formData.lastName || ''}`.trim();
    
    console.log('siss:', this.formData.selectedIssues);

    // Get the main issue as department
    const department = this.formData.selectedIssues && this.formData.selectedIssues.length > 0 ? 
                      this.formData.selectedIssues[0].toLowerCase() : 'other';
    console.log('Department:', department);
    // Create location array
    const location = this.formData.issueLocation ? [this.formData.issueLocation] : [];
    
    // Create issue array with description
    const issue = this.formData.issueDescription ? [this.formData.issueDescription] : [];

    const address = {
      zipcode: this.formData.zipCode || ""
    };
    //payload
    return {
      "uid": this.formData.uid || "",
      "department": this.formData.selectedIssues,
      "name": name,
      "email": this.formData.email || "",
      "phone": this.formData.phoneNumber || "",
      "address": address,
      "location": location,
      "comments": [],
      "issue": issue,
      "group_id": this.formData.group_id
    };
  }
}
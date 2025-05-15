import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/https.service';
import { InquiryFormService } from 'src/app/services/inquiry-form.service';
import { URLUtils } from 'src/app/urlUtils';
import { AbstractControl, ValidationErrors } from '@angular/forms';
export function strictEmailValidator(control: AbstractControl): ValidationErrors | null {
  const email = control.value;
  if (!email) return null;

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email) ? null : { invalidEmail: true };
}

@Component({
  selector: 'app-step-progressor',
  templateUrl: './step-progressor.component.html',
  styleUrls: ['./step-progressor.component.css']
})
export class StepProgressorComponent {
  isValidUid: boolean = true; // default to true

  currentStep = 1;
  totalSteps = 3;
  isSubmitting = false;
  isFormSubmitted = false;
  uid: any;
  
  // Form groups for each step
  issueSelectionForm: FormGroup;
  issueDescriptionForm: FormGroup;
  personalDetailsForm: FormGroup;
  
  // Types of legal issues
  issueTypes: string[] = [];
  departments: any[] = [];

  constructor(
    private fb: FormBuilder,
    private inquiryService: InquiryFormService,
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize form groups with checkboxes for each issue type
    const issueFormControls: any = {};
    
    this.issueSelectionForm = this.fb.group(issueFormControls, {
      validators: this.atLeastOneCheckboxValidator()
    });
    
    this.issueDescriptionForm = this.fb.group({
      issueDescription: ['', [Validators.required, Validators.maxLength(500)]],
      issueLocation: [''] // Add new field with no validators since it's optional
    });
    
    this.personalDetailsForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [''],
      email: ['', [Validators.required, strictEmailValidator]],
      address: [''],
      zipCode: ['']
    });
  }

  ngOnInit(): void {

     // Get UID from the URL
  this.route.queryParamMap.subscribe(params => {
    this.uid = params.get('uid');
    //console.log('UID:', this.uid);
    localStorage.setItem('uid', this.uid);

    if (this.uid) {
      // Save UID in form data
      this.inquiryService.updateFormData({ uid: this.uid });

      // Fetch departments from API
      this.fetchDepartments();
    } else {
      console.error('No UID provided');
    }
  });

  // Subscribe to step changes from the service
  this.inquiryService.currentStep$.subscribe(step => {
    this.currentStep = step;
  });
  }
  
  // Fetch departments from the API
  fetchDepartments(): void {
    this.httpService.sendGetRequest(URLUtils.departments(this.uid)).subscribe(
      (resp: any) => {
        if (resp && resp.data) {
          //this.departments = resp.data;
          this.departments = resp?.data.filter((group: any) => group.name !== 'AAM' && group.name !== 'SuperUser');
          //console.log('Departments:', this.departments);
          this.inquiryService.setDepartments(this.departments);
          
          // Extract department names
          this.issueTypes = this.departments.map(dept => dept.name);
          
          // Initialize form controls after getting departments
          this.initIssueForm();
          
          // Load saved form data if any
          this.loadSavedFormData();
        }
      },
      (error) => {
        console.error('Error fetching departments:', error);
        // Fallback to default issue types
        this.issueTypes = [
          'Criminal Law',
          'Family Law',
          'Corporate Law',
          'Immigration Law',
          'Real Estate Law',
          'Personal Injury',
          'Intellectual Property',
          'Other'
        ];
        this.initIssueForm();
      }
    );
  }
  
  // Initialize the issue selection form with dynamic controls
  initIssueForm(): void {
    const issueFormControls: any = {};
    this.issueTypes.forEach(issue => {
      issueFormControls[issue] = [false];
    });
    
    // Add other issue details control
    issueFormControls['otherIssueDetails'] = ['', Validators.nullValidator];
    
    this.issueSelectionForm = this.fb.group(issueFormControls, {
      validators: this.atLeastOneCheckboxValidator()
    });
    
    // Add validator for otherIssueDetails when 'Other' is checked
    if (this.issueSelectionForm.get('Other')) {
      this.issueSelectionForm.get('Other')?.valueChanges.subscribe(isChecked => {
        const otherDetailsControl = this.issueSelectionForm.get('otherIssueDetails');
        if (isChecked) {
          otherDetailsControl?.setValidators([Validators.required]);
        } else {
          otherDetailsControl?.clearValidators();
        }
        otherDetailsControl?.updateValueAndValidity();
      });
    }
  }
  
  // Load any saved form data
  loadSavedFormData(): void {
    const formData = this.inquiryService.getFormData();
    
    if (formData.selectedIssues) {
      // Handle restored checkboxes
      for (const issue of this.issueTypes) {
        if (formData.selectedIssues.includes(issue)) {
          this.issueSelectionForm.get(issue)?.setValue(true);
        }
      }
      
      // Restore other issue details if applicable
      if (formData.otherIssueDetails) {
        this.issueSelectionForm.get('otherIssueDetails')?.setValue(formData.otherIssueDetails);
      }
    }
    
    if (formData.issueDescription) {
      this.issueDescriptionForm.patchValue({
        issueDescription: formData.issueDescription,
        issueLocation: formData.issueLocation || '' // Load saved issue location
      });
    }
    
    if (formData.firstName || formData.lastName || formData.email) {
      this.personalDetailsForm.patchValue({
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        phoneNumber: formData.phoneNumber || '',
        email: formData.email || '',
        address: formData.address || '',
        zipCode: formData.zipCode || ''
      });
    }
  }

  nextStep(): void {
    this.isFormSubmitted = true;
    
    if (this.currentStep === 1 && this.issueSelectionForm.valid) {
      // Get selected issues
      //console.log('Selected issueTypes:', this.issueTypes);

      const selectedIssues = this.issueTypes.filter(issue => 
        this.issueSelectionForm.get(issue)?.value === true
      );
      
      // console.log('Selected issues:', selectedIssues);
      // console.log('Selected departments:', this.departments);

      // Get the group_id if a department is selected
      let group_id: any[] = [];
      if (selectedIssues.length > 0) {
        //const department = this.departments.find(dept => dept.name === selectedIssues);
        const department = this.departments.find(dept => selectedIssues.includes(dept.name));
        //console.log('d department:', department);

        group_id = this.departments
        .filter(dept => selectedIssues.includes(dept.name))
        .map(dept => dept.id);
    
        //console.log('Matching group IDs:', group_id);


        // if (department) {
        //   group_id = department.id;
        // }
      }
      
      // Save selected issues and other details if applicable
      const formData = {
        selectedIssues: selectedIssues,
        otherIssueDetails: this.issueSelectionForm.get('otherIssueDetails')?.value,
        group_id: group_id
      };
      //console.log('Form data for step 1:', formData);
      
      this.inquiryService.updateFormData(formData);
      this.inquiryService.setCurrentStep(2);
      this.isFormSubmitted = false;
    } else if (this.currentStep === 2 && this.issueDescriptionForm.valid) {
      this.inquiryService.updateFormData(this.issueDescriptionForm.value);
      this.inquiryService.setCurrentStep(3);
      this.isFormSubmitted = false;
    } else if (this.currentStep === 3 && this.personalDetailsForm.valid) {
      this.submitForm();
    } else {
      // Mark all controls as touched to trigger validation messages
      if (this.currentStep === 1) {
        this.markFormGroupTouched(this.issueSelectionForm);
      } else if (this.currentStep === 2) {
        this.markFormGroupTouched(this.issueDescriptionForm);
      } else if (this.currentStep === 3) {
        this.markFormGroupTouched(this.personalDetailsForm);
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      //console.log('Saving data for step:', this.currentStep);
  
      if (this.currentStep === 2) {
        this.inquiryService.updateFormData(this.issueSelectionForm.value);
        //console.log('Step 1 data saved:', this.issueSelectionForm.value);
      } else if (this.currentStep === 3) {
        this.inquiryService.updateFormData(this.issueDescriptionForm.value);
        //console.log('Step 2 data saved:', this.issueDescriptionForm.value);
      }
  
      this.inquiryService.setCurrentStep(this.currentStep - 1);
      this.isFormSubmitted = false;

     if (this.currentStep === 1) {
      // ✅ Ensure form controls exist
      this.initIssueForm();
  
      // ✅ Restore saved values
      setTimeout(() => {
        this.loadSavedFormData();
        
        // Add this code to apply selected class to checked checkboxes
        this.applySelectedClassToCheckedIssues();
      }, 0);
    }
  }
}
  private applySelectedClassToCheckedIssues(): void {
    // Wait for the DOM to update
    setTimeout(() => {
      this.issueTypes.forEach(issue => {
        const isChecked = this.issueSelectionForm.get(issue)?.value;
        if (isChecked) {
          const checkbox = document.getElementById(`issue-${issue}`);
          if (checkbox) {
            const issueElement = checkbox.closest('.issue-option');
            if (issueElement) {
              issueElement.classList.add('selected');
            }
          }
        }
      });
    }, 0);
  }
  submitForm(): void {
    if (this.personalDetailsForm.invalid) {
      this.personalDetailsForm.markAllAsTouched(); // <--- ADD THIS LINE
      return; // <--- STOP submission if invalid
    }
   else {
      const details = this.personalDetailsForm.value;
      this.isSubmitting = true;
  
      this.inquiryService.updateFormData(details);
      const payload = this.inquiryService.prepareApiPayload();
  
      this.httpService.sendPostRequest(URLUtils.submitEnquiry(this.uid), payload).subscribe(
        (resp: any) => {
          //console.log('Form submitted successfully:', resp);
          this.router.navigate(['/success']).then(() => {
            this.inquiryService.resetForm(); // optional, after navigation only
          });
          this.isSubmitting = false;
        },
        (error) => {
          console.error('Error submitting form:', error);
          this.isSubmitting = false;
        }
      );
    }
  }
  

  // Custom validator to ensure at least one checkbox is selected
  private atLeastOneCheckboxValidator() {
    return (formGroup: FormGroup) => {
      const checkboxes = this.issueTypes.map(issue => formGroup.get(issue)?.value);
      const isAtLeastOneChecked = checkboxes.some(val => val === true);
      
      return isAtLeastOneChecked ? null : { requireOneCheckbox: true };
    };
  }

  // Add this method to toggle selected state for visual feedback
  toggleSelectedClass(event: any, issue: string): void {
    const isChecked = event.target.checked;
    const issueElement = event.target.closest('.issue-option');
    
    if (issueElement) {
      if (isChecked) {
        issueElement.classList.add('selected');
      } else {
        issueElement.classList.remove('selected');
      }
    }
  }

  // Helper method to check if other details is required and invalid
  showOtherDetailsError(): boolean {
    const otherChecked = this.issueSelectionForm.get('Other')?.value;
    const otherDetailsControl = this.issueSelectionForm.get('otherIssueDetails');
    
    return otherChecked && 
           otherDetailsControl?.invalid && 
           (otherDetailsControl?.touched || this.isFormSubmitted);
  }

  // Helper method to mark all controls in a form group as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  // Method to calculate remaining characters for issue description
  getRemainingCharacters(): number {
    const maxChars = 500;
    const currentChars = this.issueDescriptionForm.get('issueDescription')?.value?.length || 0;
    return maxChars - currentChars;
  }
  
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InquiryFormService } from 'src/app/services/inquiry-form.service';

@Component({
  selector: 'app-inquiry-form',
  templateUrl: './inquiry-form.component.html',
  styleUrls: ['./inquiry-form.component.css']
})
export class InquiryFormComponent implements OnInit {
  isValidUid: boolean = false;
  uid:any;

  constructor(
    private inquiryService: InquiryFormService,
    private route: ActivatedRoute
  ) {
    // Reset the form state when navigating to this page
    this.inquiryService.setCurrentStep(1);
  }

  ngOnInit(): void {
    // Get UID from the URL query params
    this.route.queryParamMap.subscribe(params => {
      this.uid = params.get('uid');
      // console.log('uid',this.uid)
      localStorage.setItem('uid', this.uid);
      this.isValidUid = !!this.uid; // Convert to boolean
      
      // Save UID in form data if valid
      if (this.isValidUid) {
        this.inquiryService.updateFormData({ uid: this.uid });
      }
    });
  }

}

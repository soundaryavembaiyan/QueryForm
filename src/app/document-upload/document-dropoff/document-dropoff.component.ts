import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FileUploadService } from '../services/file-upload.service';
import { HttpService } from 'src/app/https.service';
import { URLUtils } from 'src/app/urlUtils';
import { NgxSpinnerService } from "ngx-spinner";
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-document-dropoff',
  templateUrl: './document-dropoff.component.html',
  styleUrls: ['./document-dropoff.component.css']
})
export class DocumentDropoffComponent {
  uploadForm!: FormGroup;
  files: File[] = [];
  showNotes = false;
  showConfirmDialog = false;
  showCancelDialog = false;
  showSuccessMessage = false;
  firmName = 'Legal Marketplace Co.';
  isValidUid: boolean = false;
  uid:any;
  enquiryid:any;
  formDataToUpload: FormData | null = null;
  successFileCount:any;

  constructor(
    private fb: FormBuilder, private httpService:HttpService,
    private fileUploadService: FileUploadService,private toastr: ToastrService,
    private route: ActivatedRoute,private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    //this.uid = '60E322C8971E221B'; //uid

    // Get enquiryid from the URL query params
    this.route.queryParamMap.subscribe(params => {
      this.uid = params.get('uid');
      this.enquiryid = params.get('enquiryid');
      // console.log('uid',this.enquiryid)
      localStorage.setItem('enquiryid', this.enquiryid);
      localStorage.setItem('uid', this.uid);

      this.isValidUid = !!this.enquiryid; // Convert to boolean

      // Save UID in form data if valid
      if (this.isValidUid) {
        this.uploadForm = this.fb.group({
          notes: ['']
        });

        // Get firmName from query params if available
        const urlParams = new URLSearchParams(window.location.search);
        const firmParam = urlParams.get('firm');
        if (firmParam) {
          this.firmName = firmParam;
        }
      }
    });
  }

  // onFileDropped(files: FileList) {
  //   this.handleFiles(files);
  // }
  onFileDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  fileBrowseHandler(event: any) {
    const files = event.target.files;
    this.handleFiles(files);
  }

  handleFiles(files: FileList) {
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.files.push(files[i]);
      }
      this.showNotes = true;
    }
        
    // Set focus on the last added textarea
    setTimeout(() => {
      const textareas = document.querySelectorAll('.addmessage');
      const lastTextarea = textareas[textareas.length - 1] as HTMLTextAreaElement;
      if (lastTextarea) {
        lastTextarea.focus();
      }
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    if (this.files.length === 0) {
      this.showNotes = false;
    }
  }

  onSubmit() {
    if (this.files.length === 0) {
      alert('Please select at least one document to upload.');
      return;
    }

    this.showConfirmDialog = true;
  }

  confirmUpload(confirmed: boolean) {
    this.showConfirmDialog = false;
    this.showCancelDialog = false;
    this.spinner.show();

    if (confirmed && this.files.length > 0) {
      let uid = this.uid;
      let formValues = this.uploadForm.value;
      let description = formValues.notes?.trim() || 'no description was provided'; // Add default description if empty
      let sharedFileCount = this.files.length; // Store before clearing

      this.files.forEach((file) => {
        const formData = new FormData();
        formData.append('file', file);  
        formData.append('filename', file.name);    
        formData.append('name', file.name);        
        formData.append('category', 'client');
        formData.append('description', description);
        formData.append('enquiryid', this.enquiryid); 
  
        this.httpService.sendPostRequest(URLUtils.uploadDocument(uid), formData)
          .subscribe({
            next: (res) => {
              this.spinner.hide();
              this.successFileCount = sharedFileCount;
              this.showSuccessMessage = true;
              this.isValidUid = false;
            },
            // error: (err) => {
            //   this.spinner.hide(); 
            //   console.error(`Upload failed for ${file.name}:`, err);
            //  // alert(`Failed to upload ${file.name}. Please try again.`);
            // }
            error: (error: HttpErrorResponse) => {
              this.spinner.hide();
              let errorMessage = 'Something went wrong.';
              if (error.status === 500) {
                errorMessage = error.error?.msg || 'Internal Server Error';
              } else if (error.status === 401 || error.status === 403) {
                errorMessage = error.error?.msg || 'Unauthorized';
              }
              this.toastr.error(`Failed to upload ${file.name}. Please try again.`);
              console.error('Error submitting lead:', error);
            }
          });
      });
  
      // Reset
      this.uploadForm.reset();
      this.files = [];
    } else {
      this.spinner.hide();
      this.showConfirmDialog = false;
      this.showCancelDialog = false;
      console.log('Upload canceled');
    }
  
  }

  getFileIconClass(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'fa-file-pdf';
      case 'doc':
      case 'docx':
        return 'fa-file-word';
      case 'xls':
      case 'xlsx':
        return 'fa-file-excel';
      case 'ppt':
      case 'pptx':
        return 'fa-file-powerpoint';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'fa-file-image';
      case 'zip':
      case 'rar':
        return 'fa-file-archive';
      case 'txt':
        return 'fa-file-alt';
      default:
        return 'fa-file';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  cancelConfirm(confirmed: boolean){
    this.showConfirmDialog = false;
    this.showCancelDialog = false;

    if (confirmed) {
      this.files = [];
      this.uploadForm.reset();
      this.showNotes = false;
    }
  }

  cancelUpload() {
    this.showCancelDialog = true;
    // if (confirm('Are you sure you want to cancel? All selected files will be cleared.')) {
    //   this.files = [];
    //   this.uploadForm.reset();
    // }
  }
  closeSuccessMessage() {
    this.showSuccessMessage = false;
    this.files = [];
    this.showNotes = false;
    this.uploadForm.reset();
  }
}

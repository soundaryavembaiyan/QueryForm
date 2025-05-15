import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/https.service';
import { URLUtils } from 'src/app/urlUtils';
import { Router } from '@angular/router';

@Component({
  selector: 'appdoc-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.css']
})
export class SuccessDocMessageComponent {
  @Input() message: string = 'Operation completed successfully.';
  @Output() close = new EventEmitter<void>();
  uid:any;

  constructor(
   private httpService:HttpService,
    private route: ActivatedRoute, private router: Router
  ) {}
  
  closeMessage() {
    //this.close.emit();
    const baseUrl = window.location.origin;
    const eid = localStorage.getItem('enquiryid');
    const uid = localStorage.getItem('uid');
    const link = `${baseUrl}/document-upload?uid=${uid}&enquiryid=${eid}`;
    window.location.href = link;
  }
}

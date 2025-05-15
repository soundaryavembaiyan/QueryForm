import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  @Input() message: string = 'Are you sure?';
  @Input() title: string = '';
  @Output() decision = new EventEmitter<boolean>();
  
  confirm() {
    this.decision.emit(true);
  }
  
  cancel() {
    this.decision.emit(false);
  }
}

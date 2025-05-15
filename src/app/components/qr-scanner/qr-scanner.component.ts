import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent {
  @Output() scanComplete = new EventEmitter<string>();
  
  // In a real implementation, you would integrate a QR scanner library
  scanQrCode() {
    // Simulate a successful QR code scan
    this.scanComplete.emit('scanned-value');
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  // Simulate QR code scanning
  onQrCodeScanned() {
    // In a real app, this would handle actual QR code scanning
    this.router.navigate(['/inquiry-form']);
  }
}

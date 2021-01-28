import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-thank-you',
  templateUrl: './product-thank-you.page.html',
  styleUrls: ['./product-thank-you.page.scss']
})
export class ProductThankYouPage {

  constructor(
    protected readonly router: Router
  ) { }

  goHome() {
    this.router.navigate(['']);
  }

}

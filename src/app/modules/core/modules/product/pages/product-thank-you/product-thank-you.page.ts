import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '@services';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-thank-you',
  templateUrl: './product-thank-you.page.html',
  styleUrls: ['./product-thank-you.page.scss']
})
export class ProductThankYouPage {

  constructor(
    protected readonly router: Router,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly service: CustomerService,
  ) {
    this.activatedRoute.params
      .pipe(
        switchMap((data) => service.follow(data.customerId, data.campaignId))
      )
      .subscribe()

  }
  ngOnInit() {
  }
  goHome() {
    this.router.navigate(['']);
  }

}

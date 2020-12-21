import { Component, Input, OnInit, Output, TemplateRef, EventEmitter } from '@angular/core';
import { environment } from '@environments/environment';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { GlobalService, TicketService } from '@services';
import { ProductVM } from '@view-models';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  @Output() useSelected: EventEmitter<ProductVM> = new EventEmitter<ProductVM>();
  @Input() product: ProductVM;
  @Input() search: string;
  description = '';
  form: FormGroup;
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly dialogService: NbDialogService,
    protected readonly ticketService: TicketService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly router: Router,
  ) {
    this.form = new FormGroup({
      description: new FormControl(''),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]),
      fullname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    })
  }

  ngOnInit() {
  }
  useContact = (templateGotoLogin: TemplateRef<any>, templateSupport: TemplateRef<any>) => {
    if (localStorage.getItem(environment.token)) {
      this.useDialog(templateSupport);
    } else {
      this.useDialog(templateGotoLogin);
    }
  }
  useDialog = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: true });
  }
  usePhone = () => {
    window.open('tel:' + '0902818547', '_self');
  }
  useLogin = () => {
    localStorage.clear();
    this.router.navigate(['auth/login']);
  }
  useSupport = (ref: NbDialogRef<any>) => {
    this.spinner.show('support-form');
    this.ticketService.insert({
      description: this.description + `<br>Product name: ${this.product.name}`,
      type: 'deal',
    } as any).subscribe((data) => {
      this.spinner.hide('support-form');
      ref.close();
      this.description = '';
      swal.fire('Your support form have been send!', 'Thask for your attention! We will contact you soon!', 'success');
    });
  }
  useSupportUnLogin = (ref: NbDialogRef<any>) => {
    this.spinner.show('support-form');
    this.ticketService.botInsert({
      description:
      'Fullname: ' + this.form.value.fullname + '<br>' +
      'Email: ' + this.form.value.email + '<br>' +
      'Phone: ' + this.form.value.phone + '<br>' +
      'Content: ' + this.form.value.description + `<br>Product name: ${this.product.name}`,
    type: 'deal'
    } as any) .pipe(
      tap(() => {
        swal.fire('Your support form have been sent!', 'Thanks for your attention! We will contact you soon!', 'success');
      }),
      catchError(() => {
        swal.fire('', 'Your support form send fail! Please try again!', 'error');
        return of(undefined);
      }),
      finalize(() => {
        this.spinner.hide('support-form');
        ref.close();
        this.form.reset();
      })
    )
    .subscribe();
  }
}

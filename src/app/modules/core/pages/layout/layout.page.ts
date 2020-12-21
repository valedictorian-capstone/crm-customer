import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService, NbDialogRef, NbToastrService } from '@nebular/theme';
import { AuthService, GlobalService, TicketService } from '@services';
import { CustomerVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from '@environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { tap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss']
})
export class LayoutPage implements OnInit {
  @ViewChild('globalCreatRef') globalCreatRef: TemplateRef<any>;
  customer: CustomerVM;
  description = '';
  type = 'deal';
  form: FormGroup;
  showChat = false;
  constructor(
    protected readonly dialogService: NbDialogService,
    protected readonly globalService: GlobalService,
    protected readonly authService: AuthService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly router: Router,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly ticketService: TicketService,
    protected readonly toastrService: NbToastrService,
  ) {
    this.form = new FormGroup({
      description: new FormControl(''),
      type: new FormControl('deal'),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)]),
      fullname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    })
    globalService.triggerView$.subscribe((context) => this.useDialog(context));
  }

  ngOnInit() {
    this.authService.auth({ id: localStorage.getItem('fcmToken'), ...this.deviceService.getDeviceInfo() } as any)
      .subscribe((data) => {
        this.customer = data;
      });
  }

  useDialog(context: { type: string, payload: any }) {
    this.dialogService.open<{ type: string, payload: any }>(this.globalCreatRef, { closeOnBackdropClick: true, context });
  }
  useDialogSupport = (template: TemplateRef<any>) => {
    this.dialogService.open(template, { closeOnBackdropClick: true });
  }
  useLogin = () => {
    localStorage.clear();
    this.router.navigate(['auth/login']);
  }
  usePhone = () => {
    window.open('tel:' + '0902818547', '_self');
  }
  useLink = (link: string) => {
    console.log(link);
    this.router.navigate([`core/${link}`]);
  }
  useContact = (templateGotoLogin: TemplateRef<any>, templateSupport: TemplateRef<any>) => {
    if (localStorage.getItem(environment.token)) {
      this.useDialogSupport(templateSupport);
    } else {
      this.useDialogSupport(templateGotoLogin);
    }
  }
  useSupport = (ref: NbDialogRef<any>) => {
    ref.close();
    this.ticketService.insert({
      description: this.description,
      type: this.type,
    } as any).subscribe((data) => {
      swal.fire('Your support form has been send!', 'Thask for your attention! We will contact you soon!', 'success');
    });
  }
  useSupportUnLogin = (ref: NbDialogRef<any>) => {
    this.spinner.show('support-form');
    this.ticketService.botInsert({
      description:
        'Fullname: ' + this.form.value.fullname + '<br>' +
        'Email: ' + this.form.value.email + '<br>' +
        'Phone: ' + this.form.value.phone + '<br>' +
        'Content: ' + this.form.value.description,
      type: this.form.value.type
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
        this.form.reset({
          fullname: '',
          email: '',
          phone: '',
          type: 'deal'
        });
      })
    )
    .subscribe();
  }
}

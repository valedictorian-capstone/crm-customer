import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService, NbDialogRef, NbToastrService } from '@nebular/theme';
import { AuthService, GlobalService, TicketService } from '@services';
import { CustomerVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from '@environments/environment';

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
  showChat = false;
  constructor(
    protected readonly dialogService: NbDialogService,
    protected readonly globalService: GlobalService,
    protected readonly authService: AuthService,
    protected readonly router: Router,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly ticketService: TicketService,
    protected readonly toastrService: NbToastrService,
  ) {
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
    this.router.navigate(['core/' + link]);
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
}

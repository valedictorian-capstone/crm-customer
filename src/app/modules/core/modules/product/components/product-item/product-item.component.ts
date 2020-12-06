import { Component, Input, OnInit, Output, TemplateRef, EventEmitter } from '@angular/core';
import { environment } from '@environments/environment';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { GlobalService, TicketService } from '@services';
import { ProductVM } from '@view-models';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

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
  constructor(
    protected readonly globalService: GlobalService,
    protected readonly dialogService: NbDialogService,
    protected readonly ticketService: TicketService,
    protected readonly router: Router,
  ) {

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
    ref.close();
    this.ticketService.insert({
      description: this.description,
      type: 'deal',
    } as any).subscribe((data) => {
      swal.fire('Your support form have been send!', 'Thask for your attention! We will contact you soon!', 'success');
    });
  }
}

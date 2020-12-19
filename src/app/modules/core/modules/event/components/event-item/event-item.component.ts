import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { GlobalService, TicketService } from '@services';
import { EventVM } from '@view-models';
import swal from 'sweetalert2';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss']
})
export class EventItemComponent implements OnInit {
  @Input() event: EventVM;
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
      description: this.description  + `<br>Event name: ${this.event.name}`,
      type: 'deal',
    } as any).subscribe((data) => {
      swal.fire('Your support form have been send!', 'Thask for your attention! We will contact you soon!', 'success');
    });
  }
}

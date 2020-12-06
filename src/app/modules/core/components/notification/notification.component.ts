import { Component, Input, OnInit } from '@angular/core';
import { CustomerVM } from '@view-models';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @Input() customer: CustomerVM;
  constructor() { }

  ngOnInit() {
  }

}

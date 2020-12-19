import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService, GlobalService } from '@services';
import { EventVM } from '@view-models';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-event-main',
  templateUrl: './event-main.page.html',
  styleUrls: ['./event-main.page.scss']
})
export class EventMainPage implements OnInit {
  events: EventVM[] = [];
  search = '';
  stage = 'done';
  showSearch = false;
  constructor(
    protected readonly service: EventService,
    protected readonly globalService: GlobalService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly router: Router,
  ) {
  }

  ngOnInit() {
    this.useReload();
  }
  useReload = () => {
    this.useShowSpinner();
    this.service.findAll()
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe((data) => {
        this.events = data.filter((e) => !e.isDelete);
      });
  }
  useShowSpinner = () => {
    this.spinner.show('event-main');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('event-main');
    }, 1000);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GlobalService } from '@services';
import { CustomerVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input() customer: CustomerVM;
  constructor(
    protected readonly router: Router,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly globalService: GlobalService,
    protected readonly authService: AuthService,
    protected readonly deviceService: DeviceDetectorService,
  ) {
    activatedRoute.data.subscribe((data) => console.log(data));
  }

  ngOnInit() {
  }
  useOut = () => {
    localStorage.clear();
    this.router.navigate(['auth']);
  }
  useProfile = () => {
    this.globalService.triggerView$.next({ type: 'setting-profile', payload: {} });
  }
}

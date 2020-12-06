import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { AuthService, CommentService, GlobalService, ProductService, TicketService } from '@services';
import { CommentVM, ProductVM } from '@view-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Socket } from 'ngx-socket-io';
import { NgxSpinnerService } from 'ngx-spinner';
import { pluck, switchMap, tap, finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss']
})
export class ProductDetailPage implements OnInit {
  product: ProductVM;
  comments: CommentVM[] = [];
  description = '';
  oneStart = {
    percent: 0,
    quantity: 0,
  };
  twoStart = {
    percent: 0,
    quantity: 0,
  };
  threeStart = {
    percent: 0,
    quantity: 0,
  };
  fourStart = {
    percent: 0,
    quantity: 0,
  };
  fiveStart = {
    percent: 0,
    quantity: 0,
  };
  message = '';
  rate = 5;
  totalRating = 0;
  constructor(
    protected readonly productService: ProductService,
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly spinner: NgxSpinnerService,
    protected readonly globalService: GlobalService,
    protected readonly authService: AuthService,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly dialogService: NbDialogService,
    protected readonly ticketService: TicketService,
    protected readonly commentService: CommentService,
    protected readonly router: Router,
    protected readonly socket: Socket,
  ) { }

  ngOnInit() {
    this.useShowSpinner();
    this.activatedRoute.params.pipe(
      pluck('id'),
      switchMap((id) => this.productService.findById(id)),
      tap((data) => {
        this.product = data;
      }),
      switchMap((data) => this.commentService.findAll(data.id)),
      tap((data) => {
        this.comments = data.sort((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1);
        this.useSetStar();
        this.useSocket();
        this.useHideSpinner();
      }),
    ).subscribe();
  }
  useShowSpinner = () => {
    this.spinner.show('product-detail');
  }
  useHideSpinner = () => {
    setTimeout(() => {
      this.spinner.hide('product-detail');
    }, 1000);
  }
  useSocket = () => {
    this.socket.fromEvent('comment-product-' + this.product.id).subscribe((comment: CommentVM) => {
      this.comments.push(comment);
      this.comments = this.comments.sort((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1);
      this.useSetStar();
    });
  }
  useSendFeedback = (template: TemplateRef<any>) => {
    const message = this.message;
    const rating = this.rate;
    this.message = '';
    this.rate = 5;
    this.useShowSpinner();
    this.authService.auth({ id: localStorage.getItem('fcmToken'), ...this.deviceService.getDeviceInfo() } as any)
      .pipe(
        finalize(() => {
          this.useHideSpinner();
        })
      )
      .subscribe((data) => {
        this.commentService.insert({
          message,
          rating,
          product: { id: this.product.id },
          customer: { id: data.id }
        } as any).subscribe();
      }, (err) => {
        this.useDialog(template);
      });

  }
  useSetStar = () => {
    if (this.comments.length > 0) {
      this.oneStart = {
        percent: parseInt((this.comments.filter((e) => e.rating === 1).length * 100 / this.comments.length).toFixed(0), 0),
        quantity: this.comments.filter((e) => e.rating === 1).length
      };
      this.twoStart = {
        percent: parseInt((this.comments.filter((e) => e.rating === 2).length * 100 / this.comments.length).toFixed(0), 0),
        quantity: this.comments.filter((e) => e.rating === 2).length
      };
      this.threeStart = {
        percent: parseInt((this.comments.filter((e) => e.rating === 3).length * 100 / this.comments.length).toFixed(0), 0),
        quantity: this.comments.filter((e) => e.rating === 3).length
      };
      this.fourStart = {
        percent: parseInt((this.comments.filter((e) => e.rating === 4).length * 100 / this.comments.length).toFixed(0), 0),
        quantity: this.comments.filter((e) => e.rating === 4).length
      };
      this.fiveStart = {
        percent: parseInt((this.comments.filter((e) => e.rating === 5).length * 100 / this.comments.length).toFixed(0), 0),
        quantity: this.comments.filter((e) => e.rating === 5).length
      };
      const calculate = ((
        (1 * this.comments.filter((e) => e.rating === 1).length) +
        (2 * this.comments.filter((e) => e.rating === 2).length) +
        (3 * this.comments.filter((e) => e.rating === 3).length) +
        (4 * this.comments.filter((e) => e.rating === 4).length) +
        (5 * this.comments.filter((e) => e.rating === 5).length)
      ) / this.comments.length).toFixed(2);
      this.totalRating = parseInt(calculate, 0);
      this.formatRating = () => calculate;
    }
  }
  formatRating = () => '0';
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

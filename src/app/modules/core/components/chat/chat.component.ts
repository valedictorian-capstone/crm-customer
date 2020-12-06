import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { AuthService, ChatService, GlobalService, TicketService } from '@services';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnChanges {
  @Input() showChat: boolean;
  @ViewChild('ref') content: ElementRef;
  timer;
  isLogin = false;
  @Output() useClose: EventEmitter<any> = new EventEmitter<any>();
  chating = false;
  roomId = Array(36).fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
    .map((x) => x[Math.floor(Math.random() * x.length)]).join('');
  message = '';
  messages = of([]);
  description = '';
  first = false;
  constructor(
    protected readonly chatService: ChatService,
    protected readonly spinner: NgxSpinnerService,
    protected readonly authService: AuthService,
    protected readonly deviceService: DeviceDetectorService,
    protected readonly globalService: GlobalService,
    protected readonly dialogService: NbDialogService,
    protected readonly ticketService: TicketService,
    protected readonly router: Router,
  ) { }

  ngOnInit() {
    this.authService.auth({ id: localStorage.getItem('fcmToken'), ...this.deviceService.getDeviceInfo() } as any)
      .pipe(
        finalize(() => {
          this.messages = this.chatService.getAllMessages(this.roomId)
            .pipe(
              map(
                (messages) => messages.map((message) => message.payload.doc.data())
                  .map((message) => ({ ...message, custom: message.custom ? JSON.parse(message.custom) : undefined }))
                  .sort((a, b) => a.createdAt > b.createdAt ? 1 : -1)
              )
            );
        })
      )
      .subscribe((data) => {
        this.isLogin = true;
        if (localStorage.getItem('roomId') && localStorage.getItem('roomId') !== data.id) {
          this.chatService.getAllMessages(localStorage.getItem('roomId'))
            .subscribe(async (res) => {
              for (const item of res) {
                const doc = item.payload.doc;
                await this.chatService.addMessage(doc.data());
                await this.chatService.removeMessage(doc.id);
              }
            });
        }
        localStorage.setItem('roomId', data.id);
        this.roomId = data.id;
      }, (err) => {
        if (localStorage.getItem('roomId')) {
          this.roomId = localStorage.getItem('roomId');
        } else {
          localStorage.setItem('roomId', this.roomId);
        }
        console.log(localStorage.getItem('roomId'));
        console.log(this.roomId);
      });
  }

  async ngOnChanges() {
    if (this.showChat) {
      if (!this.first) {
        setTimeout(() => {
          this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
        }, 10);
        await this.chatService.addMessage({
          isBot: true,
          text: 'Hi! Have a good day sir! What can we support to you?',
          custom: null,
          roomId: this.roomId,
          createdAt: new Date(),
        });
      }
      this.first = true;
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    }
  }

  useSendMessage = async (ref: HTMLElement) => {
    const message = this.message;
    this.message = '';
    await this.chatService.addMessage({
      isBot: false,
      text: message,
      custom: null,
      roomId: this.roomId,
      createdAt: new Date(),
    });
    this.chating = true;
    this.spinner.show('chating');
    ref.scrollTop = ref.scrollHeight;
    await this.chatService.callBot({ sender: this.roomId, message }).subscribe(async (res) => {
      this.spinner.hide('chating');
      this.chating = false;
      ref.scrollTop = ref.scrollHeight;
      for (const item of res) {
        this.chating = true;
        this.spinner.show('chating');
        ref.scrollTop = ref.scrollHeight;
        await this.chatService.addMessage({
          isBot: true,
          text: item.text ? item.text : null,
          custom: item.custom ? item.custom : null,
          roomId: this.roomId,
          createdAt: new Date(),
        });
        this.spinner.hide('chating');
        this.chating = false;
        ref.scrollTop = ref.scrollHeight;
      }
    });
  }
  useEnter = (event, ref: HTMLElement) => {
    if (event.key === 'Enter') {
      this.useSendMessage(ref);
    }
  }
  useScroll = (ref: HTMLElement) => {
    ref.classList.add('scroll');
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      ref.classList.remove('scroll');
    }, 5000);
  }
  useContact = (templateGotoLogin: TemplateRef<any>, templateSupport: TemplateRef<any>) => {
    if (this.isLogin) {
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

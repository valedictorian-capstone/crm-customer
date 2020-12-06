import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { AuthService, CustomerService, TokenService } from '@services';
import { TokenVM } from '@view-models';
import * as firebase from 'firebase';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  formConfirm: FormGroup;
  formRegister: FormGroup;
  isConfirm = false;
  load = false;
  country_phone = environment.country_phone;
  dialCode = '+84';
  emailStage = 'done';
  notExist = false;
  windowRef: { recaptchaVerifier: firebase.auth.RecaptchaVerifier, confirmationResult: firebase.auth.ConfirmationResult };
  constructor(
    protected readonly router: Router,
    protected readonly angularAuth: AngularFireAuth,
    protected readonly authService: AuthService,
    protected readonly customerService: CustomerService,
    protected readonly tokenService: TokenService,
  ) {
    this.form = new FormGroup({
      phone: new FormControl('', [Validators.required, Validators.pattern(/^(\(\d{2,4}\)\s{0,1}\d{6,9})$|^\d{8,13}$|^\d{3,5}\s?\d{3}\s?\d{3,4}$|^[\d\(\)\s\-\/]{6,}$/)])
    });
    this.formRegister = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      fullname: new FormControl('', [Validators.required]),
    });
    this.formConfirm = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.windowRef = (window as any);
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      size: 'invisible'
    });
    this.windowRef.recaptchaVerifier.render();
  }
  getStatus = (name: 'phone' | 'code' | 'fullname' | 'email'): 'danger' | 'success' | 'default' => {
    const control = name === 'phone' ? this.form.get(name) : (name === 'code' ? this.formConfirm.get(name) : this.formRegister.get(name));
    return (control.touched || control.dirty) ? (control.invalid ? 'danger' : 'success') : 'default';
  }
  useSubmit = async () => {
    if (this.form.valid) {
      this.load = true;
      await this.angularAuth.auth.signInWithPhoneNumber(this.dialCode + this.form.value.phone, this.windowRef.recaptchaVerifier)
        .then((result) => {
          this.windowRef.confirmationResult = result;
          this.isConfirm = true;
        })
        .catch((err) => {
          if (err.error.message === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
            swal.fire('Error', 'Your have been trying many times! Please try later', 'error');
          } else {
            swal.fire('Error', 'Your phone not correct! Please try again', 'error');
          }
        });
      this.load = false;
    } else {
      this.form.get('phone').markAsTouched();
    }
  }
  useVerify = async () => {
    if (this.formConfirm.valid) {
      this.load = true;
      await this.windowRef.confirmationResult.confirm(this.formConfirm.value.code)
        .then(async (result) => {
          await this.authService.login({ ...this.form.value, ...this.formRegister.value }).subscribe((data) => {
            const notExist = (data as { notExist: boolean }).notExist;
            console.log(notExist);
            if (notExist) {
              this.notExist = notExist;
            } else {
              this.tokenService.setToken(data as TokenVM);
              this.router.navigate(['auth']);
            }
          });
        })
        .catch((err) => {
          swal.fire('Error', 'Invalid code! Please try again', 'error');
        });
      this.load = false;
    } else {
      this.formConfirm.get('code').markAsTouched();
    }
  }
  useRegister = async () => {
    if (this.formRegister.valid) {
      this.load = true;
      await this.authService.register({
        ...this.form.value,
        ...this.formRegister.value,
      })
        .pipe(
          finalize(() => {
            this.load = false;
          })
        )
        .subscribe((data) => {
        this.tokenService.setToken(data as TokenVM);
        this.router.navigate(['auth']);
      });
    } else {
      this.formConfirm.get('code').markAsTouched();
    }
  }
  useEnter = (event) => {
    if (event.key === 'Enter') {
      if (this.isConfirm) {
        if (this.notExist) {
          this.useRegister();
        } else {
          this.useVerify();
        }
      } else {
        this.useSubmit();
      }
    }
  }
  useCheckEmail = () => {
    this.emailStage = 'querying';
    setTimeout(async () => {
      const email = this.formRegister.get('email');
      const check = await this.customerService.checkUnique('email', email.value).toPromise();
      if (email.valid && check) {
        email.setErrors({ duplicate: true });
      }
      this.emailStage = 'done';
    }, 1000);
  }
  useBackHome = () => {
    this.router.navigate(['core']);
  }
}

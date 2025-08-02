import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import icPlay from '@iconify/icons-ic/twotone-play-circle-outline';
import faTwitter from '@iconify/icons-fa-brands/twitter';
import faInstagram from '@iconify/icons-fa-brands/instagram';
import faFacebook from '@iconify/icons-fa-brands/facebook-f';

// import { Logger, I18nService, AuthenticationService, untilDestroyed } from '@app/core';
import icHistory from '@iconify/icons-feather/plus-square';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { SplashScreenService } from 'src/@vex/services/splash-screen.service';
import { AuthenticationService, untilDestroyed, Logger } from 'src/app/core';
import { VideoModalComponent } from 'src/app/modals/videoModal/video-modal.component';
import { MatDialog } from '@angular/material/dialog';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeInUp400ms]
})
export class LoginComponent implements OnInit, OnDestroy {
  error = false;
  errorMsg = '';
  loginForm!: FormGroup;
  isLoading = false;

  inputType = 'password';
  visible = false;

  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;
  icPlay = icPlay;
  icHistory = icHistory;
  faTwitter = faTwitter;
  faInstagram = faInstagram;
  faFacebook = faFacebook;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private splashScreen: SplashScreenService,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.splashScreen.hide();
  }

  ngOnDestroy() {}

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';
    const login$ = this.authenticationService.login(this.loginForm.value);
    login$
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        credentials => {
          log.debug(`${credentials}`);
          log.debug(`successfully logged in`);
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/app/home'], { replaceUrl: true });
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.error = true;
          this.errorMsg = 'Email o contraseña incorrecta';
        }
      );
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }

  getErrorMessage() {
    return this.loginForm.controls.email.hasError('required')
      ? 'El correo electrónico es necesario para ingresar'
      : this.loginForm.controls.email.hasError('email')
      ? 'Correo inválido'
      : '';
  }

  getPassErrorMessage() {
    return this.loginForm.controls.password.hasError('required') ? 'Debes ingresar la contraseña' : '';
  }

  private createForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      remember: new FormControl(true, [])
    });
  }

  openVideoModal() {
    const dialogRef = this.dialog.open(VideoModalComponent, {
      width: '602px',
      height: '364px',
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IconModule } from '@visurel/iconify-angular';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    IconModule,
    LoginRoutingModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule {}

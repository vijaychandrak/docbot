import { Routes } from '@angular/router';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyFilesComponent } from './components/my-files/my-files.component';
import { BillingComponent } from './components/billing/billing.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'files',
    component: MyFilesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'doc-ai',
    component: FileUploadComponent,
    canActivate: [authGuard]
  },
  {
    path: 'billing',
    component: BillingComponent,
    canActivate: [authGuard]
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'doc-ai'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

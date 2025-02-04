import { Routes } from '@angular/router';
import { LoginComponent } from './modules/logreg/+login/login.component';
import { RegisterComponent } from './modules/logreg/register/register.component';
import { MenuComponent } from './modules/+menu/menu.component';
import { WeighInsComponent } from './modules/+weighins/weighins.component';
import { authGuard } from './auth.guard';
import { LandingComponent } from './modules/+landing/landing.component';
import { PlansComponent } from './modules/+plan/plans.component';
import { LogpageComponent } from './modules/+logpage/logpage.component';
import { LogRegistryComponent } from './modules/+log-registry/log-registry.component';
import { ForgotPasswordComponent } from './modules/logreg/+login/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './modules/logreg/+login/components/reset-password/reset-password.component';

export const routes: Routes = [
    {path: "", component: LandingComponent},
    {path: "login", component: LoginComponent},
    {path: "register", component: RegisterComponent},
    {path: "menu", component: MenuComponent, canActivate: [authGuard]},
    {path: "weighins", component: WeighInsComponent, canActivate: [authGuard]},
    {path: "plans", component: PlansComponent, canActivate: [authGuard]},
    { path: "logpage", component: LogpageComponent, canActivate: [authGuard] },
    { path: "log-registry", component: LogRegistryComponent, canActivate: [authGuard] },
    { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

];

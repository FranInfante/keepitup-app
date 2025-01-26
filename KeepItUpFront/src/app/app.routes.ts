import { Routes } from '@angular/router';
import { LoginComponent } from './modules/logreg/+login/login.component';
import { RegisterComponent } from './modules/logreg/register/register.component';
import { MenuComponent } from './modules/+menu/menu.component';
import { WeighInsComponent } from './modules/+weighins/weighins.component';
import { authGuard } from './auth.guard';
import { LandingComponent } from './modules/+landing/landing.component';
import { PlansComponent } from './modules/+plan/plans.component';
import { WorkoutsBasicComponent } from './modules/+workouts-basic-log/workoutsbasic.component';
import { LogpageComponent } from './modules/+logpage/logpage.component';
import { LogRegistryComponent } from './modules/+log-registry/log-registry.component';

export const routes: Routes = [
    {path: "", component: LandingComponent},
    {path: "login", component: LoginComponent},
    {path: "register", component: RegisterComponent},
    {path: "menu", component: MenuComponent, canActivate: [authGuard]},
    {path: "weighins", component: WeighInsComponent, canActivate: [authGuard]},
    {path: "workouts", component: WorkoutsBasicComponent, canActivate: [authGuard]},
    {path: "plans", component: PlansComponent},
    { path: "logpage", component: LogpageComponent },
    { path: "log-registry", component: LogRegistryComponent }

];

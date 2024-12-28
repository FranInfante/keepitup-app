import { Routes } from '@angular/router';
import { LoginComponent } from './modules/logreg/+login/login.component';
import { RegisterComponent } from './modules/logreg/register/register.component';
import { MenuComponent } from './modules/+menu/menu.component';
import { WeighInsComponent } from './modules/+weighins/weighins.component';
import { WorkoutsComponent } from './modules/+workouts/workouts.component';
import { authGuard } from './auth.guard';
import { LandingComponent } from './modules/+landing/landing.component';

export const routes: Routes = [
    {path: "", component: LandingComponent},
    {path: "login", component: LoginComponent},
    {path: "register", component: RegisterComponent},
    {path: "menu", component: MenuComponent, canActivate: [authGuard]},
    {path: "weighins", component: WeighInsComponent, canActivate: [authGuard]},
    {path: "workouts", component: WorkoutsComponent, canActivate: [authGuard]}
];

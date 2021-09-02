import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {AuthGuard} from "./shared/guard/auth.guard";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'scraper', canActivate: [AuthGuard], loadChildren: () => import('./scraper/scraper.module').then(m => m.ScraperModule)},
  {path: 'login', component: LoginComponent},
  {path: 'register', canActivate: [AuthGuard], component: RegisterComponent},
  {path: '**', redirectTo: 'home'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./SharedModule/presentation/containers/home/home.component";
import {LoginComponent} from "./SharedModule/presentation/containers/login/login.component";
import {RegisterComponent} from "./user/presentation/components/register/register.component";
import {AuthGuard} from "./SharedModule/core/guards/auth.guard";
import {UserListComponent} from "./user/presentation/components/user-list/user-list.component";
import {UserDetailComponent} from "./user/presentation/components/user-detail/user-detail.component";
import {InsoleRegistrationComponent} from "./insole-registration/insole-registration.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {
    path: 'data-collection',
    canActivate: [AuthGuard],
    loadChildren: () => import('./scraper/scraper.module').then(m => m.ScraperModule)
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', canActivate: [AuthGuard], component: RegisterComponent},
  {path: 'user-list', canActivate: [AuthGuard], component: UserListComponent},
  {path: 'user-detail/:id', canActivate: [AuthGuard], component: UserDetailComponent},
  {path: 'insole', canActivate: [AuthGuard],
    loadChildren: () => import('./insole-registration/insole-registration.module').then(m => m.InsoleRegistrationModule)},
  {path: '**', redirectTo: 'home'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

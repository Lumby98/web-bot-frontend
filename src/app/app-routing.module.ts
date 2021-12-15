import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./SharedModule/presentation/containers/home/home.component";
import {LoginComponent} from "./SharedModule/presentation/containers/login/login.component";
import {RegisterComponent} from "./user/presentation/containers/register/register.component";
import {AuthGuard} from "./SharedModule/core/guards/auth.guard";
import {UserListComponent} from "./user/presentation/containers/user-list/user-list.component";
import {UserDetailComponent} from "./user/presentation/containers/user-detail/user-detail.component";
import {SavedLoginsComponent} from "./SharedModule/presentation/containers/saved-logins/saved-logins.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {
    path: 'data-collection',
    canActivate: [AuthGuard],
    loadChildren: () => import('./scraper/scraper.module').then(m => m.ScraperModule)
  },
  {path: 'login', component: LoginComponent},
  {path: 'saved-logins', canActivate: [AuthGuard], component: SavedLoginsComponent},
  {path: 'register', canActivate: [AuthGuard], component: RegisterComponent},
  {path: 'user-list', canActivate: [AuthGuard], component: UserListComponent},
  {path: 'user-detail/:id', canActivate: [AuthGuard], component: UserDetailComponent},
  {path: 'insole', canActivate: [AuthGuard],
    loadChildren: () => import('./insole-registration/insole-registration.module').then(m => m.InsoleRegistrationModule)},
  {path: 'log', canActivate: [AuthGuard],
  loadChildren: () => import('./log/log.module').then(m => m.LogModule)},
  {path: 'order-registration', canActivate: [AuthGuard],
    loadChildren: () => import('./order-registration/order-registration.module').then(m => m.OrderRegistrationModule)},
  {path: '**', redirectTo: 'home'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

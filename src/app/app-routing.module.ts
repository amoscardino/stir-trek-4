import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SessionListComponent } from './session-list/session-list.component';
import { SessionDetailComponent } from './session-detail/session-detail.component';
import { SavedSessionListComponent } from './saved-session-list/saved-session-list.component';

const routes: Routes = [
    { path: '', redirectTo: '/sessions', pathMatch: 'full' },
    { path: 'sessions', component: SessionListComponent },
    { path: 'schedule', component: SavedSessionListComponent },
    { path: 'sessions/:id', component: SessionDetailComponent },
    { path: 'schedule/:id', component: SessionDetailComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

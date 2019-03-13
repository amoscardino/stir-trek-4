import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SessionListComponent } from './session-list/session-list.component';
import { SessionDetailComponent } from './session-detail/session-detail.component';

const routes: Routes = [
    { path: '', redirectTo: '/sessions', pathMatch: 'full' },
    { path: 'sessions', component: SessionListComponent },
    { path: 'sessions/:id', component: SessionDetailComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SessionListComponent } from './session-list/session-list.component';
import { SessionDetailComponent } from './session-detail/session-detail.component';
import { SavedSessionListComponent } from './saved-session-list/saved-session-list.component';
import { environment } from '../environments/environment';
import { TimeSlotFilterPipe } from './time-slot-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SessionListComponent,
    SessionDetailComponent,
    SavedSessionListComponent,
    TimeSlotFilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

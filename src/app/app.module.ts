import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FakeAPIService } from './_fake/fake-api.service';
import { environment } from 'src/environments/environment';
import { SplashScreenModule } from './_metronic/partials/layout/splash-screen/splash-screen.module';
import {TfeHttpInterceptor} from './tfe-http-interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SplashScreenModule,
    HttpClientModule,
/*    environment.isMockEnabled
        ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {passThruUnknownUrl: true, dataEncapsulation: false})
        : [],*/
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
  ],
  providers: [
    environment.isMockEnabled
      ? { provide: HTTP_INTERCEPTORS, useClass: TfeHttpInterceptor, multi: true }
      : []
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

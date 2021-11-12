import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HeaderComponent } from './layout/header/header.component'
import { FooterComponent } from './layout/footer/footer.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { ScrollTopComponent } from './layout/scroll-top/scroll-top.component'
import { SettingsComponent } from './layout/settings/settings.component'
import { BreadcrumbComponent } from './layout/breadcrumb/breadcrumb.component'
import { BackgroundComponent } from './layout/background/background.component';
import { ContactComponent } from './layout/footer/contact/contact.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ScrollTopComponent,
    SettingsComponent,
    BreadcrumbComponent,
    BackgroundComponent,
    ContactComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

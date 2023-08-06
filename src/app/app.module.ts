import { NgOptimizedImage } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { forwardRef, NgModule, Provider } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserModule, Title } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HttpMockInterceptor } from './commons/interceptors/http-mock.interceptor';
import { CardLittleComponent } from './components/card-little/card-little.component';
import { ClanWarComponent } from './components/clan-war/clan-war.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { IconComponent } from './components/icon/icon.component';
import { TankEquipmentDescriptionComponent } from './components/tanks-equipment/tank-equipment-description/tank-equipment-description.component';
import { TanksEquipmentComponent } from './components/tanks-equipment/tanks-equipment.component';

import { ClanDataPipe } from './pipes/clanRatings/clan-data.pipe';
import { FieldUrlPipe } from './pipes/field/url.pipe';
import { ImagePipe } from './pipes/image/image.pipe';
import { LinkTextPipe } from './pipes/information/link-text.pipe';
import { TextPipe } from './pipes/information/text.pipe';
import { UrlPipe } from './pipes/information/url.pipe';
import { FeatureFlippingPipe } from './pipes/inventory/feature-flipping.pipe';
import { PathPipe } from './pipes/inventory/path.pipe';
import { ReplacePipe } from './pipes/replace/replace.pipe';
import { SentenceCasePipe } from './pipes/sentenceCase/sentence-case.pipe';
import { DataPipe } from './pipes/tank/data.pipe';
import { HeaderPipe } from './pipes/wording/header.pipe';
import { HomePipe } from './pipes/wording/home.pipe';

const MOCK_INTERCEPTOR_PROVIDER: Provider = {
    provide: HTTP_INTERCEPTORS,
    useExisting: forwardRef(() => HttpMockInterceptor),
    multi: true,
};

let mockProviders = [HttpMockInterceptor, MOCK_INTERCEPTOR_PROVIDER];

if (environment.production) {
    mockProviders = [];
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        TanksEquipmentComponent,
        TankEquipmentDescriptionComponent,
        ClanWarComponent,
        HeaderComponent,
        CardLittleComponent,
        IconComponent,
        ImagePipe,
        HeaderPipe,
        ReplacePipe,
        FeatureFlippingPipe,
        PathPipe,
        HomePipe,
        TextPipe,
        UrlPipe,
        LinkTextPipe,
        DataPipe,
        FieldUrlPipe,
        ClanDataPipe,
        SentenceCasePipe,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatExpansionModule,
        MatCardModule,
        MatIconModule,
        HttpClientModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatSlideToggleModule,
        NgOptimizedImage,
        MatButtonModule,
    ],
    providers: [...mockProviders, Title, CookieService],
    bootstrap: [AppComponent],
})
export class AppModule {}

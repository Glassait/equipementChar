import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { HeaderInterface } from 'src/app/commons/interfaces/header.interface';
import { MemberInterface } from 'src/app/commons/interfaces/member.interface';
import { ModeInterface } from 'src/app/commons/interfaces/mode.interface';
import { InventoryService } from 'src/app/commons/services/inventory.service';
import { WordingService } from 'src/app/commons/services/wording.service';
import { HeaderStore } from 'src/app/commons/stores/header.store';
import { MemberStore } from 'src/app/commons/stores/member.store';
import { ModeStore } from 'src/app/commons/stores/mode.store';
import { SvgCustom } from 'src/app/commons/utils/svg-custom.util';
import { ColorEnum } from '../../commons/enums/color.enum';
import { FeatureInterface } from '../../commons/interfaces/feature.interface';
import { FeatureStore } from '../../commons/stores/feature.store';
import { UnsubscribeComponent } from '../commons/unsubscribe.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
})
export class HeaderComponent extends UnsubscribeComponent implements OnInit, AfterViewInit {
    @ViewChild('darkModeSwitch', { read: ElementRef }) element: ElementRef | undefined;

    protected showHome: boolean;
    protected showTank: boolean;
    protected showWar: boolean;
    protected isVisitor: boolean;
    protected isDark: boolean;

    protected featureFlipping: FeatureInterface;

    constructor(
        protected modeStore: ModeStore,
        protected memberStore: MemberStore,
        protected wording: WordingService,
        protected inventory: InventoryService,
        private headerStore: HeaderStore,
        private featureStore: FeatureStore
    ) {
        super();
    }

    ngOnInit(): void {
        this.createSubscribe();
    }

    ngAfterViewInit(): void {
        if (this.element) {
            const svgOn = this.element.nativeElement.querySelector('.mdc-switch__icon--on');
            svgOn.setAttribute('viewBox', '-2 -2 60 60');

            const svgSun = svgOn.firstChild;
            svgSun.setAttribute('d', SvgCustom.sun);
            svgSun.setAttribute('stroke', '#050505');
            svgSun.setAttribute('stroke-width', 2);
            svgSun.setAttribute('stroke-linecap', 'round');
            svgSun.setAttribute('stroke-linejoin', 'round');
            svgSun.setAttribute('fill', 'none');

            const svgOff = this.element.nativeElement.querySelector('.mdc-switch__icon--off');
            svgOff.setAttribute('viewBox', '-2 -2 60 60');

            const svgMoon = svgOff.firstChild;
            svgMoon.setAttribute('d', SvgCustom.moon);
            svgMoon.setAttribute('stroke', '#FBFBFB');
            svgMoon.setAttribute('stroke-width', 2);
            svgMoon.setAttribute('stroke-linecap', 'round');
            svgMoon.setAttribute('stroke-linejoin', 'round');
            svgMoon.setAttribute('fill', 'none');
        }
    }

    protected changeMode($event: MatSlideToggleChange): void {
        if ($event.checked) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
            this.modeStore.set('color', ColorEnum.DARK);
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
            this.modeStore.set('color', ColorEnum.LIGHT);
        }
    }

    private createSubscribe(): void {
        this.addSubscription(
            this.headerStore.watch().subscribe((headerInterface: HeaderInterface): void => {
                this.showHome = headerInterface.showHome;
                this.showTank = headerInterface.showTank;
                this.showWar = headerInterface.showWar;
            })
        );

        this.addSubscription(
            this.memberStore.watch().subscribe((memberInterface: MemberInterface): void => {
                this.isVisitor = memberInterface.isVisitor;
            })
        );

        this.addSubscription(
            this.modeStore.watch().subscribe((modeInterface: ModeInterface): void => {
                this.isDark = modeInterface.color === ColorEnum.DARK;
            })
        );

        this.addSubscription(
            this.featureStore.watch().subscribe((featureInterface: FeatureInterface): void => {
                this.featureFlipping = featureInterface;
            })
        );
    }
}

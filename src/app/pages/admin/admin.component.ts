import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MemberService } from '../../commons/abstract/member.service';
import { ModeService } from '../../commons/abstract/mode.service';
import { WordingService } from '../../commons/services/wording.service';
import { HeaderStore } from '../../commons/stores/header.store';
import { SentenceCasePipe } from '../../pipes/sentence-case.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { defaultHttpType, DefaultHttpType } from '../../commons/types/default-httpType';
import { ModeEnum } from '../../commons/enums/modeEnum';
import { ButtonTypeEnum } from '../../components/button/enums/button-type.enum';
import { ButtonThemeEnum } from '../../components/button/enums/button-theme.enum';
import { FormControl, FormGroup } from '@angular/forms';
import { ClanReserveType } from './types/clan-reserve.type';
import { ClanReserveEnum } from './enums/clan-reserve.enum';
import { SelectOptionType } from '../../components/select/types/select-option.type';
import moment from 'moment';
import { map, share, takeWhile, timer } from 'rxjs';
import { InventoryService } from '../../commons/services/inventory.service';
import { ClanReserveData, ClanReservesResponse, Reserve, StrongholdService } from '../../../generated-api/stronghold';
import { MembersService } from '../../../generated-api/members';
import { IconColorEnum } from '../../components/icon/enums/icon-enum';
import { FeaturesStore } from '../../commons/stores/features.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FeatureDto } from '../../../generated-api/features';
import { FeaturesApi } from '../../commons/apis/features.api';
import { snackBarDuration } from '../../commons/variables.global';

@Component({
    selector: 'app-home',
    templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
    //region PROTECTED FIELD
    /**
     * Show loading button on click on update bdd card action
     * @protected
     */
    protected updateBddLoading: boolean = false;
    protected clanReservesFormGroup: FormGroup = new FormGroup({});
    protected clanReserves: DefaultHttpType & { reserves?: ClanReserveType[] } = { ...defaultHttpType };
    protected features: { keys?: string[]; value?: FeatureDto } = {};
    //endregion

    //region ENUM
    protected readonly ModeEnum = ModeEnum;
    protected readonly ButtonTypeEnum = ButtonTypeEnum;
    protected readonly ButtonThemeEnum = ButtonThemeEnum;
    protected readonly IconColorEnum = IconColorEnum;

    //endregion

    constructor(
        // STORE
        private readonly headerStore: HeaderStore,
        private readonly featuresStore: FeaturesStore,
        // SERVICE
        private readonly wording: WordingService,
        private readonly inventory: InventoryService,
        protected readonly member: MemberService,
        protected readonly mode: ModeService,
        // ANGULAR
        private readonly router: Router,
        private readonly title: Title,
        private readonly snackBar: MatSnackBar,
        // PIPE
        private readonly sentenceCasePipe: SentenceCasePipe,
        // OPEN API
        private readonly membersService: MembersService,
        private readonly strongholdService: StrongholdService,
        // API
        protected readonly featuresApi: FeaturesApi
    ) {
        this.featuresStore
            .watch()
            .pipe(takeUntilDestroyed())
            .subscribe((dto: FeatureDto): void => {
                this.features.keys = Object.keys(dto);
                this.features.value = dto;
            });
    }

    /**
     * Implementation of the {@link OnInit} interface
     */
    ngOnInit(): void {
        if (!this.member.isAdmin || this.member.isVisitor) {
            this.router.navigate(['/']).then((): void => {});
        }

        this.title.setTitle(this.sentenceCasePipe.transform(this.wording.header.admin));

        this.headerStore.patch({
            showHome: true,
            showWar: true,
            showTank: true,
            showAdmin: false,
        });

        this.getClanReserves();
    }

    /**
     * Action callback fot the update button
     */
    protected actualiseBdd = (): void => {
        this.updateBddLoading = true;
        this.membersService.updateMembers(this.member.accessToken).subscribe({
            next: (_value: any): void => {},
            error: (err: any): void => {
                console.error(err);
                this.snackBar.open('Une erreur est survenue lors de la mise à jour de la base de données', '', {
                    duration: snackBarDuration,
                });
            },
            complete: (): void => {
                setTimeout((): void => {
                    this.updateBddLoading = false;
                }, 10000);
                this.snackBar.open('La base de données a bien été mise à jour', '', { duration: snackBarDuration });
            },
        });
    };

    protected activateReserve(event: MouseEvent, type: string): void {
        event.preventDefault();
        const level: string = this.clanReservesFormGroup.controls[type].value;
        const clanReserve: ClanReserveType | undefined = this.clanReserves.reserves?.find(
            (clanReserves: ClanReserveType): boolean => clanReserves.type === type
        );

        if (!clanReserve) {
            this.snackBar.open('Erreur lors de la recherche de la réserve', '', { duration: snackBarDuration });
            return;
        }

        const option = clanReserve.options.find((option: SelectOptionType): boolean => option.value === level);

        if (!option) {
            this.snackBar.open("Erreur lors de la recherche de l'option", '', { duration: snackBarDuration });
            return;
        }

        this.strongholdService
            .activateReserve(this.inventory.applicationId, this.member.accessToken, level, clanReserve.type, 'fr')
            .subscribe({
                next: (value: any): void => {
                    if (value.status === 'error') {
                        this.snackBar.open('La reserve ne doit plus existé, merci de recharger la page', '', {
                            duration: snackBarDuration,
                        });
                    } else {
                        this.snackBar.open('La réserve a bien été activée', '', { duration: snackBarDuration });
                        this.createTimer(clanReserve, option.metadata);
                        this.checkActivatedReserves();
                    }
                },
                error: (err: any): void => {
                    console.error(err);
                    this.snackBar.open("Une erreur est survenue lors de l'activation de la reserve, merci de réessayer plus tard", '', {
                        duration: snackBarDuration,
                    });
                },
            });
    }

    /**
     * Get all the clan reserves with the wot api
     * @private
     */
    private getClanReserves(): void {
        this.strongholdService.clanReserves(this.inventory.applicationId, this.member.accessToken, 'fr').subscribe({
            next: (response: ClanReservesResponse): void => {
                if (response.status === 'error') {
                    this.clanReserves.isError = true;
                    this.clanReserves.isLoading = false;
                    return;
                }

                response.data
                    .filter((clanReserve: ClanReserveData) => !clanReserve.disposable)
                    .forEach((clanReserve: ClanReserveData): void => {
                        this.clanReservesFormGroup.addControl(clanReserve.type, new FormControl());

                        if (!this.clanReserves.reserves) {
                            this.clanReserves.reserves = [];
                        }

                        const clanReserves: ClanReserveType = {
                            name: clanReserve.name,
                            type: clanReserve.type,
                            bonus_type: clanReserve.bonus_type,
                            options: [],
                            link_to: ClanReserveEnum[clanReserve.type as keyof typeof ClanReserveEnum],
                        };

                        clanReserve.in_stock.forEach((reserve: Reserve): void => {
                            if (reserve.active_till) {
                                clanReserves.active_till = new Date((reserve.active_till ?? 0) * 1000);
                                this.createTimer(clanReserves, reserve);
                            }

                            clanReserves.options.push({
                                value: String(reserve.level),
                                label: String(reserve.level),
                                metadata: reserve,
                            });
                        });

                        this.clanReserves.reserves.push(clanReserves);
                    });
                this.checkActivatedReserves();
            },
            error: (err: any): void => {
                console.error(err);
                this.clanReserves.isLoading = false;
                this.clanReserves.isError = true;
            },
            complete: (): void => {
                if (this.clanReserves.isError) {
                    return;
                }

                console.log(this.clanReserves);
                this.clanReserves.isLoading = false;
            },
        });
    }

    /**
     * Checks the bond reserves
     * @private
     */
    private checkActivatedReserves(): void {
        this.clanReserves.reserves?.forEach((clanReserves: ClanReserveType): void => {
            const linked = this.clanReserves.reserves?.find((value: ClanReserveType): boolean => value.type === clanReserves.link_to);

            if (linked?.active_till) {
                clanReserves.active_till = linked.active_till;
                clanReserves.duration = linked.duration;
                clanReserves.clock = linked.clock;
            }
        });
    }

    /**
     * Create the timer when the reserve is activated or has been activated
     * @param clanReserve The clan reserve
     * @param reserve The in stock reserve
     * @private
     */
    private createTimer(clanReserve: ClanReserveType, reserve: Reserve): void {
        const target = new Date();
        target.setHours(target.getHours() + reserve.action_time / 3600);
        let linked = this.clanReserves.reserves?.find((value: ClanReserveType): boolean => value.type === clanReserve.link_to);

        clanReserve.active_till = clanReserve.active_till ?? target;
        clanReserve.duration = reserve.action_time;
        timer(0, 1000)
            .pipe(
                map(() => new Date()),
                share(),
                takeWhile((date: Date): boolean => {
                    if (!linked) {
                        linked = this.clanReserves.reserves?.find((value: ClanReserveType): boolean => value.type === clanReserve.link_to);
                    }

                    const duration = moment.duration(moment(clanReserve.active_till).diff(date));
                    if (duration.seconds() <= 0 && duration.minutes() <= 0 && duration.hours() <= 0) {
                        clanReserve.duration = undefined;
                        clanReserve.active_till = undefined;
                        clanReserve.clock = undefined;
                        reserve.amount--;

                        if (linked) {
                            linked.active_till = undefined;
                            linked.duration = undefined;
                            linked.clock = undefined;
                        }
                    }
                    return !(duration.seconds() < 0 && duration.minutes() < 0 && duration.hours() < 0);
                })
            )
            .subscribe((date: Date): void => {
                clanReserve.clock = moment.duration(moment(clanReserve.active_till).diff(date));
                if (linked) {
                    linked.clock = clanReserve.clock;
                }
            });
    }
}

import { Component, Input, numberAttribute } from '@angular/core';
import { NgxSkeletonLoaderConfigTheme } from 'ngx-skeleton-loader/lib/ngx-skeleton-loader-config.types';
import { ModeEnum } from '../../commons/enums/modeEnum';
import { AnimationEnum } from './enums/animation.enum';
import { AppearanceEnum } from './enums/appearance.enum';
import { ThemeModel } from './models/theme.model';

/**
 * This component use the npm library for create skeleton loading.
 * @example <glassait-skeleton-loading [animation]="AnimationEnum.PULSE" [color]="ColorEnum.DARK"></glassait-skeleton-loading>
 * @see https://www.npmjs.com/package/ngx-skeleton-loader#setup
 */
@Component({
    selector: 'glassait-skeleton-loading',
    templateUrl: './skeleton-loading.component.html',
})
export class SkeletonLoadingComponent {
    //region INPUT
    /**
     * The number of element wanted.
     * @example <glassait-skeleton-loading count="2"></glassait-skeleton-loading>
     * @default 1
     * @implements numberAttribute
     */
    @Input({ transform: numberAttribute }) count: number = 1;
    /**
     * The type of animation wanted. (progress by default)
     * @example <glassait-skeleton-loading [animation]="AnimationEnum.PULSE"></glassait-skeleton-loading>
     * @default AnimationEnum.PROGRESS
     * @enum AnimationEnum
     * @see AnimationEnum
     */
    @Input() animation: AnimationEnum = AnimationEnum.PROGRESS;
    /**
     * The color of the skeleton loading.
     * @example <glassait-skeleton-loading [color]="ColorEnum.DARK"></glassait-skeleton-loading>
     * @enum ModeEnum
     * @see ModeEnum
     */
    @Input({ required: true }) color: ModeEnum;
    /**
     * The width of the skeleton loading.
     * @example <glassait-skeleton-loading width="2rem"></glassait-skeleton-loading>
     * @default 2.5rem
     */
    @Input() width: string = '2.5rem';
    /**
     * The height of the skeleton loading.
     * @example <glassait-skeleton-loading height="2rem"></glassait-skeleton-loading>
     * @default 2.5rem
     */
    @Input() height: string = '2.5rem';
    //endregion

    //region PROTECTED FIELD
    /**
     * The traduction of the different appearance in ngx appearance
     * @protected
     */
    protected ngxAppearance: 'circle' | 'line';
    /**
     * The theme of the skeleton loading
     * @see ThemeModel
     * @protected
     */
    protected ngxTheme: NgxSkeletonLoaderConfigTheme;
    //endregion

    constructor(private themeModel: ThemeModel) {}

    //region INPUT OVERRIDE
    /**
     * The appearance of skeleton loading wanted.
     * @see AppearanceEnum
     */
    private _appearance: AppearanceEnum;

    /**
     * @see _appearance
     */
    @Input({ required: true })
    get appearance(): AppearanceEnum {
        return this._appearance;
    }

    set appearance(appearance: AppearanceEnum) {
        this._appearance = appearance;
        this.setNgx();
    }
    //endregion

    /**
     * Set the {@link ngxAppearance} and the {@link ngxTheme} from the input {@link _appearance}
     * @see ThemeModel
     * @private
     */
    private setNgx(): void {
        switch (this._appearance) {
            case AppearanceEnum.CIRCLE:
                this.ngxAppearance = 'circle';
                break;
            case AppearanceEnum.LINE:
                this.ngxAppearance = 'line';
                break;
            case AppearanceEnum.FAT_LINE:
                this.ngxAppearance = 'line';
                break;
            case AppearanceEnum.RECTANGLE_SEMI:
                this.ngxAppearance = 'line';
                break;
            case AppearanceEnum.RECTANGLE_NORMAL:
                this.ngxAppearance = 'line';
                break;
        }

        this.ngxTheme = this.themeModel.constructTheme(this._appearance, this.color, this.width, this.height);
    }
}

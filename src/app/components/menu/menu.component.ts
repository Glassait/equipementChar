import { booleanAttribute, Component, Input, OnInit } from '@angular/core';
import { MatMenuModule, MenuPositionX, MenuPositionY } from '@angular/material/menu';
import { ModeEnum } from '../../commons/enums/modeEnum';
import { ButtonThemeEnum } from '../button/enums/button-theme.enum';
import { ButtonTypeEnum } from '../button/enums/button-type.enum';
import { MenuItemType } from './types/menu-item.type';
import { ButtonComponent } from '../button/button.component';
import { UpperCasePipe } from '@angular/common';

@Component({
    standalone: true,
    selector: 'glassait-menu',
    templateUrl: './menu.component.html',
    imports: [ButtonComponent, MatMenuModule, UpperCasePipe],
})
export class MenuComponent implements OnInit {
    //region INPUT
    /**
     * The text of the menu button
     * @example <glassait-menu textMenu="Text menu" [theme]="ModeEnum.DARK" [menuItems]="menuItems"></glassait-menu>
     */
    @Input({ required: true }) textMenu: string;
    /**
     * All the items of the menu
     * @example <glassait-menu textMenu="Text menu" [theme]="ModeEnum.DARK" [menuItems]="menuItems"></glassait-menu>
     */
    @Input({ required: true }) menuItems: MenuItemType[];
    /**
     * Disabled the menu
     */
    @Input({ transform: booleanAttribute }) disabled: boolean;
    /**
     * The vertical position of the item list
     * @example <glassait-menu textMenu="Text menu" [theme]="ModeEnum.DARK" [menuItems]="menuItems" yPosition="above"></glassait-menu>
     * @default 'below'
     */
    @Input() yPosition: MenuPositionY = 'below';
    /**
     * The horizontal position of the item list
     * @example <glassait-menu textMenu="Text menu" [theme]="ModeEnum.DARK" [menuItems]="menuItems" xPosition="before"></glassait-menu>
     * @default 'after'
     */
    @Input() xPosition: MenuPositionX = 'after';
    /**
     * The position of the menu item
     * @example <glassait-menu textMenu="Text menu" [theme]="ModeEnum.DARK" [menuItems]="menuItems" alignItem="END"></glassait-menu>
     * @default 'START'
     */
    @Input() alignItem: 'START' | 'END' = 'START';
    //endregion

    //region PROTECTED FIELD
    /**
     * The theme of the button
     * @protected
     */
    protected buttonTheme: ButtonThemeEnum;
    //endregion

    //region ENUM
    protected readonly ButtonTypeEnum = ButtonTypeEnum;
    //endregion

    //region PRIVATE FIELD
    /**
     * The theme of the menu button
     * @example <glassait-menu textMenu="Text menu" [theme]="ModeEnum.DARK" [menuItems]="menuItems"></glassait-menu>
     */
    private _theme: ModeEnum;
    //endregion

    //region INPUT OVERRIDE
    /**
     * @see _theme
     */
    @Input({ required: true })
    get theme(): ModeEnum {
        return this._theme;
    }

    set theme(value: ModeEnum) {
        this._theme = value;
        this.buttonTheme = ButtonThemeEnum[value];
    }

    //endregion

    ngOnInit(): void {
        if (this.disabled) {
            this.buttonTheme = this._theme === ModeEnum.DARK ? ButtonThemeEnum.DARK_DISABLED : ButtonThemeEnum.LIGHT_DISABLED;
        }
    }
}

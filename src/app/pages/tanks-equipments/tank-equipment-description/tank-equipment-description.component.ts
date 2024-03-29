import { Component, Input } from '@angular/core';
import { IconColorEnum } from 'src/app/components/icon/enums/icon-enum';
import { ModeEnum } from '../../../commons/enums/modeEnum';
import { ButtonSizeEnum } from '../../../components/button/enums/button-size.enum';
import { ButtonThemeEnum } from '../../../components/button/enums/button-theme.enum';
import { TankDto } from '../../../../generated-api/tanks';

@Component({
    selector: 'app-tank-equipment-description',
    templateUrl: './tank-equipment-description.component.html',
})
export class TankEquipmentDescriptionComponent {
    //region INPUT
    /**
     * The data of the tank
     */
    @Input() data: TankDto;
    /**
     * The settings of the user (light or dark mode)
     */
    @Input() mode: ModeEnum;
    /**
     * The size of the screen of the mobile
     */
    @Input() isMobile: boolean;
    //endregion

    //region ENUM
    protected readonly IconColorEnum = IconColorEnum;
    protected readonly ModeEnum = ModeEnum;
    protected readonly ButtonSizeEnum = ButtonSizeEnum;
    protected readonly ButtonThemeEnum = ButtonThemeEnum;

    //endregion

    protected openLink(url: string): void {
        window.open(url, '_blank');
    }
}

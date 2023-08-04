import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
    FieldComposant,
    TankData,
} from 'src/app/commons/types/tanks-data.type';

@Component({
    selector: 'app-tank-equipment-description',
    templateUrl: './tank-equipment-description.component.html',
})
export class TankEquipmentDescriptionComponent {
    @Input() tankData: TankData;
}

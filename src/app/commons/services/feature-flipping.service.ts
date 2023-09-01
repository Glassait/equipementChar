import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InventoryService } from './inventory.service';

@Injectable({
    providedIn: 'root',
})
export class FeatureFlippingService {
    constructor(
        private httpClient: HttpClient,
        private inventoryClass: InventoryService
    ) {}

    public queryFeature(): Observable<any> {
        return this.httpClient.get(
            this.inventoryClass.getLchpApi().liveUrl +
                this.inventoryClass.getLchpApi().feature
        );
    }
}
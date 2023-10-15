import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InventoryService } from './inventory.service';

@Injectable({
    providedIn: 'root',
})
export class WotService {
    constructor(
        private httpClient: HttpClient,
        private inventoryClass: InventoryService
    ) {}

    getServeurStatus(): Observable<any> {
        return this.httpClient.get(this.inventoryClass.getWargamingApi()['game-servers']);
    }
}

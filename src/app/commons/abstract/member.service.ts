import { Injectable } from '@angular/core';
import { MemberInterface } from '../interfaces/member.interface';
import { MemberStore } from '../stores/member.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Injectable service that provides information about the currently authenticated user.
 */
@Injectable({
    providedIn: 'root',
})
export class MemberService {
    /**
     * Define if the user is an administrator or not
     */
    public isAdmin: boolean;
    /**
     * Define if the user is a visitor or not (i.e. not connected or not a member of the clan)
     */
    public isVisitor: boolean;
    /**
     * The Wargaming access token of the user, get from the login
     */
    public accessToken: string;

    constructor(private memberStore: MemberStore) {
        this.isAdmin = this.memberStore.get('isAdmin');
        const token = this.memberStore.get('token');
        this.accessToken = token && token.status !== 'error' ? token.access_token : '';
        this.isVisitor = this.memberStore.get('isVisitor');

        this.watchMemberStore();
    }

    /**
     * Watches the member store for changes and updates the service properties accordingly.
     */
    private watchMemberStore(): void {
        this.memberStore
            .watch()
            .pipe(takeUntilDestroyed())
            .subscribe((value: MemberInterface): void => {
                this.isVisitor = value.isVisitor;
                this.isAdmin = value.isAdmin;
                this.accessToken = value.token && value.token.status !== 'error' ? value.token.access_token : '';
            });
    }
}

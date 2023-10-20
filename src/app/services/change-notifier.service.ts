import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChangeNotifierService {
    private changesQueue$$ = new Subject<{ [ key: string ]: string }>();

    onNewChange$ = this.changesQueue$$.asObservable();

    constructor() { }
    notifyForChange(data: { [ key: string ]: string }) {
        this.changesQueue$$.next(data);
    }

    clear(): void {
        this.changesQueue$$.next(undefined);
    }

}

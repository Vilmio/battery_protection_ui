import { Component, OnDestroy, OnInit, PLATFORM_ID, Inject  } from '@angular/core';
import {NgForOf, isPlatformBrowser} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DataService} from "../services/data.service";
import { Subscription, timer, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-head',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './head.component.html',
  styleUrl: './head.component.css'
})

export class HeadComponent implements OnInit, OnDestroy{
  public connectionStatus: string = ' Disconnected'
  public availablePorts: string[] = ['Port1', 'Port2', 'Port3'];
  public selectedPort?: string = 'Port2';
  private subscription?: Subscription;

  constructor(private dataService: DataService, @Inject(PLATFORM_ID) private platformId: Object) {}

   ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.subscription = timer(0, 1000).pipe(
        switchMap(() => this.dataService.getPorts()),
        catchError(error => {
          console.error('Chyba při získávání portů:', error);
          return of([]); // Vrátí prázdné pole jako bezpečný výstup, pokud dojde k chybě
        })
      ).subscribe(ports => {
        console.log(ports);
      });
      }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

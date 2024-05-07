import { Component, OnDestroy, OnInit, PLATFORM_ID, Inject  } from '@angular/core';
import {NgForOf, isPlatformBrowser} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DataService} from "../services/data.service";
import { forkJoin, Subscription, timer, of } from 'rxjs';
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
  public connectionStatus: string = '-,-'
  public availablePorts: string[] = [];
  private subscription?: Subscription;

  constructor(private dataService: DataService, @Inject(PLATFORM_ID) private platformId: Object) {}

   ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.subscription = timer(0, 1000).pipe(
          switchMap(() =>
            forkJoin({
              ports: this.dataService.getPorts(),
              update: this.dataService.updateData()
            })
          ),
          catchError(error => {
            console.error('Chyba při získávání portů:', error);
            return of({ ports: [], update: null });
          })
        ).subscribe(({ ports, update }) => {
          this.availablePorts = ports
          console.log(update);
          this.connectionStatus = update.connection_status;
        });
      }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

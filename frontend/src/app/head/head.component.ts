import { Component, OnDestroy, OnInit } from '@angular/core';
import {HttpRequestService} from "../services/http-request.service";

import { Subscription } from 'rxjs';

/*
interface Ports {
  [index: number]: string| any;
}*/

@Component({
  selector: 'app-head',
  standalone: true,
  imports: [],
  templateUrl: './head.component.html',
  styleUrl: './head.component.css'
})

export class HeadComponent {
  //private portsSubscription!: Subscription; // Pro uložení odběru
  public connectionStatus: string = ' Disconnected'
  //public availablePorts: Ports =  ['USBO']

  constructor(private httpRequestService: HttpRequestService) {
    //this.portsSubscription = this.httpRequestService.getPorts().subscribe(data => this.processData(data))
      //this.availablePorts = data; // Předpokládá se, že odpověď je pole portů
      // Zde můžete provést další zpracování odpovědi

  }


  processData(data: any) {
    console.log(data)
  }

}

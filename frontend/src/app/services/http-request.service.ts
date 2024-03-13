import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import {Observable, timer, of, Subject} from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import {Row} from "./table-service.service";

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  constructor(private http: HttpClientModule) {}

  getPorts(){
    console.log("Get ports")
  }
}

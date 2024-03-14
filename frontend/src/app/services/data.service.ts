import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getPorts(): Observable<any> {
    return this.http.get('/getPorts').pipe(
      catchError(error => {
        console.error('/getPorts error:', error);
        return of([]);
    }))
  }
  updateData(): Observable<any> {
    return this.http.get('/updateData').pipe(
      catchError(error => {
        console.error('/updateData error:', error);
        return of([]);
    }))
  }
}

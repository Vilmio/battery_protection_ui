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
      console.error('Chyba při získávání portů:', error);
      return of([]);
    }))
  }
}

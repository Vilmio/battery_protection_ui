import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
<<<<<<< HEAD
import {forkJoin, Observable, of, timer, BehaviorSubject, Subject} from 'rxjs';
import {catchError, switchMap, retry} from 'rxjs/operators';


interface SensorData {
  id: number;
  pollution: number;
  temperature: number;
  humidity: number;
  warning: number;
  error: number;
}
=======
import { Observable, timer, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
>>>>>>> 1662c18a844211f37b81936701e1dfa7b2b61af7

@Injectable({
  providedIn: 'root'
})
<<<<<<< HEAD


export class DataService {
  public numberOfSensors: number = 24;
  public connectionStatus: string = '-,-'
  public selectedPort: string = ''
  public availablePorts: string[] = [];
  public data: SensorData[] = [];



  constructor(private http: HttpClient) {
    this.initDataUpdates();
    if(typeof window !== 'undefined'){
      let storedValue = Number(window.localStorage.getItem('numberOfSensors') || 24)
      if (storedValue !== null) {
        this.numberOfSensors = storedValue
      }
    }
    for (let i = 1; i <= this.numberOfSensors; i++) {
      this.data.push({
        id: i,
        pollution: 0,
        temperature: 0,
        humidity: 0,
        warning: 0,
        error: 0
      })
    }
  }

  initDataUpdates() {
    timer(0, 1000).pipe(
      switchMap(() => {
        return forkJoin({
          ports: this.getPorts(),
          data: this.updateData()
        });
      }),
      catchError(error => {
        console.error('Error during data update:', error);
        return of({ports: [], data: []});
      })
    ).subscribe(results => {
      this.availablePorts = results.ports;
      this.selectedPort = this.availablePorts[0]
      this.connectionStatus = results.data.connection_status;

    });
  }

  setPort() {
    const urlWithTimestamp = `/setPort?timestamp=${Date.now()}`;
    const body = { port: this.selectedPort };
    this.http.post(urlWithTimestamp, body).pipe(
      catchError(error => {
        console.error('Error during setting port:', error);
        return of(null);
      })).subscribe(result => {
        console.log('OK');
    });
  }


  getPorts(): Observable<any> {
    const urlWithTimestamp = `/getPorts?timestamp=${Date.now()}`;
    return this.http.get(urlWithTimestamp).pipe(
=======
export class DataService {

  constructor(private http: HttpClient) { }

  getPorts(): Observable<any> {
    return this.http.get('/getPorts').pipe(
>>>>>>> 1662c18a844211f37b81936701e1dfa7b2b61af7
      catchError(error => {
        console.error('/getPorts error:', error);
        return of([]);
    }))
  }
  updateData(): Observable<any> {
<<<<<<< HEAD
    const urlWithTimestamp = `/updateData?timestamp=${Date.now()}`;
    return this.http.get(urlWithTimestamp).pipe(
=======
    return this.http.get('/updateData').pipe(
>>>>>>> 1662c18a844211f37b81936701e1dfa7b2b61af7
      catchError(error => {
        console.error('/updateData error:', error);
        return of([]);
    }))
  }
<<<<<<< HEAD


  btnPlus(){
    if(this.numberOfSensors < 24){
      this.numberOfSensors += 1
      this.data.push({ id: this.data.length+1, pollution: 0, temperature: 0, humidity: 0, warning: 0, error: 0 });
      localStorage.setItem('numberOfSensors', String(this.numberOfSensors))
    }
  }
  btnMinus(){
    if(this.numberOfSensors > 1){
      this.numberOfSensors -= 1
      this.data.pop();
      localStorage.setItem('numberOfSensors', String(this.numberOfSensors))
    }
  }
=======
>>>>>>> 1662c18a844211f37b81936701e1dfa7b2b61af7
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {forkJoin, Observable, of, timer, Subject, Subscription} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';


interface SensorData {
  id: number;
  pollution: number;
  temperature: number;
  humidity: number;
  offset_flash: number;
  offset_run: number;
  warning: number;
  error: number;
}


@Injectable({
  providedIn: 'root'
})

export class DataService {
  public numberOfSensors: number = 1;
  public connectionStatus: string = '-,-'
  public selectedPort: string = ''
  public availablePorts: string[] = [];
  public data: SensorData[] = [];
  private dataUpdateSubscription!: Subscription;

  private updateChart = new Subject<any>();
  updateChart$ = this.updateChart.asObservable();

  constructor(private http: HttpClient) {
    for (let i = 1; i <= this.numberOfSensors; i++) {
      this.data.push({
        id: i,
        pollution: 0,
        temperature: 0,
        humidity: 0,
        offset_flash: 0,
        offset_run: 0,
        warning: 0,
        error: 0
      })
    }
  }

  initDataUpdates() {
    this.dataUpdateSubscription = timer(0, 1000).pipe(
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
      this.numberOfSensors = results.data.number_of_sensors
      this.data = []
      for(let i in results.data.sensor_values){
        this.data[Number(i)-1] =results.data.sensor_values[i]
      }
      this.updateChart.next(0);
    });
  }

  stopDataUpdates() {
    if (this.dataUpdateSubscription) {
      this.dataUpdateSubscription.unsubscribe();
    }
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

  setNumberOfSensors() {
    const urlWithTimestamp = `/setNumberOfSensors?timestamp=${Date.now()}`;
    const body = { number_of_sensors: this.numberOfSensors };
    this.http.post(urlWithTimestamp, body).pipe(
        catchError(error => {
          console.error('Error during setting number of sensors:', error);
          return of(null);
        })).subscribe(result => {
      console.log('OK');
    });
  }

  getPorts(): Observable<any> {
    const urlWithTimestamp = `/getPorts?timestamp=${Date.now()}`;
    return this.http.get(urlWithTimestamp).pipe(
      catchError(error => {
        console.error('/getPorts error:', error);
        return of([]);
    }))
  }

  getLogs(): Observable<any> {
    const urlWithTimestamp = `/getLogs?timestamp=${Date.now()}`;
    return this.http.get(urlWithTimestamp).pipe(
        catchError(error => {
          console.error('/getLogs error:', error);
          return of([]);
        }))
  }

  getTest(): Observable<any> {
    const urlWithTimestamp = `/getTest?timestamp=${Date.now()}`;
    return this.http.get(urlWithTimestamp).pipe(
        catchError(error => {
          console.error('/getTest error:', error);
          return of([]);
        }))
  }

  updateData(): Observable<any> {
    const urlWithTimestamp = `/updateData?timestamp=${Date.now()}`;
    return this.http.get(urlWithTimestamp).pipe(
      catchError(error => {
        console.error('/updateData error:', error);
        return of([]);
    }))
  }

  btnPlus(){
    if(this.numberOfSensors < 24){
      this.numberOfSensors += 1
      this.setNumberOfSensors()
    }
  }

  btnMinus(){
    if(this.numberOfSensors > 1){
      this.numberOfSensors -= 1
      this.setNumberOfSensors()
    }
  }
}

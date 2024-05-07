import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Row{
  position?: number | string;
  lane?: string;
  teamNumber: number;
  country: string;
  teamName: string;
  lap?: number;
}

export interface Record{
  lane: string;
  time: number | string;
}

@Injectable({
  providedIn: 'root'
})
export class TableService{

  private addRowSource = new Subject<Row>();
  private addTimeSource = new Subject<Record>();
  private bestTimeSource = new Subject<number|string>()

  addRow$ = this.addRowSource.asObservable();
  addTime$ = this.addTimeSource.asObservable();
  updateBestTime$ = this.bestTimeSource.asObservable();

  addRow(row: Row) {
    this.addRowSource.next(row);
  }

  addTime(record: Record){
    this.addTimeSource.next(record)
  }

  updateBestTime(time: number| string){
    this.bestTimeSource.next(time)
  }

  sortPosition(row: Row[]): Row[]{
    // @ts-ignore
    row.sort((a, b) => parseFloat(a.lap) - parseFloat(b.lap));
    row.forEach((row, index) => {
      row.position = index + 1;
    });
    return row
  }

  getBestTime(row1: Row[], row2: Row[]): number| string{
      let validLaps1 = row1.map(row => row.lap).filter(lap => lap !== undefined) as number[];
      let bestLap1 = Math.min(...validLaps1);
      let validLaps2 = row2.map(row => row.lap).filter(lap => lap !== undefined) as number[];
      let bestLap2 = Math.min(...validLaps2);
      let bestTime: number = (bestLap1<bestLap2) ? bestLap1 : bestLap2
      return isFinite(bestTime) ? bestTime : '';
  }

  saveDataToCache(lane: string, row: Row[]){
    localStorage.setItem(lane, JSON.stringify(row));
  }
}

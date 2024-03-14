import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Record, Row, TableService} from "../services/table-service.service";


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})

export class TableComponent implements OnDestroy{
  private subscription: Subscription;
  private lane1TeamNumber: number = 0
  private lane2TeamNumber: number = 0
  private lane1TeamName: string = ''
  private lane2TeamName: string = ''
  public rowsLane1: Row[] = []
  public rowsLane2: Row[] = []
  public currentLap1: number | string = ''
  public currentLap2: number | string = ''

  constructor(private tableService: TableService) {
    this.subscription = this.tableService.addRow$.subscribe(row => this.addRow(row))
    this.subscription.add(this.tableService.addTime$.subscribe(time => this.addTime(time)))

    if(typeof window !== 'undefined'){
      this.rowsLane1 = JSON.parse(window.localStorage.getItem('lane1') || '[]')
      this.rowsLane2 = JSON.parse(window.localStorage.getItem('lane2') || '[]')
      let bestTime: string | number = this.tableService.getBestTime(this.rowsLane1, this.rowsLane2)
      this.tableService.updateBestTime(bestTime)
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addRow(row: Row) {
    if(row.lane == '1'){
      this.rowsLane1.push({ position: '-', teamNumber: row.teamNumber, country: row.country, teamName: row.teamName, lap: undefined });
      if (this.rowsLane1.length > 1) {
        if(this.rowsLane1[this.rowsLane1.length - 2].lap === undefined){
          this.rowsLane1.splice(this.rowsLane1.length - 2, 1);
        }
      }
    }else if(row.lane == '2'){
      this.rowsLane2.push({ position: '-', teamNumber: row.teamNumber, country: row.country, teamName: row.teamName, lap: undefined });
      if (this.rowsLane2.length > 1) {
        if(this.rowsLane2[this.rowsLane2.length - 2].lap === undefined){
          this.rowsLane2.splice(this.rowsLane2.length - 2, 1);
        }
      }
    }
  }

  removeRow(lane: string, index: number) {
    if (lane == '1') {
      this.rowsLane1.splice(index, 1);
      this.rowsLane1 = this.tableService.sortPosition(this.rowsLane1)
      this.tableService.saveDataToCache('lane1', this.rowsLane1)
    } else if (lane == '2') {
      this.rowsLane2.splice(index, 1);
      this.rowsLane2 = this.tableService.sortPosition(this.rowsLane2)
      this.tableService.saveDataToCache('lane2', this.rowsLane2)
    }

    let bestTime: string | number = this.tableService.getBestTime(this.rowsLane1, this.rowsLane2)
    this.tableService.updateBestTime(bestTime)
  }


  addTime(record: Record) {
    if(record.lane == '1'){
      if (this.rowsLane1.length > 0) {
        if(this.rowsLane1[this.rowsLane1.length - 1].lap === undefined) {
          // @ts-ignore
          this.rowsLane1[this.rowsLane1.length - 1].lap = record.time;
          this.lane1TeamNumber = this.rowsLane1[this.rowsLane1.length - 1].teamNumber
          this.lane1TeamName = this.rowsLane1[this.rowsLane1.length - 1].teamName
          this.rowsLane1 = this.tableService.sortPosition(this.rowsLane1)
          this.tableService.saveDataToCache('lane1', this.rowsLane1)
        }else{
          let index = this.rowsLane1.findIndex(row => ((row.teamNumber === this.lane1TeamNumber) && (row.teamName === this.lane1TeamName)));
          // @ts-ignore
          if(parseFloat(this.rowsLane1[index].lap) > parseFloat(record.time)) {
            // @ts-ignore
            this.rowsLane1[index].lap = record.time;
            this.rowsLane1 = this.tableService.sortPosition(this.rowsLane1)
            this.tableService.saveDataToCache('lane1', this.rowsLane1)
          }
        }
        this.currentLap1 = ' '+record.time+' s'
      }
    }else if(record.lane == '2'){
      if (this.rowsLane2.length > 0) {
        if(this.rowsLane2[this.rowsLane2.length - 1].lap === undefined) {
          // @ts-ignore
          this.rowsLane2[this.rowsLane2.length - 1].lap = record.time;
          this.lane2TeamNumber = this.rowsLane2[this.rowsLane2.length - 1].teamNumber
          this.lane2TeamName = this.rowsLane2[this.rowsLane2.length - 1].teamName
          this.rowsLane2 = this.tableService.sortPosition(this.rowsLane2)
          this.tableService.saveDataToCache('lane2', this.rowsLane2)
        }else{
          let index = this.rowsLane2.findIndex(row => ((row.teamNumber === this.lane2TeamNumber) && (row.teamName === this.lane2TeamName)));
          // @ts-ignore
          if(parseFloat(this.rowsLane2[index].lap) > parseFloat(record.time)) {
            // @ts-ignore
            this.rowsLane2[index].lap = record.time;
            this.rowsLane2 = this.tableService.sortPosition(this.rowsLane2)
            this.tableService.saveDataToCache('lane2', this.rowsLane2)
          }
        }
        this.currentLap2 = ' '+record.time+' s'
      }
    }

    let bestTime: string | number = this.tableService.getBestTime(this.rowsLane1, this.rowsLane2)
    this.tableService.updateBestTime(bestTime)
  }
}

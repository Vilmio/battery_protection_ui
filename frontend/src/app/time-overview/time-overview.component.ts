import {Component} from '@angular/core';
import {TableComponent} from "../table/table.component";
import {Record, Row, TableService} from "../services/table-service.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-time-overview',
  standalone: true,
  imports: [
    TableComponent
  ],
  templateUrl: './time-overview.component.html',
  styleUrl: './time-overview.component.css'
})
export class TimeOverviewComponent {
  public bestTime: number|string = '-,-'
  private subscription: Subscription;

  constructor(private tableService: TableService) {
    this.subscription = this.tableService.updateBestTime$.subscribe(time => this.updateBestTime(time))
  }

  saveData(lane:string ,teamNumber: number, country: string, teamName: string): void {
    let row: Row ={
      lane: lane,
      teamNumber: teamNumber,
      country: country,
      teamName: teamName,
    }
    this.tableService.addRow(row);
  }

  simulate():void{
    let record: Record = {
      lane: '1',
      time: (Math.random() * 20 + 1).toFixed(2)
    }
    this.tableService.addTime(record)
  }
    simulate2():void{
    let record: Record = {
      lane: '2',
      time: (Math.random() * 20 + 1).toFixed(2)
    }
    this.tableService.addTime(record)
  }

  clearCache(lane:string){
    localStorage.removeItem(lane);
  }

  updateBestTime(bestTime: number | string){
    this.bestTime = bestTime
  }

  protected readonly parseInt = parseInt;
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataService} from "../../services/data.service";
import { Chart, registerables } from 'chart.js';
import {Subscription} from "rxjs";
Chart.register(...registerables);
import { MatDialog } from '@angular/material/dialog';
import { StatusDialogComponent} from "../status-dialog/status-dialog.component";

const E_NOT_CALIBRATED = 1 << 0;
const E_CALIBRATION_FAILED = 1 << 1;
const E_NOT_PREHEATED = 1 << 2;
const E_HEATER = 1 << 3;
const E_TEMP = 1 << 4;
const E_HUM = 1 << 5;

const statusMap: { [key: number]: string } = {
  [E_NOT_CALIBRATED]: "Not Calibrated",
  [E_CALIBRATION_FAILED]: "Calibration Failed",
  [E_NOT_PREHEATED]: "Not Preheated",
  [E_HEATER]: "Heater Issue",
  [E_TEMP]: "Temperature Issue",
  [E_HUM]: "Humidity Issue"
};

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})


export class TableComponent implements OnInit, OnDestroy{

  private chart: any;
  private data = {
    labels: [],
    datasets: []
  };
  private subscription!: Subscription;

  constructor(public dataService: DataService, public dialog: MatDialog) {
    this.subscription = this.dataService.updateChart$.subscribe(
        () => {
          this.clearChartSetting()
        }
    )
  }

  ngOnInit() {
    this.dataService.initDataUpdates()
    this.initializeChart();
    this.setDataSet()
    setInterval(() => {
      this.updateChartData();
    }, 1000);
  }

  ngOnDestroy() {
    this.dataService.stopDataUpdates();
  }

  updateChartData() {
    if(this.dataService.data.length > 0){
      const now = new Date();
      const newLabel = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
      this.addData(this.chart, newLabel, this.dataService.data);
    }
  }

  initializeChart() {

    this.chart = new Chart('chartCanvas', {
      type: 'line',
      data: this.data,
      options: {
        scales: {
          x: {
            grid: {
             color: 'rgba(0, 59, 92, 0.1)'
            },
            ticks: {
              color: '#004181'
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 59, 92, 0.1)'
            },
            ticks: {
              color: '#004181'
            }
          }
        }
      }
    });
  }

  setDataSet(){
    this.data.datasets = [];
    for (let i = 1; i <= this.dataService.data.length; i++) {
      // @ts-ignore
      this.data.datasets.push({label: '#' + i, data: [],  borderColor: this.generateRandomHexColor(), fill: true});
    }
  }

  addData(chart:any, label:any, data:any) {
    chart.data.labels.push(label);
    for (let i = 0; i < chart.data.datasets.length; i++) {
      if (chart.data.labels.length >= 1200) {
        chart.data.labels.shift();
      }
      chart.data.datasets[i].data.push(data[i].pollution);
    }
    chart.update();
  }

  clearChartSetting() {
    if(this.dataService.numberOfSensors !== this.chart.data.datasets.length) {
      this.chart.data.labels = [];
      this.chart.data.datasets.forEach((dataset: { data: never[]; }) => {
        dataset.data = [];
      });
      this.chart.update();
      this.setDataSet()
    }
  }

  generateRandomHexColor() {
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += Math.floor(Math.random() * 16).toString(16);
    }
    return color;
  }

  getStatusText(state: number): string{
    let tableRegStatus: string = ""
    switch(state){
      case 1:
        tableRegStatus = "0"
        break
      case 2:
        tableRegStatus = "1"
        break
      case 3:
        tableRegStatus = "0,1"
        break
      case 4:
        tableRegStatus = "2"
        break
      case 5:
        tableRegStatus = "0,2"
        break
      case 6:
        tableRegStatus = "0,1,2"
        break
      case 7:
        tableRegStatus = "3"
        break
      case 8:
        tableRegStatus = "0,3"
        break
      case 9:
        tableRegStatus = "1,3"
        break
      case 10:
        tableRegStatus = "0,1,3"
        break
      case 11:
        tableRegStatus = "2,3"
        break
      case 12:
        tableRegStatus = "0,2,3"
        break
      case 13:
        tableRegStatus = "1,2,3"
        break
      case 14:
        tableRegStatus = "0,1,2,3"
        break

      default:
        break;
    }
    return tableRegStatus;
  }

  getStatusTextTranslation(state: number): string[] {
    let tableRegStatus: string[] = [];
    for (const [bit, text] of Object.entries(statusMap)) {
      if (state & parseInt(bit)) {
        tableRegStatus.push(text);
      }
    }
    return tableRegStatus;
  }

  openStatusDialog(state: number): void {
    const statusText = this.getStatusTextTranslation(state);
    this.dialog.open(StatusDialogComponent, {
      data: { statusText }
    });
  }
}


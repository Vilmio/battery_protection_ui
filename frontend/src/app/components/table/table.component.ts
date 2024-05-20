import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataService} from "../../services/data.service";
import { Chart, registerables } from 'chart.js';
import {Subscription} from "rxjs";
Chart.register(...registerables);


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

  constructor(public dataService: DataService) {
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
}


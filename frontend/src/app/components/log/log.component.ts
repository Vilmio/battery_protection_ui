import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {DataService} from "../../services/data.service";
import {Chart} from "chart.js";

@Component({
  selector: 'app-log',
  standalone: true,
    imports: [
        NgForOf,
        NgIf
    ],
  templateUrl: './log.component.html',
  styleUrl: './log.component.css'
})

export class LogComponent {
    public dataLog: any = {};
    public tableData: any[][] = [];
    public errorMsg: string = "";
    public warningMsg: string = "";
    private chart: any;
    public isLoading: boolean = false;
    public isTableReady: boolean = false;
    public readingStatus: string = "";

    private data = {
        labels: [],
        datasets: []
    };

  constructor(public dataService: DataService) {}

  readLogsBefore(){
    this.showLoader();
    this.isTableReady= false
    this.readingStatus = ""
    this.destroyChart()
    this.tableData = []
    this.dataLog = []
    this.dataService.getLogs().subscribe({
        next: data => {
            console.log(data)
            if(data.hasOwnProperty('exception')){
                this.readingStatus = "Error: " + data.exception;
            }else{
                this.dataLog = this.removeKeys(data);
                this.processData();
                this.generateChart();
                this.isTableReady= true
                this.hideLoader();
            }
        },
        error: error => {
            console.error('Error loading logs:', error);
            this.hideLoader();
        },
        complete: () => {
            console.log('Log reading complete');
            this.hideLoader();
        }
    });
  }

    readLogsAfter(){
        this.showLoader();
        this.isTableReady= false
        this.readingStatus = ""
        this.destroyChart()
        this.tableData = []
        this.dataLog = []
        this.dataService.getLogsAfter().subscribe({
            next: data => {
                console.log(data)
                if(data.hasOwnProperty('exception')){
                    this.readingStatus = "Error: " + data.exception;
                }else{
                    this.dataLog = this.removeKeys(data);
                    this.processData();
                    this.generateChart();
                    this.isTableReady= true
                    this.hideLoader();
                }
            },
            error: error => {
                console.error('Error loading logs:', error);
                this.hideLoader();
            },
            complete: () => {
                console.log('Log reading complete');
                this.hideLoader();
            }
        });
    }

  processData(): void {
        const dataEntries = Object.entries(this.dataLog);
        let row: any[] = [];
        dataEntries.forEach(([key, value], index) => {
            if(key.includes('h2') || key.includes('temp') || key.includes('hum')) {
                if(value === 255){
                    value = 'NA'
                }
                row.push({ key, value });
                if ((index + 1) % 10 === 0 || index === dataEntries.length - 1) {
                    this.tableData.push(row);
                    row = [];
                }
            }
        });
    }

    removeKeys(obj: any) {
        const keysToRemove = ["error", "warning", "reserve1", "reserve2"];
        for (const key in obj) {
            if (keysToRemove.some(prefix => key.startsWith(prefix))) {
                if(key === "error"){
                    this.errorMsg = obj[key];
                }else if(key === "warning"){
                    this.warningMsg = obj[key];
                }
                delete obj[key];
            }
        }
        return obj;
    }

    generateChart(){
        this.initializeChart()
        this.setDataSet()
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
        this.data.labels = [];

        for (let i  of ['Hum [%]','Temp [°C]', 'POLLUTION [%]']) {
            // @ts-ignore
            this.data.datasets.push({label: i, data: [],  borderColor: this.generateRandomHexColor(), fill: true});
        }
        let temp: any = 0;
        let hum: any = 0;
        let val: any = 0;
        let j: number = 0;
        for(let i = 0; i < this.tableData.length; i++) {
            for (const key in this.tableData[i]) {
                if(this.tableData[i][key].value !== 'NA'){
                    j++
                    if (this.tableData[i][key].key.includes('temp')) {
                        temp = this.tableData[i][key].value
                        continue
                    } else if (this.tableData[i][key].key.includes('hum')) {
                        hum = this.tableData[i][key].value
                        continue
                    } else {
                        val = this.tableData[i][key].value
                    }
                    this.chart.data.datasets[0].data.push(hum);
                    this.chart.data.datasets[1].data.push(temp);
                    this.chart.data.datasets[2].data.push(val);
                    this.chart.data.labels.push(j);
                }
            }
        }
        this.chart.update();
    }

    destroyChart(): void {
        if (this.chart) {
            this.chart.destroy();
            this.chart = undefined;
        }
    }


    generateRandomHexColor() {
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += Math.floor(Math.random() * 16).toString(16);
        }
        return color;
    }

    showLoader() {
        console.log('Log component loaded');
        this.isLoading = true;
    }

    hideLoader() {
        this.isLoading = false;
    }
}

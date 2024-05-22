import { Component } from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-tests',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.css'
})

export class TestsComponent {
  public testData: any;
  public isLoading: boolean = false;
  public isTableReady: boolean = false;
  public readingStatus: string = "";

  constructor(public dataService: DataService) {}

  makeTest(){
    this.showLoader()
    this.isTableReady= false
    this.readingStatus = ""
    this.dataService.getTest().subscribe({
      next: data => {
        if(data.hasOwnProperty('exception')){
          this.readingStatus = "Error: " + data.exception;
        }else{
          this.testData = Object.entries(data);
          this.isTableReady= true
        }
        this.hideLoader();
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
  showLoader() {
    this.isLoading = true;
  }

  hideLoader() {
    this.isLoading = false;
  }
}

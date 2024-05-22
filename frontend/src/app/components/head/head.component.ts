import { Component} from '@angular/core';
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {DataService} from "../../services/data.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-head',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './head.component.html',
  styleUrl: './head.component.css'
})

export class HeadComponent{

  constructor(public dataService: DataService, private router: Router) {}

  onPortChange(){
    this.dataService.setPort()
  }
  reloadPage() {
    this.router.navigate(['/']);

  }
}

import {Component} from '@angular/core';
import {TableComponent} from "../table/table.component";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    TableComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})


export class NavBarComponent {

  constructor() {

  }
}


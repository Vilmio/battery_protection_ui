import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeadComponent } from "./components/head/head.component";
import { TableComponent } from "./components/table/table.component";
import {BsModalService, ModalModule} from "ngx-bootstrap/modal";
import {NavBarComponent} from "./components/nav-bar/nav-bar.component";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeadComponent, TableComponent, ModalModule, NavBarComponent],
  providers: [BsModalService],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'Vilmio';
}

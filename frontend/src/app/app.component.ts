import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
<<<<<<< HEAD
import { HeadComponent } from "./components/head/head.component";
import { TableComponent } from "./components/table/table.component";
import {BsModalService, ModalModule} from "ngx-bootstrap/modal";
import {NavBarComponent} from "./components/nav-bar/nav-bar.component";
import { routes } from './app.routes';
import { RouterModule } from '@angular/router';
import {FooterComponent} from "./components/footer/footer.component";
=======
import { HeadComponent } from "./head/head.component";
import { TimeOverviewComponent } from "./time-overview/time-overview.component";
import { TableComponent } from "./table/table.component";
>>>>>>> 1662c18a844211f37b81936701e1dfa7b2b61af7


@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterOutlet, HeadComponent, TableComponent, ModalModule, NavBarComponent, FooterComponent],
  providers: [BsModalService],
=======
  imports: [RouterOutlet, HeadComponent, TimeOverviewComponent, TableComponent],
>>>>>>> 1662c18a844211f37b81936701e1dfa7b2b61af7
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
<<<<<<< HEAD
  title = 'Vilmio';
=======
  title = 'Horizon educational';
>>>>>>> 1662c18a844211f37b81936701e1dfa7b2b61af7
}

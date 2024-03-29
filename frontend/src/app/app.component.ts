import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeadComponent } from "./head/head.component";
import { TimeOverviewComponent } from "./time-overview/time-overview.component";
import { TableComponent } from "./table/table.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeadComponent, TimeOverviewComponent, TableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'Horizon educational';
}

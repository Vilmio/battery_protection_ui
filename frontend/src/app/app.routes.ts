import { Routes } from '@angular/router';
import {TableComponent} from "./components/table/table.component";
import {LogComponent} from "./components/log/log.component";
import {TestsComponent} from "./components/tests/tests.component";

export const routes: Routes = [
  { path: 'overview', component: TableComponent },
  { path: 'log', component: LogComponent },
  { path: 'tests', component: TestsComponent },
  { path: '', redirectTo: '/overview', pathMatch: 'full' }, // Výchozí cesta
];


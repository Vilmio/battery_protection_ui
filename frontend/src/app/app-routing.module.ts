// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './components/table/table.component';
import { TestsComponent} from "./components/tests/tests.component";
import { LogComponent} from "./components/log/log.component";


const routes: Routes = [
  { path: 'overview', component: TableComponent },
  { path: 'log', component: LogComponent },
  { path: 'tests', component: TestsComponent },
  { path: '', redirectTo: '/overview', pathMatch: 'full' }, // Výchozí cesta
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

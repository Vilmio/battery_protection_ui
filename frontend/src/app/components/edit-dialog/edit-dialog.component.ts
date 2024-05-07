import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Row, TableService} from "../../services/table-service.service";

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.css'
})

export class EditDialogComponent{
  @Input() teamNumber: number | null = null;
  @Input() country: string = '';
  @Input() teamName: string = '';
  @Input() index: number = 0;
  @Input() lane: string = '';
  constructor(public tableService: TableService) {}


  getRowData(): Row {
    return {
      teamNumber: this.teamNumber,
      country: this.country,
      teamName: this.teamName,
    }
  }
}


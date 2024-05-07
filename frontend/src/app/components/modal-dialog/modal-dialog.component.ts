import {Component, Input} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Row, TableService} from "../../services/table-service.service";

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './modal-dialog.component.html',
  styleUrl: './modal-dialog.component.css'
})
export class ModalDialogComponent {
  @Input() id: string = "";
  @Input() title: string = "";
  @Input() lane: string = "";

  teamNumber: number | null = null;
  country: string = '';
  teamName: string = '';

  constructor(private tableService: TableService) {}

  closeModal(): void {
    this.resetForm()
  }

  saveData(): void {
    let row: Row ={
      lane: this.lane,
      teamNumber: this.teamNumber,
      country: this.country,
      teamName: this.teamName,
    }
    this.tableService.addRow(row);
    this.resetForm()
  }

  resetForm() {
    this.teamNumber = null
    this.country = ''
    this.teamName = ''
  }
}

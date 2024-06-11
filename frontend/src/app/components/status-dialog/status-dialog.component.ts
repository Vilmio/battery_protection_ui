import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent} from '@angular/material/dialog';
import {NgForOf} from "@angular/common";


@Component({
  selector: 'app-status-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    NgForOf
  ],
  templateUrl: './status-dialog.component.html',
  styleUrl: './status-dialog.component.css'
})
export class StatusDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { statusText: string }) {}
}

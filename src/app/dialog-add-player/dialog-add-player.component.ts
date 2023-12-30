import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dialog-add-player',
  standalone: true,
  imports: [ MatDialogModule, FormsModule, MatInputModule , MatButtonModule ],
  templateUrl: './dialog-add-player.component.html',
  styleUrl: './dialog-add-player.component.scss'
})
export class DialogAddPlayerComponent implements OnInit {
name: string = '';

constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>) {}
ngOnInit(): void {
  
}

onNoClick(): void {
  this.dialogRef.close();
}
}

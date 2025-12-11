import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon [style.color]="data.isDestructive ? '#dc2626' : '#0f172a'">
        {{ data.isDestructive ? 'warning' : 'help_outline' }}
      </mat-icon>
      {{ data.title || 'Confirmar ação' }}
    </h2>
    
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        {{ data.cancelText || 'Cancelar' }}
      </button>
      <button 
        mat-raised-button 
        [color]="data.isDestructive ? 'warn' : 'primary'"
        (click)="onConfirm()"
      >
        {{ data.confirmText || 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    mat-dialog-content {
      padding: 20px 0;
    }

    mat-dialog-actions {
      padding-top: 16px;
      gap: 8px;
    }

    button[mat-button] {
      background: #e5e7eb;
      color: #0f172a;
      padding: 6px 18px;
      border-radius: 8px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
      text-transform: none;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }

    button[mat-button]:hover {
      background: #d1d5db;
    }

    button[mat-raised-button] {
      background: #0f172a;
      color: white;
      padding: 6px 18px;
      border-radius: 8px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
      text-transform: none;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }

    button[mat-raised-button]:hover {
      background: #1e293b;
    }

    button[mat-raised-button][color="warn"] {
      background: #dc2626;
    }

    button[mat-raised-button][color="warn"]:hover {
      background: #b91c1c;
    }

    button mat-icon {
      font-size: 18px;
    }
  `]
})
export class ConfirmDialog {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialog>);
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface QuestionData {
  mode: 'create' | 'edit';
  title?: string;
  content?: string;
  categories?: string[];
}

@Component({
  selector: 'app-topic-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatChipsModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './topic-dialog.html',
  styleUrls: ['./topic-dialog.css'],
})
export class TopicDialog {

  private dialogRef = inject(MatDialogRef<TopicDialog>);
  protected data = inject<QuestionData>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  maxCategories = 5;

  categoryInput = signal('');
  categoryList = signal<string[]>(this.data.categories ?? []);

  form = this.fb.nonNullable.group({
    title: [this.data.title ?? '', [Validators.required, Validators.minLength(4)]],
    content: [this.data.content ?? '', [Validators.required, Validators.minLength(10)]],
  });

  addCategory() {
    const value = this.categoryInput().trim();
    if (!value) return;
    if (this.categoryList().length >= this.maxCategories) {
      this.showSnackBar('Maximum categories reached.');
      return;
    }
    if (this.categoryList().includes(value)) {
      this.showSnackBar('Category already exists.');
      return;
    }

    this.categoryList.update(categories => [...categories, value]);
    this.categoryInput.set('');
    this.showSnackBar('Category added successfully.');
  }

  removeCategory(category: string) {
    this.categoryList.update(categories => categories.filter(c => c !== category));
    this.showSnackBar('Category removed successfully.');
  }

  save() {
    if (this.form.invalid) {
      this.showSnackBar('Please fill in all required fields.');
      return;
    }

    if (this.data.mode === 'create') {
      this.dialogRef.close({
        mode: 'create',
        title: this.form.controls.title.value,
        content: this.form.controls.content.value,
        categories: this.categoryList(),
      });
      this.showSnackBar('Topic created successfully.');
      return;
    }

    this.dialogRef.close({
      mode: 'edit',
      title: this.form.controls.title.value,
      content: this.form.controls.content.value,
    });
    this.showSnackBar('Topic updated successfully.');
  }

  cancel() {
    this.dialogRef.close(null);
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}

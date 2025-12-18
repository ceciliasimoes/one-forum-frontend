
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
      this.showSnackBar('Máximo de categorias atingido.');
      return;
    }
    if (this.categoryList().includes(value)) {
      this.showSnackBar('Categoria já existe.');
      return;
    }

    this.categoryList.update(categories => [...categories, value]);
    this.categoryInput.set('');
    this.showSnackBar('Categoria adicionada com sucesso.');
  }

  removeCategory(category: string) {
    this.categoryList.update(categories => categories.filter(c => c !== category));
    this.showSnackBar('Categoria removida com sucesso.');
  }

  save() {
    const titleControl = this.form.controls.title;
    const contentControl = this.form.controls.content;

    if (titleControl.hasError('required')) {
      this.showSnackBar('O título é obrigatório.');
      return;
    }
    if (titleControl.hasError('minlength')) {
      this.showSnackBar('O título deve ter pelo menos 4 caracteres.');
      return;
    }
    if (contentControl.hasError('required')) {
      this.showSnackBar('A descrição é obrigatória.');
      return;
    }
    if (contentControl.hasError('minlength')) {
      this.showSnackBar('A descrição deve ter pelo menos 10 caracteres.');
      return;
    }

    if (this.data.mode === 'create') {
      if (this.categoryList().length === 0) {
        this.showSnackBar('Adicione pelo menos uma categoria.');
        return;
      }
      
      this.dialogRef.close({
        mode: 'create',
        title: this.form.controls.title.value,
        content: this.form.controls.content.value,
        categories: this.categoryList(),
      });
      this.showSnackBar('Tópico criado com sucesso.');
      return;
    }

    this.dialogRef.close({
      mode: 'edit',
      title: this.form.controls.title.value,
      content: this.form.controls.content.value,
    });
    this.showSnackBar('Tópico atualizado com sucesso.');
  }

  cancel() {
    this.dialogRef.close(null);
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
    });
  }
}

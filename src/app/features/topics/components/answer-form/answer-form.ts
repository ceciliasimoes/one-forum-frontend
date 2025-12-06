import { Component, EventEmitter, output, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'answer-form',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './answer-form.html',
  styleUrl: './answer-form.css',
})
export class AnswerForm {
  public submitAnswer = output<string>();
  protected text = '';

  submit() {
    if (!this.text.trim()) return;
    this.submitAnswer.emit(this.text);
    this.text = '';
  }
}

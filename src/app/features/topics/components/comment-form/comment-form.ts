import { Component, computed, EventEmitter, output, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

const MAX_COMMENT_LENGTH = 255;

@Component({
  selector: 'comment-form',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.css',
})
export class CommentForm {
  protected readonly MAX_COMMENT_LENGTH = MAX_COMMENT_LENGTH;
  
  public submitComment = output<string>();
  protected text = signal('');
  protected characterCount = computed(() => this.text().length);

  submit() {
    const textValue = this.text().trim();
    if (!textValue) return;
    this.submitComment.emit(textValue);
    this.text.set('');
  }
}

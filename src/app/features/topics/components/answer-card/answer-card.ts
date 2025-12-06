import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  inject,
  signal,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TokenService } from '../../../../core/services/token.service';
import { CommentsService } from '../../../../core/services/comemments.service';
import { AnsWer } from '../../../../core/models/comments';
import { AuthService } from '../../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getInitials } from '../../../../shared/utils/string.utils';

@Component({
  selector: 'answer-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './answer-card.html',
  styleUrls: ['./answer-card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswerCard {
  public answer = input.required<AnsWer>();
  public deleteAnswer = output<void>();

  private readonly tokenService = inject(TokenService);
  private readonly commentsService = inject(CommentsService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly user = computed(() => this.authService.currentUser());
  protected readonly showButtons = computed(() => {
    return this.answer()?.userId === this.user()?.id;
  });
  protected readonly isEditing = signal(false);

  private readonly currentUserId = this.tokenService.getUserId();
  protected editContent = '';

  protected startEdit(): void {
    this.editContent = this.answer()?.content ?? '';
    this.isEditing.set(true);
  }

  protected cancelEdit(): void {
    this.isEditing.set(false);
    this.editContent = '';
  }

  protected saveEdit(): void {
    const newContent = this.editContent.trim();
    if (!newContent) {
      this.snackBar.open('O conteúdo não pode estar vazio', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return;
    }

    const topicId = this.answer()?.topicId;
    const answerId = this.answer()?.id;

    if (!topicId || !answerId) {
      this.snackBar.open('Erro ao identificar o comentário', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return;
    }

    this.commentsService.update(topicId, answerId, { content: newContent }).subscribe({
      next: () => {
        this.answer().content = newContent;
        this.isEditing.set(false);
        this.editContent = '';
        this.snackBar.open('Comentário atualizado com sucesso', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        console.error('Error updating comment', err);
        this.snackBar.open('Erro ao atualizar comentário', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
    });
  }

  protected delete(): void {
    const topicId = this.answer()?.topicId;
    const answerId = this.answer()?.id;

    if (!topicId || !answerId) {
      this.snackBar.open('Erro ao identificar o comentário', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return;
    }

    this.commentsService.delete(topicId, answerId).subscribe({
      next: (res: any) => {
        const status = res?.status ?? res?.statusCode ?? res?.code;

        if (status === 204) {
          this.deleteAnswer.emit();
          this.snackBar.open('Comentário excluído com sucesso', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        } else {
          console.error('Failed to delete comment, status:', status);
          this.snackBar.open('Falha ao excluir comentário', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        }
      },
      error: (err) => {
        console.error('Error deleting comment', err);
        this.snackBar.open('Erro ao excluir comentário', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
    });
  }

  protected readonly getInitials = getInitials;
}

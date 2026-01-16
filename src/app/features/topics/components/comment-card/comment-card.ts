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
import { CommentsService } from '../../../../core/services/comments.service';
import { Comment } from '../../../../core/models/comments';
import { AuthService } from '../../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getInitials } from '../../../../shared/utils/string.utils';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'comment-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule, RouterLink],
  templateUrl: './comment-card.html',
  styleUrls: ['./comment-card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentCard {
  public comment = input.required<Comment>();
  public deleteComment = output<void>();

  private readonly tokenService = inject(TokenService);
  private readonly commentsService = inject(CommentsService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly user = computed(() => this.authService.currentUser());
  protected readonly showButtons = computed(() => {
    console.log('Comparing', this.comment(), this.user());
    return this.comment()?.author?.id === this.user()?.id;
  });
  protected readonly isEditing = signal(false);

  private readonly currentUserId = this.tokenService.getUserId();
  protected editContent = '';

  protected startEdit(): void {
    this.editContent = this.comment()?.content ?? '';
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

    const topicId = this.comment()?.topicId;
    const commentId = this.comment()?.id;

    if (!topicId || !commentId) {
      this.snackBar.open('Erro ao identificar o comentário', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return;
    }

    this.commentsService.update(topicId, commentId, { content: newContent }).subscribe({
      next: () => {
        this.comment().content = newContent;
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
    const topicId = this.comment()?.topicId;
    const commentId = this.comment()?.id;

    if (!topicId || !commentId) {
      this.snackBar.open('Erro ao identificar o comentário', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return;
    }

    this.commentsService.delete(topicId, commentId).subscribe({
      next: (res) => {
        const status = res.status;

        if (status === 204) {
          this.deleteComment.emit();
          this.snackBar.open('Comentário excluído com sucesso', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        } else {
          console.log(status)
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

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Topic } from '../../../../core/models/topics';
import { MatDialog } from '@angular/material/dialog';
import { TopicDialog } from '../../../../shared/components/topic-dialog/topic-dialog';
import { TopicService } from '../../../../core/services/topics.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { getInitials } from '../../../../shared/utils/string.utils';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'topic-card',
  imports: [MatCardModule, MatButtonModule, MatChipsModule, MatIconModule, CommonModule, MatSnackBarModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './topic-card.html',
  styleUrl: './topic-card.css',
})
export class TopicCard {
  readonly topic = model.required<Topic>();
  readonly answers = input<number>(0);

  private readonly authService = inject(AuthService);
  private readonly topicService = inject(TopicService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly user = computed(() => this.authService.currentUser());

  protected readonly showButtons = computed(() => this.topic()?.author?.id === this.user()?.id);

  openEditDialog(): void {
    const topic = this.topic();
    const dialogRef = this.dialog.open(TopicDialog, {
      width: 'auto',
      maxWidth: 'none',
      data: {
        mode: 'edit',
        title: topic.title,
        content: topic.content,
        categories: topic.categories.map((c) => c.name),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.topicService
        .editTopic(topic.id, {
          title: result.title ?? topic.title,
          content: result.content ?? topic.content,
        })
        .subscribe({
          next: (updatedTopic) => {
            this.topic.set(updatedTopic);
            this.showSnack('Tópico atualizado com sucesso.');
          },
          error: () => {
            this.showSnack('Erro ao atualizar o tópico.', true);
            console.error('Error updating topic');
          },
        });
    });
  }

  protected readonly getInitials = getInitials;

  toggleLike(): void {
    const current = this.topic();
    this.topicService.toggleLike(current.id).subscribe({
      next: (res) => {
        this.topic.set({
          ...current,
          likes: res.likeCount,
          likedByCurrentUser: !current.likedByCurrentUser,
        });
        this.showSnack(current.likedByCurrentUser ? 'Like removido.' : 'Like adicionado.');
      },
      error: () => {
        this.showSnack('Erro ao atualizar like.', true);
        console.error('Error toggling like');
      },
    });
  }

  deleteTopic(): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Excluir Tópico',
        message: 'Tem certeza que deseja excluir este tópico? Esta ação não pode ser desfeita.',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      const current = this.topic();
      this.topicService.deleteTopic(current.id).subscribe({
        next: () => {
          this.showSnack('Tópico deletado com sucesso.');
          this.router.navigate(['/']);
        },
        error: () => {
          this.showSnack('Erro ao deletar o tópico.', true);
          console.error('Error deleting topic');
        },
      });
    });
  }

  private showSnack(message: string, isError = false): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: isError ? ['snack-error'] : ['snack-success'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}

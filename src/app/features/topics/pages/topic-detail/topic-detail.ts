import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { TopicCard } from '../../components/topic-card/topic-card';
import { CommentForm } from '../../components/comment-form/comment-form';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommentsContainer } from '../../components/comments-container/comments-container';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from '../../../../core/services/topics.service';
import { Topic } from '../../../../core/models/topics';
import { Location } from '@angular/common';
import { CommentsService } from '../../../../core/services/comments.service';
import { interval, Subscription } from 'rxjs';
import { Comment } from '../../../../core/models/comments';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SkeletonTopicCard } from '../../../../shared/components/skeleton-topic-card/skeleton-topic-card';
import { SkeletonComment } from '../../../../shared/components/skeleton-comment/skeleton-comment';

@Component({
  selector: 'topic-detail',
  imports: [
    TopicCard,
    CommentForm,
    MatButtonModule,
    MatIconModule,
    CommentsContainer,
    SkeletonTopicCard,
    SkeletonComment,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './topic-detail.html',
  styleUrls: ['./topic-detail.css'],
})
export class TopicDetail {
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly topicId = this.route.snapshot.paramMap.get('id');
  private readonly topicService = inject(TopicService);
  private readonly commentsService = inject(CommentsService);
  private readonly snackBar = inject(MatSnackBar);

  private refreshSub!: Subscription;

  protected isLoadingTopic = signal(true);
  protected isLoadingComments = signal(true);

  protected topic: WritableSignal<Topic> = signal<Topic>({
    id: 0,
    title: '',
    likes: 0,
    content: null,
    likedByCurrentUser: false,
    author: {
      id: 0,
      createdAt: '',
      profileName: '',
      profilePhoto: '',
    },
    createdAt: '',
    updatedAt: '',
    categories: [],
  });
  protected comments: WritableSignal<Comment[]> = signal([]);

  ngOnInit(): void {
    this.loadTopic();
    this.loadComments();
    this.refreshSub = interval(5000).subscribe(() => this.loadComments());
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  private loadTopic(): void {
    this.isLoadingTopic.set(true);
    this.topicService.getTopicById(this.topicId!).subscribe({
      next: (topic) => {
        this.topic.set(topic);
        this.isLoadingTopic.set(false);
      },
      error: () => {
        this.isLoadingTopic.set(false);
      },
    });
  }

  private loadComments(): void {
    const isInitialLoad = this.comments().length === 0;
    if (isInitialLoad) {
      this.isLoadingComments.set(true);
    }
    
    this.commentsService.getAll(Number(this.topicId)).subscribe({
      next: (res) => {
        const newComments = res.content;
        
        if (isInitialLoad) {
          // Primeira carga: carregar todos
          this.comments.set(newComments);
          this.isLoadingComments.set(false);
        } else {
          // Atualizações subsequentes: apenas adicionar novos
          const currentIds = new Set(this.comments().map(c => c.id));
          const commentsToAdd = newComments.filter((c: Comment) => !currentIds.has(c.id));
          
          if (commentsToAdd.length > 0) {
            this.comments.update(current => [...commentsToAdd, ...current]);
          }
        }
      },
      error: () => {
        if (isInitialLoad) {
          this.isLoadingComments.set(false);
        }
      },
    });
  }

  onSubmitComment(text: string): void {
    if (!text?.trim()) return;

    this.commentsService.create(Number(this.topicId), { content: text }).subscribe({
      next: () => {
        // Recarrega os comentários após adicionar um novo
        this.loadComments();
        this.snackBar.open('Comentário adicionado com sucesso!', 'Fechar', { duration: 3000 });
      },
      error: (err) => {
        console.error('Erro ao criar comentário', err);
        this.snackBar.open('Erro ao adicionar comentário.', 'Fechar', { duration: 3000 });
      },
    });
  }

  removeComment(id: number): void {
    const updatedComments = this.comments().filter((comment) => comment.id !== id);
    this.comments.set(updatedComments);
    this.snackBar.open('Comentário removido com sucesso!', 'Fechar', { duration: 3000 });
  }

  backToPreviousPage() {
    this.location.back();
  }
}

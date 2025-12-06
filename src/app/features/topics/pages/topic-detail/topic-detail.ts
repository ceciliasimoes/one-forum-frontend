import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { TopicCard } from '../../components/topic-card/topic-card';
import { AnswerForm } from '../../components/answer-form/answer-form';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AnswersContainer } from '../../components/answers-container/answers-container';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from '../../../../core/services/topics.service';
import { Topic } from '../../../../core/models/topics';
import { Location } from '@angular/common';
import { CommentsService } from '../../../../core/services/comemments.service';
import { interval, Subscription } from 'rxjs';

import { AnsWer } from '../../../../core/models/comments';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'topic-detail',
  imports: [TopicCard, AnswerForm, MatButtonModule, MatIconModule, AnswersContainer],
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

  protected topic: WritableSignal<Topic> = signal({} as Topic);
  protected answers: WritableSignal<AnsWer[]> = signal([]);

  ngOnInit(): void {
    this.loadTopic();
    this.loadComments();
    this.refreshSub = interval(5000).subscribe(() => this.loadComments());
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  private loadTopic(): void {
    this.topicService.getTopicById(this.topicId!).subscribe((topic) => {
      this.topic.set(topic);
    });
  }

  private loadComments(): void {
    this.commentsService.getAll(Number(this.topicId)).subscribe((res) => {
      this.answers.set(res.content);
    });
  }

  onSubmitAnswer(text: string): void {
    if (!text?.trim()) return;

    this.commentsService.create(Number(this.topicId), { content: text }).subscribe({
      next: () => {
        this.loadComments();
        this.snackBar.open('Comentário adicionado com sucesso!', 'Fechar', { duration: 3000 }); 
      },
      error: (err) => {
        console.error('Erro ao criar comentário', err);
        this.snackBar.open('Erro ao adicionar comentário.', 'Fechar', { duration: 3000 }); 
      },
    });
  }

  removeAnswer(id: number): void {
    const updatedAnswers = this.answers().filter((answer) => answer.id !== id);
    this.answers.set(updatedAnswers);
    this.snackBar.open('Comentário removido com sucesso!', 'Fechar', { duration: 3000 }); 
  }

  protected redirect(): void {
    window.history.back();
  }

  backToPreviousPage() {
    this.location.back();
  }
}

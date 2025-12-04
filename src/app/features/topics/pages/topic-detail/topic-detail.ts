import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { TopicCard } from '../../components/topic-card/topic-card';
import { AnswerForm } from '../../components/answer-form/answer-form';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AnswersContainer } from '../../components/answers-container/answers-container';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from '../../../../core/services/topics';
import { Topic } from '../../../../core/models/topics';
import { Location } from '@angular/common';

@Component({
  selector: 'topic-detail',
  imports: [TopicCard, AnswerForm, MatButtonModule, MatIconModule, AnswersContainer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './topic-detail.html',
  styleUrl: './topic-detail.css',
})
export class TopicDetail {
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly topicId = this.route.snapshot.paramMap.get('id');
  private readonly topicService = inject(TopicService);
  protected topic: WritableSignal<Topic> = signal({} as Topic);

  ngOnInit(): void {
    this.topicService.getTopicById(this.topicId!).subscribe((topic) => {
      this.topic.set({
        title: topic.title,
        likes: topic.likes,
        id: topic.id,
        content: topic.content,
        likedByCurrentUser: topic.likedByCurrentUser,
        author: topic.author,
        createdAt: topic.createdAt,
        updatedAt: topic.updatedAt,
        categories: topic.categories,
      });
    });
  }

  onSubmitAnswer(text: string) {
    //TODO: implementar lógica de envio de resposta
  }

  backToPreviousPage() {
    this.location.back();
  }
}

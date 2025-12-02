import { Component, effect, Input, input, output } from '@angular/core';
import { AnswerCard } from '../answer-card/answer-card';
import { NoAnswersCard } from '../no-answers-card/no-answers-card';
import { CommonModule } from '@angular/common';
import { AnsWer } from '../../../../core/models/comments';

@Component({
  selector: 'answers-container',
  imports: [CommonModule, NoAnswersCard, AnswerCard],
  templateUrl: './answers-container.html',
  styleUrl: './answers-container.css',
})
export class AnswersContainer {
  public answers = input<AnsWer[]>([]);
  public deleteAnswer = output<number>();
}

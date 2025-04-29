import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService } from '../../../core/services/quiz.service';
import { ToastService } from '../../../shared/services/toast.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Quiz, Question, QuestionOption } from '../../../core/models/quiz.model';

@Component({
  selector: 'app-quiz-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="quiz-create-container">
      <h2>Create New Quiz</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" [(ngModel)]="quiz.title" name="title" required>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" [(ngModel)]="quiz.description" name="description"></textarea>
        </div>

        <div class="form-group">
          <label for="timeLimit">Time Limit (minutes)</label>
          <input type="number" id="timeLimit" [(ngModel)]="quiz.timeLimit" name="timeLimit">
        </div>

        <h3>Questions</h3>
        <div *ngFor="let question of quiz.questions; let i = index" class="question">
          <div class="question-header">
            <h4>Question {{i + 1}}</h4>
            <button type="button" (click)="removeQuestion(i)">Remove</button>
          </div>
          
          <div class="form-group">
            <label>Question Text</label>
            <input type="text" [(ngModel)]="question.text" [name]="'questionText' + i" required>
          </div>

          <div class="form-group">
            <label>Points</label>
            <input type="number" [(ngModel)]="question.points" [name]="'points' + i" required>
          </div>

          <div class="form-group">
            <label>Time Limit (seconds)</label>
            <input type="number" [(ngModel)]="question.timeLimit" [name]="'timeLimit' + i">
          </div>

          <div class="options">
            <h5>Options</h5>
            <div *ngFor="let option of question.options; let j = index" class="option">
              <input type="radio" [name]="'correctOption' + i" 
                [value]="option.id" [(ngModel)]="question.correctOptionId">
              <input type="text" [(ngModel)]="option.text" [name]="'optionText' + i + j" required>
              <button type="button" (click)="removeOption(i, j)">Remove</button>
            </div>
            <button type="button" (click)="addOption(i)">Add Option</button>
          </div>
        </div>

        <button type="button" (click)="addQuestion()">Add Question</button>
        <button type="submit">Create Quiz</button>
      </form>
    </div>
  `,
  styles: [`
    .quiz-create-container {
      padding: var(--space-4);
      max-width: 800px;
      margin: 0 auto;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .question {
      border: 1px solid #ddd;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
  `]
})
export class QuizCreateComponent {
  quiz: Partial<Quiz> = {
    title: '',
    description: '',
    questions: [this.createNewQuestion()]
  };

  constructor(
    private quizService: QuizService,
    private toastService: ToastService,
    private router: Router
  ) { }

  createNewQuestion(): Question {
    return {
      id: crypto.randomUUID(),
      text: '',
      options: [
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' }
      ],
      correctOptionId: '',
      points: 1
    };
  }

  addQuestion(): void {
    this.quiz.questions?.push(this.createNewQuestion());
  }

  removeQuestion(index: number): void {
    this.quiz.questions?.splice(index, 1);
  }

  addOption(questionIndex: number): void {
    const newOption = { id: crypto.randomUUID(), text: '' };
    this.quiz.questions?.[questionIndex].options.push(newOption);
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    this.quiz.questions?.[questionIndex].options.splice(optionIndex, 1);
  }

  onSubmit(): void {
    this.quizService.createQuiz(this.quiz).subscribe({
      next: (createdQuiz) => {
        this.toastService.showSuccess('Quiz created successfully');
        this.router.navigate(['/teacher/quizzes']);
      },
      error: (err) => {
        this.toastService.showError('Failed to create quiz');
      }
    });
  }
}

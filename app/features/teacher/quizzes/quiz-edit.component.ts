import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../../core/services/quiz.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Quiz, Question, Option } from '../../../core/models/quiz.model';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-quiz-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="quiz-edit-container">
      <h2>Edit Quiz</h2>
      
      <form [formGroup]="quizForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title</label>
          <input id="title" type="text" formControlName="title" required>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" formControlName="description" rows="3"></textarea>
        </div>

        <div formArrayName="questions">
          <div *ngFor="let question of questions.controls; let i = index" [formGroupName]="i" class="question-card">
            <h3>Question {{i + 1}}</h3>
            <button type="button" (click)="removeQuestion(i)" class="delete-btn">Delete</button>
            
            <div class="form-group">
              <label [for]="'questionText' + i">Question Text</label>
              <input [id]="'questionText' + i" type="text" formControlName="text" required>
            </div>

            <div formArrayName="options">
              <div *ngFor="let option of getQuestionOptions(i).controls; let j = index" [formGroupName]="j" class="option-row">
                <input type="radio" [name]="'correctOption' + i" [value]="option.value.id" 
                       (change)="setCorrectOption(i, option.value.id)">
                <input type="text" formControlName="text" required>
                <button type="button" (click)="removeOption(i, j)" class="delete-btn">×</button>
              </div>
            </div>

            <button type="button" (click)="addOption(i)" class="add-btn">Add Option</button>
          </div>
        </div>

        <div class="actions">
          <button type="button" (click)="addQuestion()" class="add-btn">Add Question</button>
          <button type="submit" [disabled]="quizForm.invalid">Save Quiz</button>
          <button type="button" (click)="publishQuiz()" *ngIf="!isPublished">Publish Quiz</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .quiz-edit-container {
      padding: var(--space-4);
      max-width: 800px;
      margin: 0 auto;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .question-card {
      border: 1px solid #ddd;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;
      position: relative;
    }
    .option-row {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .delete-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: #ff4444;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
    }
    .add-btn {
      background: #4285f4;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 0.5rem;
    }
    .actions {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
    }
  `]
})
export class QuizEditComponent implements OnInit {
  quizForm: FormGroup;
  quizId: string;
  isPublished: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private toastService: ToastService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.quizId = this.route.snapshot.params['id'];
    this.loadQuiz();
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  getQuestionOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  loadQuiz(): void {
    this.quizService.getQuiz(this.quizId).subscribe({
      next: (quiz) => {
        this.isPublished = quiz.isPublished;
        this.quizForm.patchValue({
          title: quiz.title,
          description: quiz.description
        });

        quiz.questions.forEach(question => {
          this.addQuestion(question);
        });
      },
      error: (err) => {
        this.toastService.show({
          message: 'Failed to load quiz',
          type: 'error'
        });
      }
    });
  }

  addQuestion(question?: Question): void {
    const questionGroup = this.fb.group({
      id: [question?.id || this.generateId()],
      text: [question?.text || '', Validators.required],
      correctOptionId: [question?.correctOptionId || ''],
      options: this.fb.array([])
    });

    this.questions.push(questionGroup);

    if (question) {
      question.options.forEach(option => {
        this.addOption(this.questions.length - 1, option);
      });
    } else {
      // Add default options for new question
      this.addOption(this.questions.length - 1);
      this.addOption(this.questions.length - 1);
    }
  }

  addOption(questionIndex: number, option?: Option): void {
    const optionGroup = this.fb.group({
      id: [option?.id || this.generateId()],
      text: [option?.text || '', Validators.required]
    });

    this.getQuestionOptions(questionIndex).push(optionGroup);
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    const options = this.getQuestionOptions(questionIndex);
    if (options.length > 1) {
      options.removeAt(optionIndex);
    }
  }

  setCorrectOption(questionIndex: number, optionId: string): void {
    this.questions.at(questionIndex).patchValue({
      correctOptionId: optionId
    });
  }

  onSubmit(): void {
    if (this.quizForm.invalid) return;

    const quizData = this.quizForm.value;
    this.quizService.updateQuiz(this.quizId, quizData).subscribe({
      next: () => {
        this.toastService.show({
          message: 'Quiz updated successfully',
          type: 'success'
        });
        this.router.navigate(['/teacher/quizzes']);
      },
      error: (err) => {
        this.toastService.show({
          message: 'Failed to update quiz',
          type: 'error'
        });
      }
    });
  }

  publishQuiz(): void {
    this.quizService.publishQuiz(this.quizId).subscribe({
      next: () => {
        this.isPublished = true;
        this.toastService.show({
          message: 'Quiz published successfully',
          type: 'success'
        });
      },
      error: (err) => {
        this.toastService.show({
          message: 'Failed to publish quiz',
          type: 'error'
        });
      }
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}

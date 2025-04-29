import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../../core/services/quiz.service';
import { Router } from '@angular/router';
import { Quiz } from '../../../core/models/quiz.model';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quiz-list-container">
      <div class="header">
        <h2>My Quizzes</h2>
        <button class="btn btn-primary" (click)="createQuiz()">Create New Quiz</button>
      </div>
      
      <div class="quiz-table">
        <div class="quiz-row header">
          <div>Title</div>
          <div>Questions</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        <div *ngFor="let quiz of quizzes" class="quiz-row">
          <div>{{quiz.title}}</div>
          <div>{{quiz.questions.length}}</div>
          <div>{{quiz.isPublished ? 'Published' : 'Draft'}}</div>
          <div class="actions">
            <button (click)="editQuiz(quiz.id)">Edit</button>
            <button (click)="deleteQuiz(quiz.id)">Delete</button>
            <button (click)="viewDetails(quiz.id)">Details</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quiz-list-container {
      padding: var(--space-4);
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }
    
    .quiz-table {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .quiz-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 2fr;
      gap: 1rem;
      padding: 0.5rem;
      border: 1px solid #ddd;
    }
    
    .quiz-row.header {
      font-weight: bold;
      background-color: #f5f5f5;
    }
    
    .actions {
      display: flex;
      gap: 0.5rem;
    }
  `]
})
export class QuizListComponent implements OnInit {
  quizzes: Quiz[] = [];

  constructor(
    private quizService: QuizService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.quizService.getTeacherQuizzes().subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes;
      },
      error: (err) => {
        console.error('Failed to load quizzes', err);
      }
    });
  }

  createQuiz(): void {
    this.router.navigate(['/teacher/quizzes/create']);
  }

  editQuiz(id: string): void {
    this.router.navigate(['/teacher/quizzes/edit', id]);
  }

  deleteQuiz(id: string): void {
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.quizService.deleteQuiz(id).subscribe({
        next: () => {
          this.loadQuizzes();
        },
        error: (err) => {
          console.error('Failed to delete quiz', err);
        }
      });
    }
  }

  viewDetails(id: string): void {
    this.router.navigate(['/teacher/quizzes', id]);
  }
}

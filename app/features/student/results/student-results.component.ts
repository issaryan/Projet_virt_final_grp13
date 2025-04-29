import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../../core/services/quiz.service';
import { QuizResult } from '../../../core/models/quiz.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="results-container">
      <h2>My Quiz Results</h2>
      
      <div *ngFor="let result of results" class="result-card" (click)="viewDetails(result.sessionId)">
        <div class="quiz-title">{{result.quizId}}</div>
        <div class="score">
          Score: {{result.score}}/{{result.maxScore}} ({{result.percentageScore}}%)
        </div>
        <div class="date">
          Completed: {{result.completedAt | date}}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      padding: var(--space-4);
      max-width: 800px;
      margin: 0 auto;
    }
    .result-card {
      border: 1px solid #ddd;
      padding: 1rem;
      margin-bottom: 1rem;
      cursor: pointer;
    }
    .quiz-title {
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    .score {
      color: green;
    }
  `]
})
export class StudentResultsComponent implements OnInit {
  results: QuizResult[] = [];

  constructor(
    private quizService: QuizService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    // TODO: Replace with actual student ID
    const studentId = 'current-user-id';
    this.quizService.getStudentResults(studentId).subscribe({
      next: (results) => {
        this.results = results;
      },
      error: (err) => {
        console.error('Failed to load results', err);
      }
    });
  }

  viewDetails(sessionId: string): void {
    this.router.navigate(['/student/results', sessionId]);
  }
}

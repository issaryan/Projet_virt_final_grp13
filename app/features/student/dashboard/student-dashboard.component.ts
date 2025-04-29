import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { QuizService } from '../../../core/services/quiz.service';
import { RealTimeService } from '../../../core/services/real-time.service';
import { QuizResult } from '../../../core/models/quiz.model';
import { ToastService } from '../../../shared/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <h2>Welcome back, {{studentName}}!</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Quizzes</h3>
          <p>{{totalQuizzes}}</p>
        </div>
        <div class="stat-card">
          <h3>Average Score</h3>
          <p>{{averageScore}}%</p>
        </div>
        <div class="stat-card">
          <h3>Highest Score</h3>
          <p>{{highestScore}}%</p>
        </div>
        <div class="stat-card">
          <h3>This Month</h3>
          <p>{{quizzesThisMonth}}</p>
        </div>
      </div>

      <div class="recent-section">
        <h3>Recent Results</h3>
        <div *ngIf="isLoading" class="loading">Loading...</div>
        <div *ngIf="!isLoading && recentResults.length === 0" class="no-results">
          No results yet
        </div>
        <div class="recent-list" *ngIf="!isLoading && recentResults.length > 0">
          <div class="result-item" *ngFor="let result of recentResults">
            <div class="quiz-name">{{result.quizName}}</div>
            <div class="score">{{result.percentageScore}}%</div>
            <div class="date">{{result.completedAt | date}}</div>
            <a [routerLink]="['/student/results', result.id]" class="details-link">Details</a>
          </div>
        </div>
      </div>

      <div class="actions">
        <a routerLink="/student/join" class="btn primary">Join Quiz</a>
        <a routerLink="/student/results" class="btn secondary">View All Results</a>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    h2 {
      color: var(--primary-color);
      margin-bottom: 2rem;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    
    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .stat-card h3 {
      margin-top: 0;
      color: var(--text-secondary);
      font-size: 1rem;
    }
    
    .stat-card p {
      font-size: 2rem;
      font-weight: bold;
      margin: 0.5rem 0 0;
      color: var(--primary-color);
    }
    
    .recent-section {
      margin-bottom: 3rem;
    }
    
    .recent-list {
      display: grid;
      gap: 1rem;
    }
    
    .result-item {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      align-items: center;
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .quiz-name {
      font-weight: 500;
    }
    
    .score {
      text-align: center;
      font-weight: bold;
      color: var(--primary-color);
    }
    
    .date {
      text-align: center;
      color: var(--text-secondary);
    }
    
    .details-link {
      text-align: right;
      color: var(--primary-color);
      text-decoration: none;
    }
    
    .actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .primary {
      background: var(--primary-color);
      color: white;
    }
    
    .secondary {
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
    }
    
    .loading, .no-results {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
    }
  `]
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  studentName = '';
  results: QuizResult[] = [];
  recentResults: QuizResult[] = [];
  isLoading = true;
  totalQuizzes = 0;
  averageScore = 0;
  highestScore = 0;
  quizzesThisMonth = 0;
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private quizService: QuizService,
    private realTimeService: RealTimeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.studentName = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    this.loadResults();
    this.setupRealTimeListeners();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setupRealTimeListeners(): void {
    this.subscriptions.add(
      this.realTimeService.quizStarted$.subscribe(sessionId => {
        if (sessionId) {
          this.toastService.show({
            message: 'Quiz has started!',
            type: 'info'
          });
        }
      })
    );

    this.subscriptions.add(
      this.realTimeService.quizEnded$.subscribe(sessionId => {
        if (sessionId) {
          this.toastService.show({
            message: 'Quiz has ended. Results available soon.',
            type: 'info'
          });
          this.loadResults();
        }
      })
    );
  }

  loadResults(): void {
    const userId = this.authService.currentUserValue?.id || '';
    
    this.quizService.getStudentResults(userId).subscribe({
      next: (results) => {
        this.isLoading = false;
        this.results = results;
        this.recentResults = [...results].sort((a, b) => 
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        ).slice(0, 3);
        
        this.calculateStats(results);
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.show({
          message: 'Failed to load results. Please try again.',
          type: 'error'
        });
      }
    });
  }

  calculateStats(results: QuizResult[]): void {
    this.totalQuizzes = results.length;
    
    if (results.length > 0) {
      this.averageScore = Math.round(
        results.reduce((sum, result) => sum + result.percentageScore, 0) / results.length
      );
      
      this.highestScore = Math.round(
        Math.max(...results.map(result => result.percentageScore))
      );
      
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      
      this.quizzesThisMonth = results.filter(result => {
        const date = new Date(result.completedAt);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      }).length;
    }
  }
}

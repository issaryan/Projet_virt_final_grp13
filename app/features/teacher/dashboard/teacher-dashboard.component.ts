import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { QuizService } from '../../../core/services/quiz.service';
import { RealTimeService } from '../../../core/services/real-time.service';
import { Quiz, QuizSession } from '../../../core/models/quiz.model';
import { ToastService } from '../../../shared/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <h2>Welcome back, {{teacherName}}!</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Active Sessions</h3>
          <p>{{activeSessions}}</p>
        </div>
        <div class="stat-card">
          <h3>Total Participants</h3>
          <p>{{totalParticipants}}</p>
        </div>
        <div class="stat-card">
          <h3>Average Score</h3>
          <p>{{averageScore}}%</p>
        </div>
        <div class="stat-card">
          <h3>Total Quizzes</h3>
          <p>{{quizzes.length}}</p>
        </div>
      </div>

      <div class="recent-section">
        <h3>Recent Quizzes</h3>
        <div *ngIf="isLoading" class="loading">Loading...</div>
        <div *ngIf="!isLoading && recentQuizzes.length === 0" class="no-results">
          No quizzes yet
        </div>
        <div class="recent-list" *ngIf="!isLoading && recentQuizzes.length > 0">
          <div class="quiz-item" *ngFor="let quiz of recentQuizzes">
            <div class="quiz-name">{{quiz.title}}</div>
            <div class="questions">{{quiz.questions.length}} questions</div>
            <div class="date">{{quiz.createdAt | date}}</div>
            <a [routerLink]="['/teacher/quizzes', quiz.id]" class="details-link">Details</a>
          </div>
        </div>
      </div>

      <div class="actions">
        <a routerLink="/teacher/quizzes/create" class="btn primary">Create New Quiz</a>
        <a routerLink="/teacher/quizzes" class="btn secondary">Manage Quizzes</a>
        <a routerLink="/teacher/sessions" class="btn secondary">View Sessions</a>
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
    
    .quiz-item {
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
    
    .questions {
      text-align: center;
      color: var(--text-secondary);
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
export class TeacherDashboardComponent implements OnInit, OnDestroy {
  quizzes: Quiz[] = [];
  recentQuizzes: Quiz[] = [];
  isLoading = true;
  teacherName = '';
  activeSessions = 0;
  totalParticipants = 0;
  averageScore = 0;
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
      this.teacherName = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    this.loadQuizzes();
    this.setupRealTimeListeners();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setupRealTimeListeners(): void {
    this.subscriptions.add(
      this.realTimeService.sessionUpdates$.subscribe(session => {
        if (session) {
          this.updateSessionStats(session);
        }
      })
    );

    this.subscriptions.add(
      this.realTimeService.newParticipants$.subscribe(participant => {
        if (participant) {
          this.totalParticipants++;
          this.toastService.show({
            message: `New participant: ${participant.studentName}`,
            type: 'info'
          });
        }
      })
    );

    this.subscriptions.add(
      this.realTimeService.newAnswers$.subscribe(answer => {
        if (answer) {
          this.toastService.show({
            message: 'New answer submitted',
            type: 'info'
          });
        }
      })
    );
  }

  updateSessionStats(session: QuizSession): void {
    this.activeSessions = session.isActive ? 1 : 0;
    
    if (session.participants) {
      this.totalParticipants = session.participants.length;
      
      if (session.participants.length > 0) {
        const totalScore = session.participants.reduce((sum, p) => sum + (p.score || 0), 0);
        this.averageScore = Math.round(totalScore / session.participants.length);
      }
    }
  }

  loadQuizzes(): void {
    this.quizService.getTeacherQuizzes().subscribe({
      next: (quizzes) => {
        this.isLoading = false;
        this.quizzes = quizzes;
        this.recentQuizzes = [...quizzes].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 3);
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.show({
          message: 'Failed to load quizzes. Please try again.',
          type: 'error'
        });
      }
    });
  }
}

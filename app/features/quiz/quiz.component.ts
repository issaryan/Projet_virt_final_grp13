import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../core/services/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz, Question, QuizSession, ParticipantAnswer } from '../../core/models/quiz.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="quiz-container">
      <div class="quiz-header">
        <h2>{{quiz?.title}}</h2>
        <div class="timer" *ngIf="timeLeft !== null">
          Time left: {{formatTime(timeLeft)}}
        </div>
      </div>
      
      <div *ngIf="currentQuestion !== null" class="question-container">
        <h3>Question {{currentQuestionIndex + 1}} of {{quiz?.questions.length}}</h3>
        <p>{{currentQuestion.text}}</p>
        
        <div *ngFor="let option of currentQuestion.options" class="option">
          <input type="radio" 
            [id]="option.id" 
            [name]="currentQuestion.id" 
            [value]="option.id" 
            [(ngModel)]="selectedOption">
          <label [for]="option.id">{{option.text}}</label>
        </div>
        
        <div class="navigation">
          <button *ngIf="currentQuestionIndex > 0" (click)="previousQuestion()">Previous</button>
          <button *ngIf="currentQuestionIndex < quiz!.questions.length - 1" (click)="nextQuestion()">Next</button>
          <button *ngIf="currentQuestionIndex === quiz!.questions.length - 1" (click)="submitQuiz()">Submit</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quiz-container {
      padding: var(--space-4);
      max-width: 800px;
      margin: 0 auto;
    }
    .quiz-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .question-container {
      border: 1px solid #ddd;
      padding: 1rem;
    }
    .option {
      margin: 0.5rem 0;
    }
    .navigation {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
    }
  `]
})
export class QuizComponent implements OnInit, OnDestroy {
  quiz: Quiz | null = null;
  session: QuizSession | null = null;
  currentQuestionIndex = 0;
  selectedOption: string | null = null;
  timeLeft: number | null = null;
  private timerInterval: any;

  get currentQuestion(): Question | null {
    return this.quiz?.questions[this.currentQuestionIndex] || null;
  }

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const sessionId = this.route.snapshot.paramMap.get('id');
    if (sessionId) {
      this.loadSession(sessionId);
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  loadSession(sessionId: string): void {
    this.quizService.getSession(sessionId).subscribe({
      next: (session) => {
        this.session = session;
        this.loadQuiz(session.quizId);
      },
      error: (err) => {
        console.error('Failed to load session', err);
      }
    });
  }

  loadQuiz(quizId: string): void {
    this.quizService.getQuiz(quizId).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
        this.startTimer();
      },
      error: (err) => {
        console.error('Failed to load quiz', err);
      }
    });
  }

  startTimer(): void {
    if (this.quiz?.timeLimit) {
      this.timeLeft = this.quiz.timeLimit * 60;
      this.timerInterval = setInterval(() => {
        if (this.timeLeft && this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.submitQuiz();
        }
      }, 1000);
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  nextQuestion(): void {
    this.saveAnswer();
    this.currentQuestionIndex++;
    this.selectedOption = null;
  }

  previousQuestion(): void {
    this.saveAnswer();
    this.currentQuestionIndex--;
    this.selectedOption = null;
  }

  saveAnswer(): void {
    if (this.session && this.currentQuestion && this.selectedOption) {
      const answer: ParticipantAnswer = {
        questionId: this.currentQuestion.id,
        selectedOptionId: this.selectedOption,
        correct: this.selectedOption === this.currentQuestion.correctOptionId,
        timeSpent: 0, // TODO: implement actual time tracking
        answeredAt: new Date()
      };
      
      this.quizService.submitAnswer(this.session.id, answer).subscribe();
    }
  }

  submitQuiz(): void {
    if (this.session) {
      this.quizService.completeQuiz(this.session.id).subscribe({
        next: (result) => {
          this.router.navigate(['/student/results', result.sessionId]);
        },
        error: (err) => {
          console.error('Failed to submit quiz', err);
        }
      });
    }
  }
}

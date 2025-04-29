import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../../core/services/quiz.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-join-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="join-quiz-container">
      <h2>Join Quiz Session</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="code">Session Code</label>
          <input type="text" id="code" [(ngModel)]="code" name="code" required>
        </div>
        <button type="submit">Join</button>
      </form>
    </div>
  `,
  styles: [`
    .join-quiz-container {
      padding: var(--space-4);
      max-width: 500px;
      margin: 0 auto;
    }
    .form-group {
      margin-bottom: 1rem;
    }
  `]
})
export class JoinQuizComponent {
  code = '';

  constructor(
    private quizService: QuizService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.quizService.joinSession(this.code).subscribe({
      next: (session) => {
        this.router.navigate(['/quiz', session.id]);
      },
      error: (err) => {
        console.error('Failed to join session', err);
      }
    });
  }
}

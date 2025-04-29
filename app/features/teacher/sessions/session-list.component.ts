import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../../core/services/quiz.service';
import { RealTimeService } from '../../../core/services/real-time.service';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="session-list-container">
      <h2>Quiz Sessions</h2>
      <!-- Session list will go here -->
    </div>
  `,
  styles: [`
    .session-list-container {
      padding: var(--space-4);
      max-width: 800px;
      margin: 0 auto;
    }
  `]
})
export class SessionListComponent {
  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private realTimeService: RealTimeService,
    private router: Router
  ) { }
}

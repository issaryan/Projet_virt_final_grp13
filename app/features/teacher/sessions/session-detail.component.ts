import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../../core/services/quiz.service';
import { RealTimeService } from '../../../core/services/real-time.service';

@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="session-detail-container">
      <h2>Session Details</h2>
      <!-- Session details will go here -->
    </div>
  `,
  styles: [`
    .session-detail-container {
      padding: var(--space-4);
      max-width: 800px;
      margin: 0 auto;
    }
  `]
})
export class SessionDetailComponent {
  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private realTimeService: RealTimeService
  ) { }
}

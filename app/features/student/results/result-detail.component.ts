import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../../core/services/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { QuizResult, Quiz, Question, ParticipantAnswer } from '../../../core/models/quiz.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-result-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="result-detail-container">
      <h2>Quiz Results</h2>
      
      <div class="summary">
        <h3>Summary</h3>
        <p>Score: {{result?.score}}/{{result?.maxScore}} ({{result?.percentageScore}}%)</p>
        <p>Correct Answers: {{result?.correctAnswers}}/{{result?.totalQuestions}}</p>
        <p>Time Spent: {{result?.timeSpent}} seconds</p>
      </div>
      
      <div class="questions">
        <h3>Question Breakdown</h3>
        <div *ngFor="let question of quiz?.questions" class="question">
          <p>{{question.text}}</p>
          <p>Your answer: {{getUserAnswer(question.id)}}</p>
          <p>Correct answer: {{getCorrectAnswer(question.id)}}</p>
          <p>Points: {{getQuestionPoints(question.id)}}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .result-detail-container {
      padding: var(--space-4);
      max-width: 800px;
      margin: 0 auto;
    }
    .summary {
      margin-bottom: 2rem;
    }
    .question {
      border: 1px solid #ddd;
      padding: 1rem;
      margin-bottom: 1rem;
    }
  `]
})
export class ResultDetailComponent implements OnInit {
  result: QuizResult | null = null;
  quiz: Quiz | null = null;
  participantAnswers: ParticipantAnswer[] = [];

  constructor(
    private quizService: QuizService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const sessionId = this.route.snapshot.paramMap.get('id');
    if (sessionId) {
      this.loadResult(sessionId);
    }
  }

  loadResult(sessionId: string): void {
    this.quizService.getSessionResults(sessionId).subscribe({
      next: (results) => {
        this.result = results.find(r => r.userId === this.authService.currentUserValue?.id) || null;
        if (this.result) {
          this.loadQuiz(this.result.quizId);
          this.loadParticipantAnswers(sessionId);
        }
      },
      error: (err) => {
        console.error('Failed to load result', err);
      }
    });
  }

  loadQuiz(quizId: string): void {
    this.quizService.getQuiz(quizId).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
      },
      error: (err) => {
        console.error('Failed to load quiz', err);
      }
    });
  }

  loadParticipantAnswers(sessionId: string): void {
    this.quizService.getSession(sessionId).subscribe({
      next: (session) => {
        const participant = session.participants.find(p => p.userId === this.authService.currentUserValue?.id);
        this.participantAnswers = participant?.answers || [];
      },
      error: (err) => {
        console.error('Failed to load participant answers', err);
      }
    });
  }

  getUserAnswer(questionId: string): string {
    const answer = this.participantAnswers.find(a => a.questionId === questionId);
    if (!answer) return 'No answer provided';
    
    const question = this.quiz?.questions.find(q => q.id === questionId);
    const selectedOption = question?.options.find(o => o.id === answer.selectedOptionId);
    
    return selectedOption?.text || 'Invalid answer';
  }

  getCorrectAnswer(questionId: string): string {
    const question = this.quiz?.questions.find(q => q.id === questionId);
    if (!question) return '';
    
    const correctOption = question.options.find(o => o.id === question.correctOptionId);
    return correctOption?.text || '';
  }

  getQuestionPoints(questionId: string): number {
    const answer = this.participantAnswers.find(a => a.questionId === questionId);
    const question = this.quiz?.questions.find(q => q.id === questionId);
    
    if (!answer || !question) return 0;
    
    return answer.correct ? question.points : 0;
  }
}

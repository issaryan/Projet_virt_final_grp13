import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../../core/services/quiz.service';
import { QuizStats, QuestionStat } from '../../../core/models/quiz.model';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, ChartModule],
  template: `
    <div class="results-container">
      <h2>Quiz Statistics</h2>
      
      <div class="stats-overview">
        <div class="stat-card">
          <h3>Average Score</h3>
          <p>{{ stats?.averageScore | number:'1.0-2' }}%</p>
        </div>
        <div class="stat-card">
          <h3>Highest Score</h3>
          <p>{{ stats?.highestScore | number:'1.0-2' }}%</p>
        </div>
        <div class="stat-card">
          <h3>Lowest Score</h3>
          <p>{{ stats?.lowestScore | number:'1.0-2' }}%</p>
        </div>
        <div class="stat-card">
          <h3>Participants</h3>
          <p>{{ stats?.totalParticipants }}</p>
        </div>
      </div>

      <div class="questions-stats">
        <h3>Question Analysis</h3>
        
        <div *ngFor="let question of stats?.questionsStats" class="question-stat">
          <h4>{{ question.questionText }}</h4>
          <p>Correct: {{ question.correctPercentage | number:'1.0-2' }}%</p>
          <p>Avg Time: {{ question.averageTimeSpent | number:'1.0-2' }}s</p>
          
          <div class="chart-container">
            <p-chart type="bar" [data]="getChartData(question)" [options]="chartOptions"></p-chart>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      padding: var(--space-4);
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }
    
    .stat-card {
      background: white;
      border-radius: var(--radius-md);
      padding: var(--space-3);
      box-shadow: var(--shadow-sm);
      text-align: center;
    }
    
    .stat-card h3 {
      margin-top: 0;
      color: var(--gray-600);
      font-size: 1rem;
    }
    
    .stat-card p {
      font-size: 1.5rem;
      font-weight: bold;
      margin: var(--space-2) 0 0;
    }
    
    .questions-stats {
      background: white;
      border-radius: var(--radius-md);
      padding: var(--space-4);
      box-shadow: var(--shadow-sm);
    }
    
    .question-stat {
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-4);
      border-bottom: 1px solid var(--gray-200);
    }
    
    .question-stat:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .chart-container {
      height: 300px;
      margin-top: var(--space-3);
    }
  `]
})
export class ResultsComponent implements OnInit {
  stats: QuizStats | null = null;
  chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    const quizId = this.route.snapshot.params['id'];
    this.loadStats(quizId);
  }

  loadStats(quizId: string): void {
    this.quizService.getQuizStats(quizId).subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Failed to load stats', err);
      }
    });
  }

  getChartData(question: QuestionStat): any {
    return {
      labels: Object.keys(question.optionDistribution),
      datasets: [{
        label: 'Option Selection %',
        data: Object.values(question.optionDistribution),
        backgroundColor: '#4285f4'
      }]
    };
  }
}

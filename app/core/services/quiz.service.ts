import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  Quiz, 
  QuizSession, 
  QuizResult, 
  QuizStats, 
  ParticipantAnswer 
} from '../models/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  constructor(private http: HttpClient) { }

  // Teacher endpoints
  getTeacherQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${environment.apiUrl}/quizzes/teacher`);
  }

  getQuiz(id: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${environment.apiUrl}/quizzes/${id}`);
  }

  createQuiz(quiz: Partial<Quiz>): Observable<Quiz> {
    return this.http.post<Quiz>(`${environment.apiUrl}/quizzes`, quiz);
  }

  updateQuiz(id: string, quiz: Partial<Quiz>): Observable<Quiz> {
    return this.http.put<Quiz>(`${environment.apiUrl}/quizzes/${id}`, quiz);
  }

  deleteQuiz(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/quizzes/${id}`);
  }

  publishQuiz(id: string): Observable<Quiz> {
    return this.http.patch<Quiz>(`${environment.apiUrl}/quizzes/${id}/publish`, {});
  }

  // Quiz session endpoints
  createSession(quizId: string): Observable<QuizSession> {
    return this.http.post<QuizSession>(`${environment.apiUrl}/sessions`, { quizId });
  }

  getSession(id: string): Observable<QuizSession> {
    return this.http.get<QuizSession>(`${environment.apiUrl}/sessions/${id}`);
  }

  endSession(id: string): Observable<QuizSession> {
    return this.http.patch<QuizSession>(`${environment.apiUrl}/sessions/${id}/end`, {});
  }

  // Student endpoints
  joinSession(code: string): Observable<QuizSession> {
    return this.http.post<QuizSession>(`${environment.apiUrl}/sessions/join`, { code });
  }

  submitAnswer(sessionId: string, answer: ParticipantAnswer): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/sessions/${sessionId}/answer`, answer);
  }

  completeQuiz(sessionId: string): Observable<QuizResult> {
    return this.http.post<QuizResult>(`${environment.apiUrl}/sessions/${sessionId}/complete`, {});
  }

  // Results endpoints
  getSessionResults(sessionId: string): Observable<QuizResult[]> {
    return this.http.get<QuizResult[]>(`${environment.apiUrl}/sessions/${sessionId}/results`);
  }

  getStudentResults(studentId: string): Observable<QuizResult[]> {
    return this.http.get<QuizResult[]>(`${environment.apiUrl}/results/student/${studentId}`);
  }

  getQuizStats(quizId: string): Observable<QuizStats> {
    return this.http.get<QuizStats>(`${environment.apiUrl}/quizzes/${quizId}/stats`);
  }

  // Statistics calculation
  calculateQuestionStats(answers: ParticipantAnswer[], questions: Question[]): QuestionStat[] {
    return questions.map(question => {
      const questionAnswers = answers.filter(a => a.questionId === question.id);
      const totalAnswers = questionAnswers.length;
      const correctAnswers = questionAnswers.filter(a => a.correct).length;
      
      return {
        questionId: question.id,
        questionText: question.text,
        correctPercentage: totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0,
        averageTimeSpent: totalAnswers > 0 
          ? questionAnswers.reduce((sum, a) => sum + a.timeSpent, 0) / totalAnswers 
          : 0,
        optionDistribution: this.calculateOptionDistribution(question, questionAnswers)
      };
    });
  }

  private calculateOptionDistribution(question: Question, answers: ParticipantAnswer[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    const totalAnswers = answers.length;
    
    question.options.forEach(option => {
      const count = answers.filter(a => a.selectedOptionId === option.id).length;
      distribution[option.id] = totalAnswers > 0 ? (count / totalAnswers) * 100 : 0;
    });

    return distribution;
  }
}

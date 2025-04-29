import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { 
  Quiz, 
  QuizSession, 
  ParticipantAnswer, 
  QuizParticipant 
} from '../models/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class RealTimeService {
  private socket: Socket | null = null;
  private connected = new BehaviorSubject<boolean>(false);
  public connected$ = this.connected.asObservable();

  private sessionUpdates = new BehaviorSubject<QuizSession | null>(null);
  public sessionUpdates$ = this.sessionUpdates.asObservable();

  private newParticipants = new BehaviorSubject<QuizParticipant | null>(null);
  public newParticipants$ = this.newParticipants.asObservable();

  private newAnswers = new BehaviorSubject<ParticipantAnswer | null>(null);
  public newAnswers$ = this.newAnswers.asObservable();

  private quizStarted = new BehaviorSubject<string | null>(null);
  public quizStarted$ = this.quizStarted.asObservable();

  private quizEnded = new BehaviorSubject<string | null>(null);
  public quizEnded$ = this.quizEnded.asObservable();

  constructor(private authService: AuthService) { }

  connect(): void {
    if (this.socket) {
      return;
    }

    this.socket = io(environment.wsUrl, {
      auth: {
        token: this.authService.token
      }
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.connected.next(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connected.next(false);
    });

    this.setupListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinSession(sessionId: string): void {
    if (!this.socket || !this.connected.value) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('join-session', { sessionId });
  }

  leaveSession(sessionId: string): void {
    if (!this.socket || !this.connected.value) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('leave-session', { sessionId });
  }

  submitAnswer(sessionId: string, answer: ParticipantAnswer): void {
    if (!this.socket || !this.connected.value) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('submit-answer', { sessionId, answer });
  }

  startQuiz(sessionId: string): void {
    if (!this.socket || !this.connected.value) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('start-quiz', { sessionId });
  }

  endQuiz(sessionId: string): void {
    if (!this.socket || !this.connected.value) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('end-quiz', { sessionId });
  }

  private setupListeners(): void {
    if (!this.socket) {
      return;
    }

    this.socket.on('session-update', (session: QuizSession) => {
      this.sessionUpdates.next(session);
    });

    this.socket.on('new-participant', (participant: QuizParticipant) => {
      this.newParticipants.next(participant);
    });

    this.socket.on('new-answer', (answer: ParticipantAnswer) => {
      this.newAnswers.next(answer);
    });

    this.socket.on('quiz-started', (sessionId: string) => {
      this.quizStarted.next(sessionId);
    });

    this.socket.on('quiz-ended', (sessionId: string) => {
      this.quizEnded.next(sessionId);
    });

    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });
  }

  isConnected(): boolean {
    return this.connected.value;
  }
}

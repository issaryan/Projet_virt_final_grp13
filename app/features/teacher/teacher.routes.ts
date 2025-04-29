import { Routes } from '@angular/router';

export const TEACHER_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent)
  },
  {
    path: 'quizzes',
    loadComponent: () => import('./quizzes/quiz-list.component').then(m => m.QuizListComponent)
  },
  {
    path: 'quizzes/create',
    loadComponent: () => import('./quizzes/quiz-create.component').then(m => m.QuizCreateComponent)
  },
  {
    path: 'quizzes/:id/edit',
    loadComponent: () => import('./quizzes/quiz-edit.component').then(m => m.QuizEditComponent)
  },
  {
    path: 'quizzes/:id/sessions',
    loadComponent: () => import('./sessions/session-list.component').then(m => m.SessionListComponent)
  },
  {
    path: 'sessions/:id',
    loadComponent: () => import('./sessions/session-detail.component').then(m => m.SessionDetailComponent)
  },
  {
    path: 'results/:id',
    loadComponent: () => import('./results/results.component').then(m => m.ResultsComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

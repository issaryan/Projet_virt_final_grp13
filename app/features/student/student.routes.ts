import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'join',
    loadComponent: () => import('./join/join-quiz.component').then(m => m.JoinQuizComponent)
  },
  {
    path: 'results',
    loadComponent: () => import('./results/student-results.component').then(m => m.StudentResultsComponent)
  },
  {
    path: 'result/:id',
    loadComponent: () => import('./results/result-detail.component').then(m => m.ResultDetailComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

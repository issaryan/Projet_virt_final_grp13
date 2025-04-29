import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.AUTH_ROUTES)
  },
  {
    path: 'teacher',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'teacher' },
    loadChildren: () => import('./features/teacher/teacher.routes').then(r => r.TEACHER_ROUTES)
  },
  {
    path: 'student',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'student' },
    loadChildren: () => import('./features/student/student.routes').then(r => r.STUDENT_ROUTES)
  },
  {
    path: 'quiz/:id',
    loadComponent: () => import('./features/quiz/quiz.component').then(m => m.QuizComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];

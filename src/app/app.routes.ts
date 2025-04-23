import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PredictorComponent } from './predictor/predictor.component';
import { ChatComponent } from './chat/chat.component';
import { TeacherComponent } from './teacher/teacher.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'teacher', component:TeacherComponent  },
];

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TaskListComponent } from './task-list/task-list.component';
import { RegistrationComponent } from './registration/registration.component';
import { CreateTaskComponent } from './create-task/create-task.component';


export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'login', component: LoginComponent},
    { path: 'callback', component: LoginComponent},
    { path: 'tasks', component: TaskListComponent},
    { path: 'create', component: CreateTaskComponent},
    { path: 'onboard',component: RegistrationComponent}
];

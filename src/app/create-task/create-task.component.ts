import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getHeadersWithAuthorization } from '@acusti/aws-signature-v4';
import { ACCESS_KEY_ID, API, ID_TOKEN, REGION, SECRET_KEY, SERVICE, SESSION_TOKEN } from '../app.const';
import { Router, ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { customPayload } from '../task-list/jwt.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){}

  isAdmin: boolean = false;

  taskForm= new FormGroup({
      name: new  FormControl(''),
      description: new FormControl(''),
      responsibility: new FormControl(''),
      deadline: new FormControl('')
    })

    ngOnInit(): void {
      const token = localStorage.getItem(ID_TOKEN);
      if(token) {
        const decoded = jwtDecode<customPayload>(token);
        if(decoded['cognito:groups'] != undefined && decoded['cognito:groups'] != null) {
          this.isAdmin = decoded['cognito:groups']?.includes("Admins");  
        }
      }
    }
    
    async createTask() {
      const name= this.taskForm.value.name;
      const description= this.taskForm.value.description;
      const responsibility= this.taskForm.value.responsibility;
      const deadline = this.taskForm.value.deadline?new Date(this.taskForm.value.deadline).toISOString():"";
      console.log(deadline);
      const accessKeyId = localStorage.getItem(ACCESS_KEY_ID);
      const secretAccessKey = localStorage.getItem(SECRET_KEY);
      const sessionToken = localStorage.getItem(SESSION_TOKEN);
      if( accessKeyId != null && secretAccessKey != null && sessionToken != null) {
        const body = JSON.stringify({
          name: name,
          description: description,
          responsibility: responsibility,
          deadline: deadline
        })
        const headers = await getHeadersWithAuthorization(
          API+'task',
          {  body,method: 'POST'},
          {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            sessionToken: sessionToken,
            service: SERVICE,
            region: REGION
          }
        );
        const response = await fetch(API+'task',{body, headers,method:'POST'});
        console.log(response);
        if(response.status === 201 || response.status === 200) {
          this.router.navigate(['tasks']);
        }
      }

    }
    routeToTasks(){
      this.router.navigate(['tasks']);
    }
    
    routeToUsers(){
      this.router.navigate(['onboard']);
    }
}

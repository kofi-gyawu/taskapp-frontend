import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getHeadersWithAuthorization } from '@acusti/aws-signature-v4';
import { ACCESS_KEY_ID, API, REGION, SECRET_KEY, SERVICE, SESSION_TOKEN } from '../app.const';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){}

  taskForm= new FormGroup({
      name: new  FormControl(''),
      description: new FormControl(''),
      responsibility: new FormControl('')
    })

    async createTaskt() {
      const name= this.taskForm.value.name;
      const description= this.taskForm.value.description;
      const responsibility= this.taskForm.value.responsibility;
      const accessKeyId = localStorage.getItem(ACCESS_KEY_ID);
      const secretAccessKey = localStorage.getItem(SECRET_KEY);
      const sessionToken = localStorage.getItem(SESSION_TOKEN);
      if( accessKeyId != null && secretAccessKey != null && sessionToken != null) {
        const body = JSON.stringify({
          name: name,
          description: description,
          responsibility: responsibility
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
}

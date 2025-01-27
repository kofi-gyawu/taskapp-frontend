import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getHeadersWithAuthorization } from '@acusti/aws-signature-v4';


@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent {
  taskForm= new FormGroup({
      name: new  FormControl(''),
      description: new FormControl(''),
      responsibility: new FormControl('')
    })

    async createTaskt() {
      const name= this.taskForm.value.name;
      const description= this.taskForm.value.description;
      const responsibility= this.taskForm.value.responsibility;
      const accessKeyId = localStorage.getItem("accessKeyId");
      const secretAccessKey = localStorage.getItem("secretKey");
      const sessionToken = localStorage.getItem("sessionToken");
      if( accessKeyId != null && secretAccessKey != null && sessionToken != null) {
        const body = JSON.stringify({
          name: name,
          description: description,
          responsibility: responsibility
        })
        const headers = await getHeadersWithAuthorization(
          'https://momiq1uwd9.execute-api.eu-central-1.amazonaws.com/task',
          {  body,method: 'POST'},
          {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            sessionToken: sessionToken,
            service: "execute-api",
            region: "eu-central-1"
          }
        );
        const response = await fetch('https://momiq1uwd9.execute-api.eu-central-1.amazonaws.com/task',{body, headers,method:'POST'});
        console.log(response);
      }

    }
}

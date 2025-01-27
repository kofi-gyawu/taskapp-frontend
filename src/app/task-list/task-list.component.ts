import { Component } from '@angular/core';
import { TaskcardComponent } from "./taskcard/taskcard.component";
import { CommonModule } from '@angular/common';
import { Task } from './task.model';
import { getHeadersWithAuthorization } from '@acusti/aws-signature-v4';

@Component({
  selector: 'app-task-list',
  imports: [TaskcardComponent,CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  tasks: Task[] = [
    {
      id: "1",
      name: "task1",
      description: "first task",
      Status: "open",
      deadline: 1,
      responsibility: "me",
      completed_at: "",
      comment: ""
    },
    {
      id: "1",
      name: "task1",
      description: "first task",
      Status: "open",
      deadline: 1,
      responsibility: "me",
      completed_at: "",
      comment: ""
    }
  ];

  async getTasks(){
    const id_token = localStorage.getItem("id_token");
    const accessKeyId = localStorage.getItem("accessKeyId");
    const secretAccessKey = localStorage.getItem("secretKey");
    const sessionToken = localStorage.getItem("sessionToken");
    console.log(id_token,accessKeyId,secretAccessKey,sessionToken);
    if( accessKeyId != null && secretAccessKey != null && sessionToken != null) {
      const body = JSON.stringify({
        id: id_token
      })
      const headers = await getHeadersWithAuthorization(
        'https://momiq1uwd9.execute-api.eu-central-1.amazonaws.com/task',
        {  body,method: 'GET'},
        {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
          sessionToken: sessionToken,
          service: "execute-api",
          region: "eu-central-1"
        }
      );
      const response = await fetch('https://momiq1uwd9.execute-api.eu-central-1.amazonaws.com/task',{body, headers,method:'GET'});
      console.log(response);
      // if(response.status == 200 && response.body != null) {
      //   this.tasks = response.body as Task[];
      // }
      if (response.status === 200 && response.body !== null) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let result = '';
        
        // Read the stream
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value, { stream: true });
        }
    
        // Assuming the result is JSON formatted
        this.tasks = JSON.parse(result); // Convert JSON string to Task[]
    }
    }
  }
}


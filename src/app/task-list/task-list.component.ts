import { Component, OnInit } from '@angular/core';
import { TaskcardComponent } from "./taskcard/taskcard.component";
import { CommonModule } from '@angular/common';
import { Task } from './task.model';
import { getHeadersWithAuthorization } from '@acusti/aws-signature-v4';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from "jwt-decode";
import { ID_TOKEN } from '../app.const';
import { customPayload } from './jwt.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  imports: [TaskcardComponent,CommonModule],
  providers: [ToastrService],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit{
  tasks: Task[] = [];
  isAdmin: boolean = false;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ){}
  ngOnInit(): void {
    this.getTasks();
    const token = localStorage.getItem(ID_TOKEN);
    if(token) {
      const decoded = jwtDecode<customPayload>(token);
      if(decoded['cognito:groups'] != undefined && decoded['cognito:groups'] != null) {
        this.isAdmin = decoded['cognito:groups']?.includes("Admins");  
      }
    }
    
  }
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
        'https://momiq1uwd9.execute-api.eu-central-1.amazonaws.com/tasks',
        {  body,method: 'POST'},
        {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
          sessionToken: sessionToken,
          service: "execute-api",
          region: "eu-central-1"
        }
      );
      const response = await fetch('https://momiq1uwd9.execute-api.eu-central-1.amazonaws.com/tasks',{body, headers,method:'POST'})
      if(!response.ok) {
        this.toastr.error("Couldnt fetch list");
      } else {
        this.toastr.success("success");
        this.tasks = await response.json();
      }
    }
  }

  routeToCreateTask(){
    this.router.navigate(['create']);
  }
  routeToRegisterUser(){
    this.router.navigate(['onboard']);
  }
}


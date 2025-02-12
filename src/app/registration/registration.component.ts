import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getHeadersWithAuthorization } from '@acusti/aws-signature-v4';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ID_TOKEN } from '../app.const';
import { customPayload } from '../task-list/jwt.model';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule,HttpClientModule,CommonModule],
  providers: [HttpClient,ToastrService],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent  implements OnInit{
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  isAdmin: boolean = false;
  registerForm= new FormGroup({
    email: new  FormControl('')
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

  async registerUser () {
    const email = this.registerForm.value.email;
    const accessKeyId = localStorage.getItem("accessKeyId");
    const secretAccessKey = localStorage.getItem("secretKey");
    const sessionToken = localStorage.getItem("sessionToken");
    console.log(email,accessKeyId,secretAccessKey,sessionToken);
    if( accessKeyId != null && secretAccessKey != null && sessionToken != null) {
      const body = JSON.stringify({
        email: email,
        password: "xxxxxx"
      })
      const headers = await getHeadersWithAuthorization(
        'https://momiq1uwd9.execute-api.eu-central-1.amazonaws.com/signup',
        {  body,method: 'POST'},
        {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
          sessionToken: sessionToken,
          service: "execute-api",
          region: "eu-central-1"
        }
      );
      const response = await fetch('https://momiq1uwd9.execute-api.eu-central-1.amazonaws.com/signup',{body, headers,method:'POST'});
      if(response.status === 201 || response.status === 200) {
        this.toastr.success("created")
        this.router.navigate(['tasks']);
      } else {
        this.toastr.error("couldnt create")
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

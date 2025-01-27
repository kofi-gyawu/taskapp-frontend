import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getHeadersWithAuthorization } from '@acusti/aws-signature-v4';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule,HttpClientModule],
  providers: [HttpClient],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  constructor(private http: HttpClient){}
  
  registerForm= new FormGroup({
    email: new  FormControl('')
  })
  
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
      console.log(response);
    }
  }
}

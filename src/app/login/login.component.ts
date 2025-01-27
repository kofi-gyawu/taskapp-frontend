import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Credentials } from './credentials.model';

@Component({
  selector: 'app-login',
  imports: [HttpClientModule],
  providers: [HttpClient],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ){}
  
  ngOnInit(): void {
    this.route.fragment.subscribe(params => {
      let fragment = params;
      fragment?.indexOf("&")
      let id_token = fragment?.slice(9,fragment?.indexOf("&"));
      if(id_token != null ) {
        localStorage.setItem("id_token",id_token);
        this.authenticate(id_token);
      }
    }) 
  }

  redirectToCognito(){
    window.location.href = "https://sam-app-sam-app.auth.eu-central-1.amazoncognito.com/login?client_id=6f6vrq6b2o1gt90fj9tisses1r&redirect_uri=http://localhost:3000/callback&response_type=token"
  }

  async authenticate(id_token: string) {
    console.log(id_token)
    this.http.post('https://momiq1uwd9.execute-api.eu-central-1.amazonaws.com/auth',{
      id:id_token
    }).subscribe(response => {
      const credentials = response as Credentials;
      localStorage.setItem("accessKeyId",credentials.accessKeyId);
      localStorage.setItem("secretKey",credentials.secretKey);
      localStorage.setItem("sessionToken",credentials.sessionToken);
      if(credentials) {
        this.router.navigate(['tasks']) 
      }
    })
  }
}

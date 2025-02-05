import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Credentials } from './credentials.model';
import { ToastrService } from 'ngx-toastr';
import { API } from '../app.const';

@Component({
  selector: 'app-login',
  imports: [HttpClientModule],
  providers: [HttpClient,ToastrService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
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
    // window.location.href = "https://sam-app-sam-app.auth.eu-central-1.amazoncognito.com/login?client_id=6f6vrq6b2o1gt90fj9tisses1r&redirect_uri=http://localhost:4200/callback&response_type=token"
    window.location.href = "https://sam-app-sam-app.auth.eu-central-1.amazoncognito.com/login?client_id=6f6vrq6b2o1gt90fj9tisses1r&redirect_uri=https://main.d2999je8ebi5mc.amplifyapp.com/callback&response_type=token"
  }

  async authenticate(id_token: string) {
    this.http.post(API+'auth',{
      id:id_token
    }).subscribe(response => {
      const credentials = response as Credentials;
      localStorage.setItem("accessKeyId",credentials.accessKeyId);
      localStorage.setItem("secretKey",credentials.secretKey);
      localStorage.setItem("sessionToken",credentials.sessionToken);
      this.toastr.success("Logged In")
      if(credentials) {
        this.router.navigate(['tasks']) 
      }
    })
  }
}

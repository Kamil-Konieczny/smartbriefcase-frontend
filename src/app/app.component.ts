import {Component, OnInit} from '@angular/core';
import {AppService} from "./app.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-jwt';
  email = '';
  password = '';
  //documents: Document[];

  confirmedEmail = '';
  loggedIn = false;


  constructor(private appService: AppService, private router: Router) {
  }

  ngOnInit() {
    this.checkUserLoggedIn();
  }

  checkUserLoggedIn() {
    let email = localStorage.getItem("email");
    let token = localStorage.getItem("token");
    if (token && email) {
      this.loggedIn = true;
    }
  }

  login() {
    console.log('email' + this.email);
    let payload = {email: this.email, password: this.password};

    this.appService.loginApi(payload).subscribe((res: any) => {
      this.confirmedEmail = res.email;
      this.router.navigate(["/documents"]).then(() => {
        // Refresh the page after the redirection
        window.location.reload();
      });
      localStorage.setItem('email', res.email);
      localStorage.setItem('token', res.accessToken);
    })
  }

}

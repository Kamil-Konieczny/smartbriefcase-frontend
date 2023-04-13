import { Component, OnInit } from '@angular/core';
import {AppService} from "../../app.service";
import {Observable, of, switchMap} from "rxjs";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";

@Component({
  selector: 'app-documents-page',
  templateUrl: './documents-page.component.html',
  styleUrls: ['./documents-page.component.css']
})
export class DocumentsPageComponent implements OnInit {
  documents!: Observable<Document[]>;
  private selectedFile!: File;

  constructor(private appService: AppService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    let email = localStorage.getItem("email");
    let token = localStorage.getItem("token");
    if (token && email) {
      this.appService.getDocumentsByEmail(token, email).subscribe((res: any) => {
        this.documents = of(res);
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  uploadFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files) {
      this.selectedFile = target.files[0];
      console.log(target.files[0]);
    }
  }
  sendDocument() {
    let token = localStorage.getItem("token");
    let email = localStorage.getItem("email");
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    if(token && email){
      this.appService.sendDocument(token, email , formData);
     }
    window.location.reload();
  }


  logout() {
    // Clear the JWT token from local storage
    localStorage.removeItem("token");
    // Redirect the user to the login page
    this.router.navigate(["/"]).then(() => {
      // Refresh the page after the redirection
      window.location.reload();
    });
  }

}
export interface Document
{
  email: string;
  name: string;
  extension: string;
  date: string;
  fileBytes: string;

}

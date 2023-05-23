import { Component, OnInit } from '@angular/core';
import {AppService} from "../../app.service";
import {Observable, of, switchMap} from "rxjs";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FileSaverService  } from 'ngx-filesaver';


@Component({
  selector: 'app-documents-page',
  templateUrl: './documents-page.component.html',
  styleUrls: ['./documents-page.component.css']
})
export class DocumentsPageComponent implements OnInit {
  documents!: Observable<Document[]>;
  private selectedFile!: File;
  keyword: string = '';
  divDisplay = 'none';
  constructor(private appService: AppService,
              private route: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer,
              private fileSaverService: FileSaverService) {
  }

  sanitizeSubtext(subtext: string): SafeHtml {
    console.log(this.sanitizer.bypassSecurityTrustHtml(subtext));
    return this.sanitizer.bypassSecurityTrustHtml(subtext);
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
    }}

   getDocsByKeyword(keyword: string){
    let email = localStorage.getItem("email");
    let token = localStorage.getItem("token");
    if (token && email) {
     this.appService.getDocumentsByEmail(token, email, keyword).subscribe((res: any) => {
        this.documents = of(res);
      });
    } else {
    this.router.navigate(['/']);
  }}

  getDocsByTitle(title: string){
    let email = localStorage.getItem("email");
    let token = localStorage.getItem("token");
    if (token && email) {
     this.appService.getDocumentsByEmail(token, email, undefined, title).subscribe((res: any) => {
        this.documents = of(res);
      });
    } else {
    this.router.navigate(['/']);
  }}

  getDocsByDate(minDate: string, maxDate: string){
  let email = localStorage.getItem("email");
  let token = localStorage.getItem("token");
  if (token && email) {
     this.appService.getDocumentsByEmail(token, email, undefined, undefined, minDate, maxDate).subscribe((res: any) => {
        this.documents = of(res);
      });
   } else {
   this.router.navigate(['/']);
  }}

  getDocsByWordNumber(minWordsNumber: string, maxWordsNumber: string){
  let email = localStorage.getItem("email");
  let token = localStorage.getItem("token");
  if (token && email) {
  this.appService.getDocumentsByEmail(token, email, undefined, undefined, undefined, undefined, minWordsNumber, maxWordsNumber).subscribe((res: any) => {
        this.documents = of(res);
      });
   } else {
   this.router.navigate(['/']);
  }}

  showDiv() {
 if (this.divDisplay === 'inline-block') {
    this.divDisplay = 'none';
  } else {
    this.divDisplay = 'inline-block';
  }}

  uploadFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files) {
      this.selectedFile = target.files[0];
      console.log(target.files[0]);
    }
  }

  remove(document: Document) {
   let token = localStorage.getItem("token");
   if(token){
     this.appService.deleteDocument(token, document.id);
    }
  setTimeout(() => {
         window.location.reload();
        }, 1000);
  }

  download(document : Document){
     const token = localStorage.getItem('token');
      if (token) {
        this.appService.downloadFile(token, document.id).subscribe((response) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const filename = document.title+'.'+document.extension
          this.fileSaverService.save(blob, filename);
        });
      }
  }

  sendDocument() {
    let token = localStorage.getItem("token");
    let email = localStorage.getItem("email");
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    if(token && email){
      this.appService.sendDocument(token, email, formData);
     }
     setTimeout(() => {
       window.location.reload();
      }, 5000);
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
  id : string;
  email: string;
  title: string;
  extension: string;
  date: string;
  fileBytes: string;
  subtext: string;
}

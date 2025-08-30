import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { SpinnerService } from '../shared/spinner/spinner.service';
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword,signOut } from "firebase/auth";


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;
    auth: any
    constructor(private http: HttpClient, private spinner: SpinnerService) {
        const app = initializeApp(environment.firebaseConfig);
        this.auth = getAuth(app);
        this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('currentAdmin') ? JSON.parse(localStorage.getItem('currentAdmin')) : null);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string,data:any) {
        this.showspinner();
        return new Promise((resolve, reject) => {
            signInWithEmailAndPassword(this.auth, username, password)
                .then((userCredential) => {
                    const user:any = userCredential.user;
                   if(data.webaccess==="1"){

                       localStorage.setItem(data.access,JSON.stringify(data))
                   }
                    localStorage.setItem('currentAdmin', JSON.stringify(user.uid));
                    localStorage.setItem('accessToken', JSON.stringify(user.accessToken))
                    this.currentUserSubject.next(user.uid);
                    setTimeout(() => {
                        this.hidespinner()
                    }, 1000);
                    resolve(user);
                })
                .catch((error) => {
                    this.hidespinner();
                    reject(error);
                });
        });


        // return this.http.post<any>(`${environment.apiUrl}admin`, { username, password }, { withCredentials: true })
        //     .pipe(map(user => {

        //         if (user && user.data && user.data.status == 1) {
        //             // store user details and jwt token in local storage to keep user logged in between page refreshes
        //             localStorage.setItem('currentAdmin', JSON.stringify(user.data));
        //             this.currentUserSubject.next(user.data);
        //         };
        //         setTimeout(() => {
        //             this.hidespinner()
        //         }, 1000);
        //         return user;
        //     }));
    }

    updateBrands(id) {
        return this.http.post<any>(environment.apiUrl + 'brands/edit', id);
    }

    addBrands(brands: any) {
        return this.http.post(`${environment.apiUrl}brands/save`, brands);
    }

    addWeb(webbrands: any) {
        return this.http.post(`${environment.apiUrl}banners/websave`, webbrands);
    }



    logout(): Promise<void> {
        return new Promise((resolve, reject) => {
          this.showspinner();
          signOut(this.auth).then(() => {
            console.log("Logout the user successfully");
      
            localStorage.removeItem('currentAdmin');
            localStorage.clear();
      

            this.currentUserSubject.next(null);
            // this.hidespinner();
            resolve();
          }).catch((error) => {
            console.log(error);
      
            // Hide spinner and reject the promise
            this.hidespinner();
            reject(error);
          });
        });
      }

      
    //   logout() {
    //     this.showspinner();
    //     // remove user from local storage to log user out
      
    //     signOut(this.auth).then(() => {
    //         console.log("logout the user successfully");
    //         localStorage.removeItem('currentAdmin');
    //         // localStorage.removeItem('accessToken');
    //         localStorage.clear()
           
    //       }).catch((error) => {
    //         console.log(error)
    //       });
    //     this.currentUserSubject.next(null);
    //     // setTimeout(() => {
    //     //     this.hidespinner()
    //     // }, 1000);

    // } 
      

    private showspinner() {
        this.spinner.Spinner('show');
    }
    private hidespinner() {
        this.spinner.Spinner('hide');
    }
}
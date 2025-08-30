import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, onAuthStateChanged, getAuth,updatePassword, signInWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { from } from 'rxjs';
import { collection, query, where, getDocs ,getFirestore } from "firebase/firestore"
import { SpinnerService } from '../shared/spinner/spinner.service';


@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {
  auth:any
  db: any;
  constructor(private spinner:SpinnerService) {
    const app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(app);
    this.db = getFirestore(app);
  }

  createAccount(email: string, password: string) {
    console.log(email,password);
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        return user
      })
      .catch((error) => {
        debugger;
        const errorCode = error.code;
        const errorMessage = error.message;
        throw errorCode
      })

    )
  }

   async checkmobileexsist(data){  //this is used to check whether the mobile number already exsisted in the data in firestore
    const q = query(collection(this.db, "UserNode"), where("mobile", "==", data));

    const querySnapshot = await getDocs(q);
    let size=querySnapshot.size
    return size
  }
  async checkemailaddress(data){
    const q=query(collection(this.db,"User Node"))
  }

  authstatechangecheck(){
  
    onAuthStateChanged(this.auth, (user) => {

      if (user) {
        const uid = user.uid;
        console.log(uid)
      } else {
        console.log("why you are reaching here");
        
      }
    });
  }

//   async changePassword(data:any) {
//     const auth = getAuth();
//     const user = auth.currentUser;
//     return new Promise(async(resolve,reject)=>{
//       if (user) {
    
//         const credential = EmailAuthProvider.credential(user.email as string, data.currpassword);
//         console.log(credential)
//         await reauthenticateWithCredential(user, credential);
//             updatePassword(user, data.password).then((res) => {
          
//             resolve( {status:true,message:"password updated succesfully"})
//         }).catch((error) => {
//             console.error("Error updating password:", error);
//             reject({error:error,status:false,message:"error occured while updating the password"})
      
//         });
//       } else {
//           console.error("No user is currently signed in");
//       }
//     })
    
// }

  async changePassword(data: any) {
    const auth = getAuth();
    const user = auth.currentUser;
  
    return new Promise(async (resolve, reject) => {
      if (user) {
        try {
          const credential = EmailAuthProvider.credential(user.email as string, data.currpassword);
          console.log(credential);

          await reauthenticateWithCredential(user, credential);
  
          await updatePassword(user, data.password);
          resolve({ status: true, message: "Password updated successfully" });
        } catch (error) {
          console.error("Error updating password:", error);
  
          reject({ error: error, status: false, message: "Error occurred while updating the password" });
        }
      } else {
        console.error("No user is currently signed in");
        reject({ status: false, message: "No user is currently signed in" });
      }
    });
  }
  


    private showspinner() {
        this.spinner.Spinner('show');
    }
    private hidespinner() {
        this.spinner.Spinner('hide');
    } 

} 

  // async changePassword(data:any){
  //   const auth = getAuth();
  //   // console.log(data)
  //   const user = auth.currentUser;
  //       // console.log(user.email)
  //   // const credential = EmailAuthProvider.credential(user.email as string, data.currpassword);
  //   // console.log(credential)
  //   // await reauthenticateWithCredential(user, credential);

   
  //   updatePassword(user,data.password).then((data)=>{
  //     console.log(data)
      
  //   }).catch((error)=>{
  //     console.log(error)
  
  //   })
 
  // }
 


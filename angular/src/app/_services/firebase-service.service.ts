import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, onAuthStateChanged, getAuth,updatePassword, signInWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { from } from 'rxjs';
import { collection, query, where, getDocs, getFirestore, doc, runTransaction, writeBatch, updateDoc, getDocFromServer } from "firebase/firestore"
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { SpinnerService } from '../shared/spinner/spinner.service';


@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {
  auth:any
  db: any;
  storage: any;
  constructor(private spinner:SpinnerService) {
    const app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(app);
    this.db = getFirestore(app);
    this.storage = getStorage(app);
  }

  async uploadInstitutionPhoto(file: File): Promise<string> {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const photoRef = ref(this.storage, `institutions/${Date.now()}-${safeName}`);
    await uploadBytes(photoRef, file, { contentType: file.type });
    return getDownloadURL(photoRef);
  }

  async uploadUniversityContent(collegeId: string, categoryName: string, file: File): Promise<string> {
    const safeCategory = categoryName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileRef = ref(
      this.storage,
      `university-content/${collegeId}/${safeCategory}/${Date.now()}-${safeName}`
    );
    await uploadBytes(fileRef, file, { contentType: file.type || 'application/octet-stream' });
    return getDownloadURL(fileRef);
  }

  async getUniversityCollections(): Promise<any[]> {
    const snapshot = await getDocs(collection(this.db, 'UniversityCollection'));
    const records: any[] = snapshot.docs
      .map(item => ({
        _id: item.id,
        ...item.data(),
        category: Array.isArray(item.data()['category']) ? item.data()['category'] : []
      }));
    const unique = new Map<string, any>();
    records.forEach(record => {
      const key = record.collegeId || record._id;
      const current = unique.get(key);
      if (!current || record.category.length > current.category.length) unique.set(key, record);
    });
    return Array.from(unique.values())
      .sort((a: any, b: any) => (a.collegeName || '').localeCompare(b.collegeName || ''));
  }

  async syncExistingInstitutionsToUniversities(): Promise<number> {
    const [companiesSnapshot, universitiesSnapshot] = await Promise.all([
      getDocs(query(collection(this.db, 'UserNode'), where('access', '==', 'company'))),
      getDocs(collection(this.db, 'UniversityCollection'))
    ]);
    const linkedIds = new Set(universitiesSnapshot.docs.map(item => item.data()['collegeId']));
    const missing = companiesSnapshot.docs.filter(item => !linkedIds.has(item.id));

    for (let offset = 0; offset < missing.length; offset += 450) {
      const batch = writeBatch(this.db);
      missing.slice(offset, offset + 450).forEach(companyDoc => {
        const company: any = companyDoc.data();
        batch.set(doc(this.db, 'UniversityCollection', companyDoc.id), {
          category: [],
          collegeId: companyDoc.id,
          collegeName: company.companyname || company.college || company.name || '',
          contentlibrary: 'active',
          fourcards: 'active',
          interactive: 'active',
          languagelab: 'active',
          photo: company.photo || '',
          search: 'active',
          semster: 'inactive'
        });
      });
      await batch.commit();
    }
    return missing.length;
  }

  async addUniversityContentMetadata(
    universityId: string,
    categoryName: string,
    contentTitle: string,
    fileUrl: string
  ): Promise<void> {
    const universityRef = doc(this.db, 'UniversityCollection', universityId);
    await runTransaction(this.db, async transaction => {
      const snapshot = await transaction.get(universityRef);
      if (!snapshot.exists()) throw new Error('University document not found');

      const data: any = snapshot.data();
      const categories: any[] = Array.isArray(data.category) ? [...data.category] : [];
      const normalizedName = categoryName.trim();
      const index = categories.findIndex(category =>
        category?.name?.toLowerCase() === normalizedName.toLowerCase()
      );
      const subcategoryItem = { text: contentTitle.trim(), link: fileUrl };

      if (index >= 0) {
        const subcategory = Array.isArray(categories[index].subcategory)
          ? categories[index].subcategory
          : [];
        categories[index] = {
          ...categories[index],
          subcategory: [...subcategory, subcategoryItem]
        };
      } else {
        const nextOrder = categories.reduce((largest, category) => {
          const order = Number(category?.order) || 0;
          return Math.max(largest, order);
        }, 0) + 1;
        categories.push({
          name: normalizedName,
          order: String(nextOrder),
          subcategory: [subcategoryItem]
        });
      }

      transaction.update(universityRef, { category: categories });
    });
  }

  async updateUniversityFeature(
    universityId: string,
    collegeId: string,
    field: 'contentlibrary' | 'fourcards' | 'interactive' | 'languagelab' | 'search',
    enabled: boolean
  ): Promise<any> {
    const expectedStatus = enabled ? 'active' : 'inactive';
    const linkedDocuments = collegeId
      ? await getDocs(query(
          collection(this.db, 'UniversityCollection'),
          where('collegeId', '==', collegeId)
        ))
      : null;
    const universityRef = linkedDocuments && !linkedDocuments.empty
      ? linkedDocuments.docs[0].ref
      : doc(this.db, 'UniversityCollection', universityId);

    await updateDoc(universityRef, { [field]: expectedStatus });
    const updatedDocument = await getDocFromServer(universityRef);
    if (!updatedDocument.exists()) throw new Error('University document not found');
    const updatedData: any = updatedDocument.data();
    if (updatedData[field] !== expectedStatus) {
      throw new Error(`Firebase did not save ${field} as ${expectedStatus}`);
    }
    return {
      _id: updatedDocument.id,
      ...updatedData,
      category: Array.isArray(updatedData.category) ? updatedData.category : []
    };
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
  
async resetPasswordByEmail(data: any) {
    const { email, currentPassword, newPassword } = data;
    return new Promise(async (resolve, reject) => {
      try {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, currentPassword);
        const user = userCredential.user;
        await updatePassword(user, newPassword);
        resolve({ status: true, message: 'Password updated successfully' });
      } catch (error) {
        console.error('Error resetting password:', error);
        reject({ error: error, status: false, message: 'Error occurred while resetting the password' });
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
 

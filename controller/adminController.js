const XLSX  =require("xlsx");
const moment=require("moment")
const {admin}=require("../config/firebaseConfig")
const firebbase = require("firebase-admin");
const SmptSchema =require("../model/stmpt")
const https=require("https")
const momenttz=require("moment-timezone")
const practicedb = require("../model/practiceSchema");
const { Console } = require("console");

const fs = require('fs/promises');

const schedule = require('node-schedule');
//'*/20 * * * * *' Run on every 20 seconds
//'50 23 * * *' Run on every night 11.50 pm

// const job =  schedule.scheduleJob('50 23 * * *', function(){
   
//     console.log('Time for tea!');
//     console.log(new Date())
//     getdata();

//   });

async function getdata(){
    //console.log("test")
    let collectionRef=admin.firestore().collection("UserNode").where('access',"==","company").where("status","=",'1');//.where("subscriptionenddate","!=",'undefined').where("subscriptionenddate","<=",new Date());
    const prolabsnapshot= await collectionRef.get();
    let snapc=prolabsnapshot.docs.map(s=>s.data())
    var res=snapc.filter(k=> new Date(k.subscriptionenddate)<=new Date() )
    //console.log("rest len ",res.length)
    res.forEach(async s=>{
        if(s.subscriptionenddate && s.subscriptionenddate !=undefined){
            await admin.firestore().collection("UserNode").doc(s._id).update({ status: "2" });
           
            // let userRef=admin.firestore().collection("UserNode").where('access',"==","App User").where("status","=",'1').where("companyid","==",s._id);
            // const prolabsnapshot222= await userRef.get();
            // let snap2c=prolabsnapshot222.docs.map(s=>s.data())
            // if(snap2c.length !=0){
            //     snap2c.forEach(u=>{
            //         admin.firestore().collection("UserNode").doc(u._id).update({ status: "2" });
            //     })
            // }
        }
    });
  
    

}
// const admin = require("firebase-admin")
// const firebase=require('firebase')
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// })


//**************************************************************************************** Admin ******************************************************************************************************** */

const roleCheck = async (req, res) => { // used to check the role of the login admin
    try {
        let { email } = req.body
        const usersRef = admin.firestore().collection('UserNode');
        const querySnapshot = await usersRef.where('email', '==', email).get();

        if (querySnapshot.empty) {
            return res.send({ message: 'Unautherizes Access', status: false })
        }
        let userData = [];
        querySnapshot.forEach(doc => {
            userData.push(doc.data());
        });
        console.log(userData)
        res.send({ message: "successfull", data: userData[0], status: true })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "somthing went wrong!contact Admin", status: false })
    }
}


const postLogin = async (req, res) => { // for login implemting login currenly not in use
    let email = req.body.email
    let password = req.body.password
  
    try {
        const userRecord = await admin.auth().getUserByEmail(email)
       
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Somthing Went wrong", status: false })
    }
}


const subAdminslist = async (req, res) => {
    try {
        let data = [];
        let queryByName = admin.firestore().collection('UserNode').where("access", "==", "subAdmin").where("status", "in", ["1", "2"]).orderBy('createAt', 'desc');
        let queryByEmail = admin.firestore().collection('UserNode').where("access", "==", "subAdmin").where("status", "in", ["1", "2"]).orderBy('createAt', 'desc');
        
        // Check if search parameter exists and perform a search on both name and email
        if (req.body.search) {
            const searchTerm = req.body.search.trim().toLowerCase(); // Make sure to trim any extra spaces.
             console.log(searchTerm);
             
            // Perform name query to search using case-insensitive range query
            queryByName = queryByName.where("slugname", ">=", searchTerm)
                                     .where("slugname", "<=", searchTerm + "\uf8ff");

            // Perform email query to search using case-insensitive range query
            queryByEmail = queryByEmail.where("email", ">=", searchTerm)
                                       .where("email", "<=", searchTerm + "\uf8ff");

        }
        
        // Execute the queries
        const [snapshotByName, snapshotByEmail] = await Promise.all([queryByName.get(), queryByEmail.get()]);

        // Merge results from both queries into data array
        snapshotByName.forEach(doc => {
            data.push(doc.data());
        });

        snapshotByEmail.forEach(doc => {
            // Check if the document is already in data array to avoid duplicates
            if (!data.some(d => d.email === doc.data().email)) {
                data.push(doc.data());
            }
        });

        // Sort data array by createAt timestamp in descending order
        data.sort((a, b) => b.createAt - a.createAt);

        const count = data.length;

        res.send({ message: "Sub admin list", data: data, status: true, count: count });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Something went wrong", status: false });
    }
};





const createUpdateSubAdmin = async(req, res) => {// for to add/update subadmin to the firestore
    try {
        const actiontype = req.body.actiontype; 
        // console.log(req.body);
        delete req.body.actiontype;
        let data =req.body
        data.webaccess="1"
        data.username=req.body.name
        data.slugname=req.body.name.toLowerCase()
        console.log(data)
     
        // console.log(data)
         if(actiontype==="create"){
            data.createAt=firebbase.firestore.FieldValue.serverTimestamp()
            let docRef=await admin.firestore().collection('UserNode').add(data)
            const id = docRef.id;    
            console.log("+++++++++++++++++++++++++++")
            console.log(id)                                                   
            await admin.firestore().collection("UserNode").doc(id).set({ ...data, _id: id }, { merge: true }).then((result)=>{
                 res.status(200).send({ message: "Subadmin Created Successfully", status: true, });
            })
         
         }else if(actiontype==="update"){
            const snapshot = await admin.firestore().collection("UserNode").where("_id", "==", data._id).get();
            if (!snapshot.empty) {
                const updatePromises = snapshot.docs.map(doc =>
                    admin.firestore().collection("UserNode").doc(doc.id).update(data)
                );
                await Promise.all(updatePromises);
                res.status(200).send({ message: "Sub admin updated successfully", status: true });
            } else {
                res.status(400).send({ message: "No sub admin data is not founded", status: false });
            }
        } 
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "somthing went wrong", status: false })
    }
}


const getSubadmin = async (req, res) => {// for getting the subadmin details
    try {
        let id = req.body.data
        let data = await admin.firestore().collection("UserNode").where("_id", "==", id).get()
        const doc = data.docs[0];
        const docData = doc.data();
        res.status(200).send({message:"sub admin data",status:true,data:docData})
       
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "somthing went wrong", status: false })
    }
}


const deleteSubAdmin = async (req,res)=>{ // for deleting the subadmin
    let id = req.body.ids[0];
    let query = await admin.firestore().collection('UserNode').where("_id", "==", id);

    try {
        const snapshot = await query.get();
        if (!snapshot.empty) {
            await Promise.all(snapshot.docs.map(doc => doc.ref.delete()));
            // console.log("deleted");
            res.send({message: "Subadmin deleted successfully", status: true});
        } else {
           
            res.send({message: "No subadmin found with the given ID", status: false});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Error deleting subadmin", status: false});
    }
}

const permanentDeleteUser = async (req, res) => {
    try {
        const userIds = req.body.ids;

        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).send({ message: "Please select a user", status: false });
        }

        console.log(userIds);
        await Promise.all(userIds.map(id => admin.firestore().collection("UserNode").doc(id).delete()));

        res.send({ message: "User Deleted Successfully", status: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong", status: false });
    }
};




const restoreUser=async(req,res)=>{//for restoring the user form soft delete
    try {
        let userRef= admin.firestore().collection("UserNode").doc(req.body.ids)
       await  userRef.update({
            status:"1"
        })
        res.send({message:"User restored",status:true})
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}


const companyList = async (req,res)=>{// for getting the company list

    // //Company Name update
    // const querySnapshot = await admin.firestore().collection("UserNode").get();
    // var querySnapshot1 = querySnapshot.docs.map(s => s.data())
    // console.log("querySnapshot1")
    // console.log(querySnapshot1.length)
    // querySnapshot1.forEach((doc) => {
    //     if (doc.company) {
    //        // console.log("doc.company Before")

    //         //console.log(doc.company)
    //         var com= doc.company[0].toUpperCase() + doc.company.slice(1);
    //         //doc.company= com;
           
    //        // console.log("doc.company After")

    //         // console.log(doc.company)
    //         // console.log("doc._id........",doc._id)

    //         if(doc._id !=undefined){
    //            // admin.firestore().collection("UserNode").doc(doc._id).update(doc)
    //         }

    //     }
    //     if (doc.team) {
    //         //console.log("doc.team Before")

    //         //console.log(doc.team)
    //         if(Array.isArray(doc.team)){
    //             var arr=[];
    //             doc.team.forEach(s=>{
    //                 s=s[0].toUpperCase() + s.slice(1);
    //                 arr.push(s)
    //             })
    //             doc.team=arr;
                
    //         }
    //         else{
    //             if(doc.team.length==1){
    //                 doc.team= doc.team[0].toUpperCase();

    //             }
    //             else{
    //             doc.team= doc.team[0].toUpperCase() + doc.team.slice(1);
    //             }
    //         }
    //        // console.log("doc.team After")
            
    //         //console.log(doc.team)
    //         //console.log(doc.team.length)
    //         //admin.firestore().collection("UserNode").doc(doc._id).update(doc)
           

    //     }
    //     if (doc.City) {
    //         var ci= doc.City[0].toUpperCase() + doc.City.slice(1);
    //         doc.City= ci;
    //         console.log("doc.city:",doc.City)

    //         //console.log(doc.city)
    //         console.log("doc._id........",doc._id)
    //         if(doc._id !=undefined){
    //             admin.firestore().collection("UserNode").doc(doc._id).update(doc)
    //         }
    //     }
    //     //admin.firestore().collection("UserNode").doc(doc._id).update(doc)
    //    // if (doc.companyname) {
    //         //doc.companyname = doc.companyname[0].toUpperCase() + doc.companyname.slice(1);
    //         // if(doc.city0 && doc.city0.length !=0 ){
    //         //     console.log("City name")
    //         //     var c0=[]
    //         //     doc.city0.forEach(e1 => {
                   
    //         //        try{
                  
    //         //         e1=e1[0].toUpperCase() + e1.slice(1);
    //         //         c0.push(e1)
    //         //         }
    //         //         catch(errr){}
    //         //     });
    //         //     doc.city0=c0
    //         //     console.log(doc.city0)
    //         // }
    //         // if(doc.city1 && doc.city1.length !=0 ){
    //         //     var c2=[]
    //         //     doc.city1.forEach(e2 => {
    //         //         try{
                       
    //         //         e2=e2[0].toUpperCase() + e2.slice(1);
    //         //         c2.push(e2)
                    
    //         //         }
    //         //         catch(er){

    //         //         }
    //         //     });
    //         //     doc.city1=c2
    //         //     console.log("City name")
    //         //     console.log(doc.city1)
    //         // }
    //         // if(doc.role && doc.role.length !=0){
    //         //     console.log("Role name")
    //         //     var ro=[]
    //         //     doc.role.forEach(e3 => {
    //         //         e3=e3[0].toUpperCase() + e3.slice(1);
    //         //         ro.push(e3)
    //         //     });
    //         //     doc.role=ro;
    //         //     console.log(doc.role)
    //         // }
    //         // if(doc.countryCity){
    //         //     console.log("Before");

    //         //     console.log(doc.countryCity);
    //         //     if(doc.countryCity && doc.countryCity.length !=0){
    //         //         var cityobj=[]
    //         //         doc.countryCity.forEach(e1 => {
    //         //             //console.log(e1)
    //         //             country=e1.country[0].toUpperCase() + e1.country.slice(1);
    //         //             var ci=[]
    //         //             e1.city.forEach(e2=>{
    //         //                 e2=e2[0].toUpperCase() + e2.slice(1);
    //         //                 ci.push(e2)
    //         //             })
    //         //             var ct={country:country,city:ci}
    //         //             cityobj.push(ct);
    //         //         });
    //         //         doc.countryCity=cityobj;
    //         //         console.log("After");

    //         //         console.log(doc.countryCity);
    //         //         admin.firestore().collection("UserNode").doc(doc._id).update(doc)

    //         //     }
    //         // }
    //         // if(doc.team){
    //         //     console.log("before");
    //         //     console.log(doc.team)
    //         //     var team=[];

    //         //     doc.team.forEach(e2=>{
    //         //         var te=e2=e2[0].toUpperCase() + e2.slice(1);
    //         //         team.push(e2)
    //         //     })
    //         //     doc.team=team;
    //         //     console.log("Agter");
    //         //     console.log(doc.team)
    //         //     admin.firestore().collection("UserNode").doc(doc._id).update(doc)
    //         // }
    //     //}
    // });
   
    //console.log(req.body)
    try {
    console.log(req.body)
      
        let status=[]
        if(req.body.status===3){
            status=["1","2"]
        }else if(req.body.status===1){
            status=["1"]
        }else if(req.body.status===2){
            status=["2"]
        }else if(req.body.status===0){
            status=["0"]
        }
        let data=[]
        let collectionRef=admin.firestore().collection("UserNode").where('access',"==","company").where("status","in",status)
        // if(req.body.search){
        //     let searchTerm=req.body.search.toLowerCase()
           
        //     collectionRef = collectionRef.where("slugname", ">=", searchTerm)
        //                              .where("slugname", "<=", searchTerm + "\uf8ff");
        // }
        let snapshotCount=await collectionRef.get()
        let count=snapshotCount.size; 
        collectionRef = collectionRef
        .orderBy('status')  // Orders by status, so 1 comes before 2
        .orderBy('createAt', 'desc')  // Orders by createAt within each status group
        .offset(req.body.skip)
        .limit(req.body.limit);
    
        // collectionRef=collectionRef.offset(req.body.skip).limit(req.body.limit).orderBy('createAt','desc'); //here want to add orderBy also to sort the document
        collectionRef.get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                let insertdata=doc.data()
                insertdata._id=doc.id
                data.push(insertdata)
            })
            if(req.body.search){
                data=data.filter(s=>{ 
                    return s.companyname.toLowerCase().includes(req.body.search.toLowerCase()) 
                })
            }
            // data.sort((a, b) => {
            //     if (a.status === "1" && b.status !== "1") {
            //         return -1; // a should come before b
            //     } else if (a.status !== "1" && b.status === "1") {
            //         return 1; // b should come before a
            //     }
            //     return 0; // Keep original order if both have the same status
            // });
            // console.log(allcount,activecoutn,inactivecount,deletecount)
            res.status(200).send({message:"companies list ",status:true,data:data,count:count })
        }).catch((error)=>{
            console.log(error)
            res.status(500).send({message:"somthing went wrong",status:false})
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}


const batchCompanyList=async(req,res)=>{
    try {

       

    //    console.log(req.body)
        let data=[]
        let collectionRef=admin.firestore().collection("UserNode").where('access',"==","company").where("status","in",["1"])
        if(req.body.search){
            let searchTerm=req.body.search.toLowerCase()
            collectionRef = collectionRef.where("slugname", ">=", searchTerm)
                                     .where("slugname", "<=", searchTerm + "\uf8ff");
        }
        let snapshotCount=await collectionRef.get()
        let count=snapshotCount.size; 
     
        collectionRef=collectionRef.offset(req.body.skip).limit(req.body.limit).orderBy('createAt','desc'); //here want to add orderBy also to sort the document
        collectionRef.get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                let insertdata=doc.data()
                insertdata._id=doc.id
                data.push(insertdata)
            })
           
            res.status(200).send({message:"companies list ",status:true,data:data,count:count })
        }).catch((error)=>{
            console.log(error)
            res.status(500).send({message:"somthing went wrong",status:false})
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}


const   addeditcompany = async (req, res) => { //for adding and editing companies
    try {
        let type=req.body.actiontype
        delete req.body.actiontype
        let data = req.body;
        data.webaccess="1"

        let lowercasecity=[]
      
        console.log(data)
        if(type==="create"){
            data.createAt=firebbase.firestore.FieldValue.serverTimestamp()
            data.activeuserscount=0
            data.totalusers=0
            data.trainerscount=0
            data.clientadmincount=0
            data.batchcount=0
            data.college=data.companyname
            //delete data.companyname
            if(data.country0){
                data.country=data.country0;
                //delete data.country0;
            }
            if(data.city0){
                data.city=data.city0;
                //delete data.city0;
            }
            data.joindate = new Date().toISOString()
            const docRef = await admin.firestore().collection("UserNode").add(data)
        
            const id = docRef.id;                                                        //in this way we can add the id manually inside the collection
            await admin.firestore().collection("UserNode").doc(id).set({ ...data, _id: id }, { merge: true }).then((result)=>{
                 res.status(200).send({ message: "Company added", status: true, });
            })
        }else if(type==="update"){


            let data=req.body
            await admin.firestore().collection("UserNode").doc(data._id).update(data);

            //const firestore = firebbase.firestore();
            //const batch = firestore.batch();
    
          
            // const querySnapshot = await admin.firestore().collection("UserNode").where("companyid", "==", data._id).get();
    
            // querySnapshot.forEach((doc) => {
            //     batch.update(doc.ref, { status: data.status });
            // });
    
          
            //await batch.commit();
            res.send({ message: "Update successfully", status: true });
           
        }
       
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong", status: false });
    }
};


const companyDelete = async (req,res)=>{//for deleting the company
    try {
        let ids=req.body.ids
        let batch=admin.firestore().batch()
        ids.forEach((id)=>{
            const batchref=admin.firestore().collection("UserNode").doc(id)
            batch.update(batchref,{status:"0"})

        })
        await   batch.commit()

        res.send({message:"deleted successfully",status:true})
        
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}
const company_subadmin_Delete = async (req,res)=>{//for deleting the company
    try {
        let ids=req.body.ids
        let batch=admin.firestore().batch()
        let count=0
        await Promise.all(ids.map(async(id)=>{
            count++
            const dataRef=admin.firestore().collection("UserNode").doc(id)
            const companyid=(await dataRef.get()).data().companyid
            let comref=admin.firestore().collection("UserNode").doc(companyid)
            comref.update({clientadmincount:firebbase.firestore.FieldValue.increment(-1)})
            const data=(await dataRef.get()).data().uid
            batch.delete(dataRef)
            await admin.auth().deleteUser(data)
        }))

      
        await   batch.commit()

        res.send({message:"deleted successfully",status:true})
        
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}


const getCompany = async (req,res)=>{//for getting the companydetails one at a time
    try {
        // console.log(req.body);
        let id=req.body.data
        let docRef= await admin.firestore().collection("UserNode").doc(id).get()
        let data=docRef.data()
        data._id=docRef.id
        res.status(200).send({message:"company details",data:data,status:true})
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:'somthing went wrong',status:false})
    }
}


const companyStatus = async (req, res) => {
    try {
        console.log(req.body);
        const { id, status } = req.body;
        const data = { status: status };

        // Update the status of the specific document with the provided ID
        await admin.firestore().collection("UserNode").doc(id).update(data);

        // Initialize Firestore and batch
        const firestore = firebbase.firestore();
        const batch = firestore.batch();

        // Retrieve all documents matching the `companyid` to update their status
        const querySnapshot = await admin.firestore().collection("UserNode").where("companyid", "==", id).get();

        querySnapshot.forEach((doc) => {
            batch.update(doc.ref, { status: status });
        });

        // Commit the batch after all updates have been added
        await batch.commit();

        res.send({ message: "Updated successfully", status: true });
    } catch (error) {
        console.error("Error updating company status:", error);
        res.status(500).send({ message: "Something went wrong", status: false });
    }
};

const getUsersList = async (req, res) => {
    try {
      console.log(req.body);
  
      let status = [];
      let reqdata = req.body.filter_action;
      let reqstatus = reqdata.Status;
  
      if (reqstatus === "3") {
        status = ["1", "2"];
      } else if (reqstatus === '1') {
        status = ["1"];
      } else if (reqstatus === '2') {
        status = ["2"];
      } else if (reqstatus === '0') {
        status = ["0"];
      } else {
        status = ["1", "2"];
      }
  
      let query = admin.firestore().collection("UserNode")
        .where('access', '==', 'App User')
        .where('status', 'in', status);
  
      // Apply additional filters if they exist
      
      if (reqdata.Institution) {
        query = query.where("companyid", "==", reqdata.Institution);
      }
      //const usersnapshot=await query.get();
       //console.log("User count , ", usersnapshot.docs.map(s=>s.data()).length)
    //   if (reqdata.City) {
    //     query = query.where(("city").toString().toLowerCase(), "==", "chennai");
    //   }
    //   if (reqdata.Country) {
    //     query = query.where("country", "==", reqdata.Country);
    //   }
    //   if (reqdata.Role) {
    //     query = query.where("role", "==", reqdata.Role);
    //   }
    //   if (reqdata.Team) {
    //     query = query.where("team", "==", reqdata.Team);
    //   }
  
      // Apply From_Date filter
      if (reqdata.From_Date) {
        reqdata.From_Date = moment(reqdata.From_Date).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        console.log(reqdata.From_Date);
        query = query.where("joindate", ">=", reqdata.From_Date);
      }
  
      // Apply To_Date filter
      if (reqdata.To_Date) {
        reqdata.To_Date = moment(reqdata.To_Date).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        console.log(reqdata.To_Date);
        query = query.where("joindate", "<=", reqdata.To_Date);
      }
  
      // Fetch data without applying the search term
      let count = (await query.get()).size;
      const snapshot = await query
        .orderBy('status')  // Sort by status first
        .orderBy('createAt', 'desc') // Sort by createAt within each status group
        .offset(req.body.skip)  // Skip documents for pagination
        .limit(req.body.limit)  // Limit the number of documents fetched
        .get();
  
        let data = [];
        snapshot.forEach(doc => {
            data.push({ _id: doc.id, ...doc.data() });
        });
        console.log("Users list: ",data.length)

        if (reqdata.City) {
            //query = query.where(("city").toString().toLowerCase(), "==", "chennai");

            data = data.filter(s=>s.city.toLowerCase()==reqdata.City.toLowerCase())
        }
        if (reqdata.Country) {
            //query = query.where("country", "==", reqdata.Country);
            data = data.filter(s=>s.country.toLowerCase()==reqdata.Country.toLowerCase())

        }
        if (reqdata.Year) {
            //query = query.where("role", "==", reqdata.Role);
            data = data.filter(s=>s.year.toLowerCase()==reqdata.Year.toLowerCase())

        }
        if (reqdata.Course) {
            //query = query.where("team", "==", reqdata.Team);
            data = data.filter(s=>s.course.toLowerCase()==reqdata.Course.toLowerCase())
        }

      // Perform the search filtering on the client-side (JavaScript)
      if (req.body.search) {
        let searchTerm = req.body.search.toLowerCase();
        console.log("Search term:", searchTerm);
  
        // Filter the data for 'username' and 'mobile'
        data = data.filter(user => {
            
          return (
            user.username && user.username.toLowerCase().includes(searchTerm) || 
            user.mobile && user.mobile.includes(searchTerm)
            ||
            user.email && user.email.includes(searchTerm)

          );
        });
      }
  
      // Return the filtered data
      return res.status(200).send({
        data,
        count,
        message: "Users fetched successfully",
        status: true
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong", statusP: false });
    }
  };
  
  
  
const getUsersLists= async (req, res) => {
    try {
        // console.log(req.body)
        let status = [];
        if (req.body.status === 3) {
            status = ["1", "2"];
        } else if (req.body.status === 1) {
            status = ["1"];
        } else if (req.body.status === 2) {
            status = ["2"];
        } else if (req.body.status === 0) {
            status = ["0"];
        }
                // let allcount=(await admin.firestore().collection("UserNode").where("access","==","App User").where("status","in",["1","2"]).get()).size
                // let activecoutn=(await admin.firestore().collection("UserNode").where("access","==","App User").where("status","==","1").get()).size
                // let inactivecount=(await admin.firestore().collection("UserNode").where("access","==","App User").where("status","==","2").get()).size
                // let deletecount=(await admin.firestore().collection("UserNode").where("access","==","App User").where("status","==","0").get()).size
        let query = admin.firestore().collection("UserNode")
            .where('access', '==', 'App User')
            .where('status', 'in', status);

        if (req.body.search) {
            let searchTerm = req.body.search.toLowerCase();
            let endTerm = searchTerm.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));

           
            const usernameQuery = query.where('username', '>=', searchTerm)
                                      .where('username', '<', endTerm);

            const emailQuery = query.where('email', '>=', searchTerm)
                                   .where('email', '<', endTerm);
            const [usernameSnapshot, emailSnapshot] = await Promise.all([
                usernameQuery.get(),
                emailQuery.get()
            ])

            let data = [];
            usernameSnapshot.forEach(doc => {
                data.push({_id: doc.id, ...doc.data()});
            });
            emailSnapshot.forEach(doc => {
                if (!data.some(item => item._id === doc.id)) {
                    data.push({_id: doc.id, ...doc.data()});
                }
            });
            const count = data.length;
           // res.status(200).send({data,count,message: "Users fetched successfully",status: true,all:allcount??0,active:activecoutn??0,inactive:inactivecount??0,delete:deletecount??0});
           res.status(200).send({
                data,
                count,
                message: "Users fetched successfully",
                status: true,
            });
        } else {
            // Handle case where no search term is provided
            let count=(await query.get()).size
            const snapshot = await query.offset(req.body.skip).limit(req.body.limit).orderBy("createAt","desc").get();
            let data = [];
            snapshot.forEach(doc => {
                data.push({_id: doc.id, ...doc.data()});
            });
            // res.status(200).send({data,count,message: "Users fetched successfully",status: true,all:allcount??0,active:activecoutn??0,inactive:inactivecount??0,delete:deletecount??0});
            res.status(200).send({
                data,
                count,
                message: "Users fetched successfully",
                status: true,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong", status: false });
    }
};



const getcompanynames=async(req,res)=>{//for getting the companynames
    try {
        // console.log("reached here")
        let data=[]
        admin.firestore().collection("UserNode").where("access","==","company").where("status","in",["1","2"]).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                // console.log(doc.data())
                data.push({_id:doc.id,...doc.data()})
            })
            // console.log(data)
            data=data.sort((a,b) => (a.companyname > b.companyname) ? 1 : ((b.companyname > a.companyname) ? -1 : 0))
            data=data.sort((a,b) => (a.college > b.college) ? 1 : ((b.college > a.college) ? -1 : 0))

            res.status(200).send({message:'compnay names',stauts:true,data:data})
        }).catch((error)=>{
            console.log(error)
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong ",status:false})
    }
}


const addedituser = async (req, res) => {
    try {
        let actiontype = req.body.actiontype;
        delete req.body.actiontype;
        let data = req.body;
        data.access = "App User";
        console.log(req.body)
        if (actiontype === "create") {
            let phonecheck = await admin.firestore()
                .collection("UserNode")
                .where("mobile", "==", req.body.mobile)
                .get();
                
            let emailcheck = await admin.firestore()
                .collection("UserNode")
                .where("email", "==", req.body.email)
                .get();
            let result1 = emailcheck.docs.length;
            console.log("Result 1 :"+result1)
            let result = phonecheck.docs.length;
           
            let companyRef = admin.firestore().collection("UserNode").doc(data.companyid);
            let companySnapshot = await companyRef.get();
            let companyData = companySnapshot.data();

            if (companyData.activeuserscount < companyData.activeusers) {
                if (result === 0 && result1 === 0) {
                    await companyRef.update({
                        activeuserscount: firebbase.firestore.FieldValue.increment(1),
                        totalusers: firebbase.firestore.FieldValue.increment(1),
                    });
                    data.createAt = firebbase.firestore.FieldValue.serverTimestamp();
                    data.profile = "User";

                    const length = 12;
                    const lower = 'abcdefghijklmnopqrstuvwxyz';
                    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    const numbers = '0123456789';
                    const symbols = '!@#$';

                    // 1 uppercase letter
                    const firstChar = lower[Math.floor(Math.random() * lower.length)].toUpperCase();

                    // 5 lowercase letters
                    let middle = "";
                    for (let i = 0; i < 5; i++) {
                        middle += lower[Math.floor(Math.random() * lower.length)];
                    }
                    // 1 symbol
                    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
                    // 2-digit number (10–99)
                    const number = Math.floor(10 + Math.random() * 90);
                    //let password = '';
                    let password = `${firstChar}${middle}${symbol}${number}`;

                    // let characters = symbols + lower + upper + numbers;
                    // let password = '';
                    // for (let i = 0; i < length; i++) {
                    //     const randomIndex = Math.floor(Math.random() * characters.length);
                    //     password += characters[randomIndex];
                    // }

                    data.password = password


                    admin.firestore()
                        .collection("UserNode")
                        .add(data)
                        .then((docRef) => docRef.update({ _id: docRef.id }))
                        .then(() => {
                            res.send({ message: "User added successfully", status: true,data:data });
                        })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send({ message: "Something went wrong", status: false });
                        });
                } else {
                    if(result !=0){
                        res.send({ message: "Phone number already exists", status: false });
                    }
                    else if(result1 !=0){
                        res.send({ message: "Email already exists", status: false });
                    }
                }
            } else {
                res.send({ message: "Max active user limit reached", status: false });
            }
        } else if (actiontype === "edit") {
            console.log(req.body.email, "for edit");

            // Query to check if phone exists and not for the same user (_id)
            let phonecheck = await admin.firestore()
                .collection("UserNode")
                .where("mobile", "==", req.body.mobile)
                .where("_id", "!=", data._id)
                .get();
            let emailcheck = await admin.firestore()
                .collection("UserNode")
                .where("email", "==", req.body.email)
                //.where("_id", "!=", data._id)
                .get()
                
             //let eres=   emailcheck.docs.map(s=>s.data())
            //console.log("Emailcheck : ",eres)
            let phoneExists = phonecheck.size > 0;
            let emailExists = emailcheck.docs.some(doc => doc.id !== data._id);
            console.log("Emailcheck : ",emailExists)

            if (!phoneExists) {
                if (!emailExists) {
                    console.log("id : ",data._id)
                    admin.firestore()
                        .collection("UserNode")
                        .doc(data._id)
                        .update(data)
                        .then(() => {
                            res.status(200).send({ message: "Updated successfully", status: true });
                        })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send({ message: "Something went wrong", status: false });
                        });
                } else {
                    res.send({ message: "Email already exists", status: false });
                }
            } else {
                res.send({ message: "Phone number already exists", status: false });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong", status: false });
    }
};


const getuserDetails=async(req,res)=>{//for get user details
    try {
        // console.log("herte")
        // console.log(req.body)
        let id=req.body.id
        let docRef=await  admin.firestore().collection("UserNode").doc(id).get()
        let data=docRef.data()
        data._id=docRef.id
        res.send({message:"userDetails fetched succssfully", status:true,data:data})
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}


const userStatus = async (req, res) => { //for updating the status of the user and changing the count of the active users for the company at the same time

    try {
        let { id, status } = req.body;

        const userDocRef = admin.firestore().collection("UserNode").doc(id);

        await admin.firestore().runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userDocRef);

            if (!userDoc.exists) {
                throw new Error("User document does not exist!");
            }

            const companyId = userDoc.data().companyid;
            const companyDocRef = admin.firestore().collection("UserNode").doc(companyId);

            const companyDoc = await transaction.get(companyDocRef);

            if (!companyDoc.exists) {
                throw new Error("Company document does not exist!");
            }

            const activeuserscount = companyDoc.data().activeuserscount; 
            if(status==2){//here we update the number of the active users according to the status we want to change

                transaction.update(companyDocRef, { activeuserscount: activeuserscount - 1 });
            }else{
                transaction.update(companyDocRef, { activeuserscount: activeuserscount + 1 });

            }

        });

        await admin.firestore().collection("UserNode").doc(id).update({ status: status });

        res.status(200).send({ message: 'status updated', status: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "something went wrong", status: false });
    }
};



// const deleteUser=async(req,res)=>{//for delete the user only change the status to 0=delete 1=active 2=indactive
//     try {
//         console.log(req.body)
//         let id=req.body.ids[0]
//         admin.firestore().collection("UserNode").doc(id).update({status:"0"}).then((result)=>{
//             res.send({message:"deleted successfully",status:true})
//         }).catch((error)=>{
//             res.status(500).send({message:"somthing went wrong",status:false})
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({message:"somthing went wrong",status:false})
//     }
// }

const deleteUser = async (req, res) => {
    try {
        const ids = req.body.ids;
        const batch = admin.firestore().batch();
        
        // ids.forEach(id => {
        //     const userRef = admin.firestore().collection("UserNode").doc(id);
        //     batch.update(userRef, { status: "0" });
        
        // });
        let decreaseactiveuser=0
        let userdata
        for (const id of ids) {
            const userRef = admin.firestore().collection("UserNode").doc(id);
           userdata = (await userRef.get()).data()
            await userRef.delete();
        }

        if(userdata.status==="1"){
            decreaseactiveuser=-1
        }
        await admin.firestore().collection("UserNode").doc(userdata.companyid).update({totalusers:firebbase.firestore.FieldValue.increment(-1),activeuserscount:firebbase.firestore.FieldValue.increment(decreaseactiveuser)})

        await batch.commit();

        res.send({ message: "deleted successfully", status: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "something went wrong", status: false });
    }
};


const bulkuploaduser = async (req, res) => {
    try {
        let skippeddocumets = [];
        let file = req.file;

        if (!file) {
            return res.status(400).send({ message: 'No files uploaded', status: false });
        }

        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const headers = [];
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const address = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!worksheet[address]) continue;
            headers.push(worksheet[address].v);
        }
        if (jsonData.length === 0) {
            return res.send({ message: "Excel sheet has no data", status: false });
        }

        const requiredFields = ['Username', 'Email','Country Code', 'Mobile', "City", "Country", "Course", "Year"];
        const missingFields = requiredFields.filter(field => !headers.includes(field));
        if (missingFields.length > 0) {
            return res.send({ message: `Missing fields like: ${missingFields.join(", ")}`, status: false });
        }

        let docref = await admin.firestore().collection("UserNode").doc(req.body.companyid).get();
        let companydata = docref.data();
        console.log(companydata,'company data for me')
        let currentTotalUsers = companydata.totalusers || 0;
        const activeuserCount = companydata.activeuserscount || 0;
        currentTotalUsers=currentTotalUsers+jsonData.length;
        let rolelist = companydata.year;
        let teamlist = companydata.course;
        let count = 0;
        let insertcount = 0;
        let inserteddata=[];
        let userLimit = companydata.activeusers

        //currentTotalUsers>=userLimit

        const length = 8;
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$*';

        let characters = symbols+lower + upper + numbers  ;
        let password = '';
        
        let datasss = jsonData.map(async (data, index) => {
            console.log(data)
            if (!data.Email || !data.Mobile || !data.Course || !data.Year || !data.Country || !data.City || !data.Username) {
                count++;
                skippeddocumets.push({ name: data.Username || data.Email, reason: "Missing required fields", data });
                return null;
            }

            function excelDateToJSDate(serial) {
                var excelEpoch = new Date(Date.UTC(1899, 11, 30));
                var daysOffset = serial - 1;
                var jsDate = new Date(excelEpoch.getTime() + daysOffset * 86400000);
                jsDate = new Date(jsDate.getTime() + 86400000);
                return jsDate;
            }

            let excelDate = data['Date of joining(dd-mm-yyyy)'];
            let excelDate2 = data['Subscription End Date(dd-mm-yyyy)'];
            
            data.subscriptionenddate = excelDateToJSDate(excelDate2);
            data.subscriptionenddate = data.subscriptionenddate.toISOString();
            data.joindate = excelDateToJSDate(excelDate);
            data.joindate = data.joindate.toISOString();
            data.status = "1";
            data.access = "App User";
            data.username = data.Username;
            data.email = data.Email;
            data.dialCode = data['Country Code']
            data.mobile = data.Mobile.toString();
            data.year = data.Year.toString().trim().toLowerCase();
            data.course = data.Course.trim().toLowerCase();
            data.company = companydata.companyname;
            data.college = companydata.companyname;
            data.city = data.City.toLowerCase();
            data.country = data.Country.toLowerCase();
            data.companyid = req.body.companyid;
            data.createAt = firebbase.firestore.FieldValue.serverTimestamp();

            password="";
            // 1 uppercase letter
            const firstChar = lower[Math.floor(Math.random() * lower.length)].toUpperCase();

            // 5 lowercase letters
            let middle = "";
            for (let i = 0; i < 5; i++) {
                middle += lower[Math.floor(Math.random() * lower.length)];
            }
            // 1 symbol
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            // 2-digit number (10–99)
            const number = Math.floor(10 + Math.random() * 90);
            //let password = '';
            password = `${firstChar}${middle}${symbol}${number}`;
            // for (let i = 0; i < length; i++) {
            //     const randomIndex = Math.floor(Math.random() * characters.length);
            //     password += characters[randomIndex];
            // }
            console.log("Passwprd",password)
            data.password=password;
            let userPhone = await admin.firestore().collection("UserNode")
                .where("mobile", "==", data.mobile)
                .get();

            let userEmail = await admin.firestore().collection("UserNode")
                .where("email", "==", data.email)
                .get();

            let phoneExistsInCompany = userPhone.docs.some(doc => doc.data().companyid === req.body.companyid);
            let emailExistsInCompany = userEmail.docs.some(doc => doc.data().companyid === req.body.companyid);

            let phoneExistsInOtherCompany = userPhone.docs.some(doc => doc.data().companyid !== req.body.companyid);
            let emailExistsInOtherCompany = userEmail.docs.some(doc => doc.data().companyid !== req.body.companyid);

            let issues = {};



            if (emailExistsInCompany) {
                issues.email = { exists: true, reason: "Email already exists in your user list; please use edit user option to update data for this user",status:3 };
            } else if (emailExistsInOtherCompany) {
                issues.email = { exists: true, reason: "Email already exists; please email support@profluentlabs.com to resolve this issue",status:4 };
            } else {
                const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegexp.test(data.email)) {
                    issues.email = { exists: true, reason: "Invalid email format" };
                } else {
                    issues.email = { exists: false, reason: "Valid" };
                }
            }

            if (phoneExistsInCompany) {
                issues.phone = { exists: true, reason: "Phone number already exists in your user list; please use edit user option to update data for this user",status:5 };
            } else if (phoneExistsInOtherCompany) {
                issues.phone = { exists: true, reason: "Phone number already exists; please email support@profluentlabs.com to resolve this issue",status:6 };
            } else if (!data.dialCode) {
                issues.phone = { exists: true, reason: "Invalid phone number",status:7 };
            } else {
                issues.phone = { exists: false, reason: "Valid" ,status:8};
            }

            // previous code has been moved , referance at end of the entire controller -> midhun
            
            if (rolelist.map(year => year.trim().toLowerCase()).includes(data.year)) {
            } else {
                issues.year={exists:true,reason:"The role does not exist."}
            }

            if (teamlist.map(course => course.trim().toLowerCase()).includes(data.course)) {
            } else {
                issues.course = {exists:true,reason:"The team does not exist."}
            }

            let countryExists = companydata.countryCity.some(x => x.country.toLowerCase() === data.country.toLowerCase());
            if (countryExists) {
                let cityExists = companydata.countryCity.find(x => x.country.toLowerCase() === data.country.toLowerCase()).city.includes(data.city.toLowerCase());
                if (!cityExists) {
                    issues.city = { exists: true, reason: "This city does not exist in your organization list for this country." };
                }
            } else {
                issues.country = { exists: true, reason: "This country is not included in your company list, please email support@profluentlabs.com to add this country to your company." };
            }

            if(currentTotalUsers>=userLimit){
                // change midhun made to add exceeded user limit case
                issues.userLimit = { exists: true, reason: "User Limit exceeded" };
            }


            if (Object.keys(issues).some(key => issues[key].exists)) {
                count++;
                skippeddocumets.push({
                    name: data.username || "Unknown",
                    email: data.email,
                    mobile: data.mobile,
                    issues,
                    data
                });
            } else {
                let result = await admin.firestore().collection("UserNode").add(data);
                await admin.firestore().collection("UserNode").doc(result.id).update({ _id: result.id });
                currentTotalUsers++;
                insertcount++;
                inserteddata.push(data)
            }
        });

        await Promise.all(datasss);
        if(insertcount !=0){
            let total = companydata.totalusers + insertcount;
            let activeuserscount = activeuserCount + insertcount;

            await admin.firestore().collection("UserNode").doc(req.body.companyid).update({
                totalusers: total,
                activeuserscount: 0
            });
        }

        res.send({ message: "Upload completed", status: true, count: count, skippeddocs: skippeddocumets, inserteddata:inserteddata });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong", status: false });
    }
};
 

const addcompanySubadmin=async(req,res)=>{//for adding the subadmin for companies
    try {
        console.log(req.body)
        let action=req.body.actiontype
        delete req.body.actiontype
        let data=req.body
        data.slugname = req.body.name.trim().toLowerCase()
        data.webaccess="1"
        if(action==="create"){
            let companyref=admin.firestore().collection('UserNode').doc(req.body.companyid)
            companyref.update({clientadmincount:firebbase.firestore.FieldValue.increment(1)})
            data.createdAt=firebbase.firestore.FieldValue.serverTimestamp()
            admin.firestore().collection("UserNode").add(data).then((docRef)=>{
               
                return docRef.update({_id:docRef.id}) //this is used to add the id to the document we have created in firebase
            }).then((result)=>{
               
                res.send({messsage:"Added succusfully",status:true})
            }).catch((error)=>{
                console.log(error)
                res.status(500).send({message:"somthing went wrong",status:true})
            })
        }else if(action=="update"){
            admin.firestore().collection("UserNode").doc(data._id).update(data).then((result)=>{
                res.status(200).send({message:"updata successfully",status:true})
            }).catch((error)=>{
                res.status(500).send({message:"somthing went wrong",status:false})
            })
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong ",status:false})
    }
}


const companySubadminList=async(req,res)=>{//for getting the compnay subadmin list
    try {
        let query = admin.firestore().collection("UserNode").where('access', '==', 'companysubadmin').where('status',"in",["1","2"]);
        
        // if (req.body.search) {
        //     let search =  req.body.search.trim().toLowerCase()
        //     query = query.where("slugname", "==", search.toLowerCase());
        // }
        const count = (await query.get()).size
        
         const snapshot = await query.offset(req.body.skip).limit(req.body.limit).orderBy("createdAt","desc").get();
        let data = [];
        snapshot.forEach((doc) => {
            // console.log(doc.id)
            data.push(doc.data());
        });
        if (req.body.search) {
            let search =  req.body.search.trim().toLowerCase()
            data = data.filter(s=>s.slugname.toLowerCase().includes(search) || s.email.toLowerCase().includes(search) || s.company.toLowerCase().includes(search) || s.mobile.toLowerCase().includes(search));
        }
        res.status(200).send({ data, count, message: "company subadmin fetched successfully", status: true });


    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}


const getcompanysubadmin=async(req,res)=>{//for getting the specific subadmin details
    try {
        let id=req.body.data
        let docRef= await admin.firestore().collection("UserNode").doc(id).get()
        let data=docRef.data()
        data._id=docRef.id
        res.status(200).send({message:"company details",data:data,status:true})
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}


const addeditBatch=async(req,res)=>{//for adding batches and users to the batches
    try {
        let action=req.body.actiontype
        delete req.body.actiontype
        let data=req.body
        
        if(action==="create"){
            
            if(data.date==="custom"){
                const startdate = moment(data.datepicker[0]).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                const endate=moment(data.datepicker[`1`]).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                let companyShort = data.company.slice(0, 2).toUpperCase();   
                let cityShort = data.city.slice(0, 2).toUpperCase();  
                let teamShort = data.team.map(item => item.slice(0, 2)).join('').toUpperCase();  
                let roleShort = data.role.map(item => item.slice(0, 2)).join('').toUpperCase(); 
                let todaydata = new Date().toISOString().slice(5, 10).replace(/-/g, '-');


                let shortname = `${companyShort}${cityShort}${teamShort}${roleShort}_${todaydata}`;
                data.shortname=shortname
                data.createAt=firebbase.firestore.FieldValue.serverTimestamp()//this is used to create the timestamp
            
                let bathref=await admin.firestore().collection('batch').add(data)
                let companyRef=await admin.firestore().collection("UserNode").doc(data.companyid)
                await companyRef.update({
                    batchcount:firebbase.firestore.FieldValue.increment(1)
                })
                let idofBatch=bathref.id
                // await bathref.update({_id:idofBatch})

                let snapshot= await admin.firestore().collection("UserNode").where("access","==","App User")
                .where("companyid","==",data.companyid).where("joindate", ">=", startdate).where("joindate","<=",endate)
                .where("city","==",data.city).where("status","in",["1"]).get();
                let userDatas = [];
                snapshot.forEach(doc => {
                    userDatas.push(doc.data());
                });
                let userCount=userData.length
                await bathref.update({_id: idOfBatch,usercount:userCount});
                let userIds = userDatas.map(x => x._id);
                let batchPromises = userIds.map(async (id) => {
                    let userBatchSnapshot = await admin.firestore().collection("userbatch")
                    .where("userid", "==", id)
                    .get();
                    // .where("batchid", "==", idOfBatch)
                
                if (userBatchSnapshot.empty) {
                    let userBatchRef = await admin.firestore().collection("userbatch").add({userid: id, batchid: idofBatch,companyid:data.companyid});
                    await userBatchRef.update({_id: userBatchRef.id});
                }
    
                });

                // Wait for all batchPromises to resolve
                await Promise.all(batchPromises);

                res.send({message: "Batch created", status: true});
        
            }
            else{
                
                let today = moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                let filterDate = moment().subtract(data.date, "months").startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
                let batchdata=req.body
                let companyShort = data.company.slice(0, 2).toUpperCase();   
                let cityShort = data.city.slice(0, 2).toUpperCase();  
                let teamShort = data.team.map(item => item.slice(0, 2)).join('').toUpperCase();  
                let roleShort = data.role.map(item => item.slice(0, 2)).join('').toUpperCase(); 
                let todaydata = new Date().toISOString().slice(5, 10).replace(/-/g, '-');


                let shortname = `${companyShort}${cityShort}${teamShort}${roleShort}_${todaydata}`;
                data.shortname=shortname
                // Add a new batch and get its ID
             
                data.createAt=firebbase.firestore.FieldValue.serverTimestamp()//this is used to create the timestamp
                let batchRef = await admin.firestore().collection("batch").add(data);
                let companyRef=await admin.firestore().collection("UserNode").doc(data.companyid)
                await companyRef.update({
                    batchcount:firebbase.firestore.FieldValue.increment(1)
                })
                let idOfBatch = batchRef.id;
                await batchRef.update({_id: idOfBatch});

                 // Fetch user data based on the filter date
                let snapshot = await admin.firestore().collection("UserNode").where("access","==","App User").where("companyid","==",data.companyid)
                .where("joindate", ">=", filterDate).where("city","==",data.city)
                .where("status","in",["1"]).get();
                
                let userDatas = [];
                snapshot.forEach(doc => {
                    userDatas.push(doc.data());
                });
                let userCount=userDatas.length
                
                await batchRef.update({_id: idOfBatch,usercount:userCount});
               
                // Map user IDs from the user data
                let userIds = userDatas.map(x => x._id);

                // Add userbatch documents for each user
                let batchPromises = userIds.map(async (id) => {
                    let userBatchSnapshot = await admin.firestore().collection("userbatch")
                    .where("userid", "==", id)
                    .get();
                    // .where("batchid", "==", idOfBatch)
                    
                if (userBatchSnapshot.empty) {
                    let userBatchRef = await admin.firestore().collection("userbatch").add({userid: id, batchid: idOfBatch,companyid:data.companyid});
                    await userBatchRef.update({_id: userBatchRef.id});
                }
                });
                // Wait for all batchPromises to resolve
                await Promise.all(batchPromises);

                res.send({message: "Batch created", status: true});
            }
        }
        else if(action==="update"){
            // console.log(req.body)
            await admin.firestore().collection("batch").doc(data._id).update(data)
            res.status(200).send({message:"updated successfully",status:true})

        }
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}


const getbatchlist=async(req,res)=>{//for getting the batchlist
    try {
        console.log(req.body)

        // let filters=req.body.filter_action
        // let bathreQuery=admin.firestore().collection("batch").where("companyid","==",filters.Company)

        // if(filters.From_Date){
        //     filters.From_Date=moment(filters.From_Date).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            
        //     bathreQuery=bathreQuery.where("startdate", ">=", filters.From_Date)
        // }
        // if(filters.City.length>0){
        //     bathreQuery=bathreQuery.where("city","array-contains",filters.City)
        // }
        // if(filters.Role.length>0){
        //     bathreQuery=bathreQuery.where("role","array-contains",filters.Role)
        // }
        
        // if(filters.To_Date){
        //     filters.To_Date=moment(filters.To_Date).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
           
        //     bathreQuery=bathreQuery.where("startdate", "<=", filters.To_Date)
        // }
        
        // if(req.body.search){
          
        //     let searchTerm=req.body.search
        //     bathreQuery = bathreQuery.where("slugname", ">=", searchTerm)
        //                  .where("slugname", "<=", searchTerm + "\uf8ff");
        // }
        // const count = (await bathreQuery.get()).size
        // const snapshot = await bathreQuery.offset(req.body.skip).limit(req.body.limit).orderBy("createAt","desc").get();
            
        // let data = [];
        // snapshot.forEach(doc => {
        //     data.push({_id: doc.id, ...doc.data()});
        // });
       
        // res.send({message:"batchlist",count:count,status:true,data:data})


        //////////8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
        const filters = req.body.filter_action;
        let bathreQuery = admin.firestore().collection("batch").where("companyid", "==", filters.Company);
        
        if (filters.From_Date) {
            filters.From_Date = moment(filters.From_Date).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            bathreQuery = bathreQuery.where("startdate", ">=", filters.From_Date);
        }
        
        if (filters.To_Date) {
            filters.To_Date = moment(filters.To_Date).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            bathreQuery = bathreQuery.where("startdate", "<=", filters.To_Date);
        }
        // if (req.body.search) {
        //     let searchTerm = req.body.search;
        //     bathreQuery = bathreQuery.where(("slugname").toLowerCase(), '>=',searchTerm.toLowerCase()).where(("slugname").toLowerCase(), '<=',searchTerm.toLowerCase()+'\uf8ff')
        // }
        //if (req.body.search) {
            //let searchTerm = req.body.search;
            //bathreQuery = bathreQuery.where("slugname", "==", searchTerm.toLowerCase()).where(("remarks").toLowerCase(), '>=',searchTerm.toLowerCase()).where(("remarks").toLowerCase(), '<=',searchTerm.toLowerCase()+'\uf8ff')
            
            //bathreQuery = bathreQuery.where("slugname", "in", searchTerm.toLowerCase())
        //}
        
        // Log filter values
        console.log('Filters:', filters);



        try {
            const baseSnapshot = await bathreQuery.get();
            let baseData = [];
            baseSnapshot.forEach(doc => {
                baseData.push({_id: doc.id, ...doc.data()});
            });
        
            console.log('Base data length:', baseData);
            let filteredData = baseData;
        
            if (Array.isArray(filters.City) && filters.City.length > 0) {
                filters.City = filters.City.map(v => v.toLowerCase());

                filteredData = filteredData.filter(doc => {
                    const matches = doc.city && doc.city.some(city => filters.City.includes(city.toLowerCase()));
                    console.log(`Filtering by city: ${filters.City}, Document city: ${doc.city}, Matches: ${matches}`);
                    return matches;
                });
        
                // Log after city filtering
                console.log('Filtered data by city length:', filteredData.length);
                console.log('Filtered data by city:', JSON.stringify(filteredData, null, 2));
            }
        
            // Apply additional filtering for 'Role'
            if (Array.isArray(filters.Role) && filters.Role.length > 0) {
                filters.Role = filters.Role.map(v => v.toLowerCase());

                filteredData = filteredData.filter(doc => {
                    const matches = doc.role && doc.role.some(role => filters.Role.includes(role.toLowerCase()));
                    console.log(`Filtering by role: ${filters.Role}, Document role: ${doc.role}, Matches: ${matches}`);
                    return matches;
                });
        
                // Log after role filtering
                console.log('Filtered data by role length:', filteredData.length);
                console.log('Filtered data by role:', JSON.stringify(filteredData, null, 2));
            }
            if(req.body.search){
                let ser=req.body.search.toLowerCase();
                filteredData=filteredData.filter(s=>s.slugname.toLowerCase().indexOf(ser) > -1  || s.remarks.toLowerCase().indexOf(ser) > -1 )
            }
        
            // Apply pagination
            const count = filteredData.length;
            filteredData = filteredData.slice(req.body.skip, req.body.skip + req.body.limit);
            
            // Log after pagination
            // console.log('Paginated data length:', filteredData.length);
            // console.log('Paginated data:', JSON.stringify(filteredData, null, 2));
        
            // Send response
            res.send({ message: "batchlist", count: count, status: true, data: filteredData });
        } catch (error) {
            console.error('Error retrieving data:', error);
            res.status(500).send({ message: "Error retrieving data", status: false });
        }
        
        


        
        
        
        

    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}
// const getbatchlist = async (req, res) => {
//     try {
//         let batchlist = [];
//         let query = admin.firestore().collection("batch")
//                         .where("companyid", "==", req.body.id)
//                         .where("status", "in", ["1", "2"]);

//         if (req.body.search) {
//             // Perform regex search on 'slugname' field
//             let regexPattern = new RegExp(req.body.search, 'i'); // 'i' flag for case insensitivity
//             query = query.where("slugname", ">=", req.body.search)
//                          .where("slugname", "<=", req.body.search + '\uf8ff');
//         }

//         const countSnapshot = await query.get();
//         const count = countSnapshot.size;

//         const snapshot = await query.offset(req.body.skip).limit(req.body.limit).orderBy('createAt', 'desc').get();
//         snapshot.forEach((doc) => {
//             batchlist.push(doc.data());
//         });

//         res.send({ message: "batchlist", count: count, status: true, data: batchlist });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({ message: "something went wrong", status: false });
//     }
// }



const batchStatus=async(req,res)=>{//for updateing the status of the the batch
    try {
        // console.log(req.body);
        let {id,status}=req.body
         admin.firestore().collection("batch").doc(id).update({status:status}).then((result)=>{
            res.send({message:"status updated successfully",status:true})
        }).catch((error)=>{
            console.log(error);
            res.status(500).send({message:"somthing went wrong",status:false})
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}


const getBatchDetails=async(req,res)=>{//for getting the batch details
    try {
        console.log(req.body)
        const {id}=req.body
        const docRef=await admin.firestore().collection('batch').doc(id).get()
        const data=docRef.data()
        data._id=docRef.id
        res.status(200).send({message:'batch details',status:true,data:data})
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong"})
    }
}


// const batchUsers = async (req, res) => {//for getting the batch users list
//     try {
//         const { id, skip = 0, limit = 10, search = '' } = req.body;

//         if (!id) {
//             return res.status(400).send({ message: "Batch ID is required", status: false });
//         }

//         const batchQuery = admin.firestore().collection("userbatch")
//             .where("batchid", "==", id)
//             .offset(skip)
//             .limit(limit);
        
//         const countQuery = admin.firestore().collection("userbatch")
//             .where("batchid", "==", id);

//         const [snapshot, countSnapshot] = await Promise.all([batchQuery.get(), countQuery.get()]);

//         const userPromises = snapshot.docs.map(async (doc) => {
//             const userId = doc.data().userid;
//             const userRef = admin.firestore().collection("UserNode").doc(userId);
//             const userDoc = await userRef.get();
//             const userData = userDoc.data();

//             if (search) {
//                 return userData && userData.username === search ? userData : null;
//             }
//             return userData;
//         });

//         const users = (await Promise.all(userPromises)).filter(user => user !== null);
//         const count = countSnapshot.size;

//         res.send({ message: "Batch users list", data: users, status: true, count });
//     } catch (error) {
//         console.error("Error retrieving users: ", error);
//         res.status(500).send({ message: "Error retrieving users", status: false, error: error.message });
//     }
// };

const batchUsers = async (req, res) => { // For getting the batch users list
    try {
        const { id, skip = 0, limit = 10, search = '' } = req.body;

        if (!id) {
            return res.status(400).send({ message: "Batch ID is required", status: false });
        }

        // const batchQuery = admin.firestore().collection("userbatch")
        //     .where("batchid", "==", id)
        //     .offset(skip)
        //     .limit(limit);
        const batchQuery = admin.firestore().collection("userbatch")
        .where("batchid", "==", id);

        const countQuery = admin.firestore().collection("userbatch")
            .where("batchid", "==", id);

        const [snapshot, countSnapshot] = await Promise.all([batchQuery.get(), countQuery.get()]);
        let batchid=snapshot.docs[0].data().batchid
        let companyid=snapshot.docs[0].data().companyid
        console.log(companyid)
        

        const regex = new RegExp(search, 'i'); // Create a regex from the search string, case-insensitive
        

        const userPromises = snapshot.docs.map(async (doc) => {
            const userData = doc.data().userdata;
            
            // const userId = doc.data().userid;
            // const userRef = admin.firestore().collection("UserNode").doc(userId);
            // const userDoc = await userRef.get();
            // const userData = userDoc.data();

            if (userData && regex.test(userData.username)) {
                return userData;
            }
            return null;
        });

    //    let batchid=userData[0]
    const users = (await Promise.all(userPromises)).filter(user => user !== null);
    const count = countSnapshot.size;
    let batchdata=(await admin.firestore().collection("batch").doc(batchid).get()).data()
    let companydata=(await admin.firestore().collection("UserNode").doc(companyid).get()).data()
    // console.log(companydata)
    // console.log(batchdata)

        res.send({ message: "Batch users list", data: users, status: true, count ,batchdata:batchdata,companydata});
    } catch (error) {
        console.error("Error retrieving users: ", error);
        res.status(500).send({ message: "Error retrieving users", status: false, error: error.message });
    }
};


const deletebathuser=async(req,res)=>{// for delete the batch users
   try {
        console.log("-------------------------------------------------------------------------------------------------------");
        console.log("req.body.ids[0]:",req.body.ids[0]);
        console.log("req.body.ids:",req.body.ids);
       
        let snapshot=await admin.firestore().collection("userbatch").where("userid","==",req.body.ids[0]).get()
  
        let userbatchdata=snapshot.docs[0].data()
        console.log(userbatchdata);
        let batchref=admin.firestore().collection("batch").doc(userbatchdata.batchid)
        let batchdata=await (await batchref.get()).data()


        snapshot.forEach((doc)=>{
            doc.ref.delete()
        })
        batchref.update({usercount:batchdata.usercount-1})
        res.send({message:"Action successfull",status:true})
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}

// const chagneBatchList=async(req,res)=>{//for getting the specific company change batch list
//     try {
//         let data=req.body
       
      
       
     
       
//         let currentuserBatch = await admin.firestore().collection("userbatch").where("userid", "==", data._id).get();
   
//         let result = currentuserBatch.docs[0].data();
//         let current=await admin.firestore().collection("batch").where("_id","==",result.batchid).get()
//         let ress=current.docs[0].data()
//         console.log(ress.role)
//         let batchRef=await admin.firestore().collection("batch").where("companyid","==",req.body.companyid).where("status","in",["1","2"]).where("city","==",ress.city)
//         .get()
//         let batchslist=[]
//         batchRef.forEach((doc)=>{
//             batchslist.push(doc.data())
//         })
//         console.log("----------------------------------------------------------------------------------------------------------")
//         console.log(batchslist)
//         let batchlist=batchslist.filter(x=>x._id!==result.batchid)
//         res.status(200).send({message:"batch lists",currentbatch:ress,batchlist:batchlist,status:true})
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({message:"somthing went wrong",status:false})
//     } 
// }


const chagneBatchList=async(req,res)=>{//for getting the specific company change batch list
    try {
        let data=req.body
        let currentuserBatch = await admin.firestore().collection("userbatch").where("userid", "==", data._id).get();
        let result = currentuserBatch.docs[0].data();
        let current=await admin.firestore().collection("batch").where("_id","==",result.batchid).get()
        let ress=current.docs[0].data()
        let batchslist=[]
      

       
        const db = admin.firestore();

        const batchCollection = db.collection('batch');

        async function getBatches(companyId, city, roles) {
        try {
            // Create the initial query with the first set of conditions
            let batchQuery = batchCollection
            .where('companyid', '==', companyId)
            .where('status', 'in', ['1', '2'])
            .where('city', '==', city);
            let roleQueries = [];

            // Create a separate query for each role in the roles array
            roles.forEach(role => {
            let roleQuery = batchQuery.where('role', 'array-contains', role).get();
            roleQueries.push(roleQuery);
            });

            // Execute all the queries in parallel
            let querySnapshots = await Promise.all(roleQueries);

            // Collect all documents from the results
            
            querySnapshots.forEach(querySnapshot => {
            querySnapshot.forEach(doc => {
                batchslist.push(doc.data());
            });
            });

            return batchslist;
        } catch (error) {
            console.error('Error getting documents: ', error);
        }
        }

        // Example usage
        const companyId = req.body.companyid;
        const city = ress.city;
        const roles = ress.role;

        getBatches(companyId, city, roles).then(docs => {
        // console.log('Retrieved documents:', docs);
        let batchlist=batchslist.filter(x=>x._id!==result.batchid)
        res.status(200).send({message:"batch lists",currentbatch:ress,batchlist:batchlist,status:true})
        });
            
    } catch (error) {
            console.log(error)
            res.status(500).send({message:"somthing went wrong",status:false})
    }
}



const profileData=async(req,res)=>{//for getting the profile data  of admin 
    try {
        let data=req.body
        let docRef=await admin.firestore().collection("UserNode").where("access","==",data.type).get()
        let result=docRef.docs[0].data()
        res.status(200).send({message:"admin details",status:true,data:result})
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}


// const updateprofile=async(req,res)=>{//for updateing the profile of admin
//     try {
//         let data=req.body
//         let docRef=await admin.firestore().collection("UserNode").where("access","==","Admin").get()
//         docRef.forEach((doc)=>{
//             doc.ref.update(data)
//         })
//         let adminid=await docRef.docs[0].data()._id
//         console.log(adminid)
//         let admindata=(await admin.firestore().collection("UserNode").doc(adminid).get()).data()
        
//         res.send({message:"update successfully",status:true,data:admindata})
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({message:"somting went wrong",status:false})
//     }
// }


const updateprofile=async(req,res)=>{//for updateing the profile of admin
    try {
        let data=req.body
        let docRef=await admin.firestore().collection("UserNode").where("access","==","Admin").get()
        docRef.forEach((doc)=>{
            doc.ref.update(data)
        })
        let adminid=await docRef.docs[0].data()._id
        // console.log(adminid)
        let admindata=(await admin.firestore().collection("UserNode").doc(adminid).get()).data()
        
        res.send({message:"update successfully",status:true,data:admindata})
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somting went wrong",status:false})
    }
}


const adduserbatchlist=async(req,res)=>{//listing the user of specific compnay to add to the batch
    try {
        let data=req.body.batchid //this is actually company id
        let userList=[]
        let batchusers=[]
        let snapshot=(await admin.firestore().collection("batch").doc(data).get()).data()
        console.log(snapshot)
        
        let userDoc=await admin.firestore().collection("UserNode").where("access","==","App User").where("companyid","==",snapshot.companyid).where("city","==",snapshot.city).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                userList.push(doc.data())
            })
        })

        let batchuserslist=await admin.firestore().collection("userbatch").where("companyid","==",snapshot.companyid).get().then((result)=>{
            result.forEach((doc)=>{
                batchusers.push(doc.data())
            })
        })
        let ids=batchusers.map(x=>x.userid)
       
        const filteredArray = userList.filter(obj => !ids.includes(obj._id));
        res.status(200).send({message:"user list",status:true,data:filteredArray,companyid:snapshot.companyid})

    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong", status:false})
    }
}


const addUserToBatch=async(req,res)=>{//for addint the user to specific batch
    try {
       
        let {data,batchid,companyid}=req.body
        console.log(req.body)
        for(let i=0;i<data.length;i++){
            let userbatch=await admin.firestore().collection("userbatch").add({userid:data[i],batchid:batchid,companyid:companyid})
            await userbatch.update({_id:userbatch.id})
        }
        let batchref= admin.firestore().collection("batch").doc(batchid)
        let batchdata=await (await batchref.get()).data()
     
        if(batchdata.usercount===undefined){
            batchref.update({usercount:1})
        }else{
            console.log("inside of thies")
            batchref.update({usercount:batchdata.usercount+1})
        }
        res.status(200).send({message:"add user to batch",status:true})
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong ",status:false})
    }
}


const deletedUserslist=async(req,res)=>{//fot getting the delted users list
    try {

        let userRef=await admin.firestore().collection("UserNode").where("access","==","App User").where("status","==","0").get()
        let deletedUser=[]
        userRef.forEach((doc=>{
            deletedUser.push(doc.data())
        }))
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",statsu:false})
    }
}


const addeditTrainer=async(req,res)=>{//for adding and editing the trainer
    try {
   
        let action=req.body.actiontype
        delete req.body.actiontype
        let data=req.body
        if(action==="create"){
            const companyRef = await admin.firestore().collection("UserNode").doc(req.body.companyid);  
            let companydata=(await companyRef.get()).data()
            console.log(companydata)
            data.companydata=companydata
            companyRef.update({   
              trainerscount: firebbase.firestore.FieldValue.increment(1)
            });
            data.createAt=firebbase.firestore.FieldValue.serverTimestamp()
        let trainerRef= await admin.firestore().collection("UserNode").add(data)
        let docref=await admin.firestore().collection("UserNode").doc(trainerRef.id)
        await docref.update({_id:trainerRef.id})
        res.send({message:"Trainer added Successfully", status:true,})
        }else{
            
            let docref=await admin.firestore().collection("UserNode").doc(req.body._id)
            await docref.update(data)
            res.send({message:"Updated successfully", status:true})
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing ",status:false})
    }
}


const trainersList = async (req, res) => {
    try {
        console.log(req.body);

        let skip = req.body.skip ?? 0;
        let limit = req.body.limit ?? 10;
        let search = req.body.search;
        let status = [];

        let reqdata = req.body.filter_action;
        let reqstatus = reqdata.Status;

        // Set the status filter based on the request
        if (reqstatus === "3") {
            status = ["1", "2"]; // Active and Inactive
        } else if (reqstatus === '1') {
            status = ["1"]; // Active only
        } else if (reqstatus === '2') {
            status = ["2"]; // Inactive only
        } else if (reqstatus === '0') {
            status = ["0"]; // Deleted only
        } else {
            status = ["1", "2"]; // Default to Active and Inactive
        }

        // Initialize the Firestore query
        let docQuery = admin.firestore().collection("UserNode")
            .where("access", "==", "Trainer Login")
            .where("status", "in", status);

        console.log("request:",reqdata)

        // Apply additional filters if provided (Company, Country, City)
        if (reqdata.Institution) {
            docQuery = docQuery.where("companyid", "==", reqdata.Institution);
        }
        if (reqdata.Country) {
            docQuery = docQuery.where("country", "==", reqdata.Country);
        }
        if (reqdata.City) {
            docQuery = docQuery.where("city", "==", reqdata.City);
        }

        // Get the total count of trainers matching the filters (for pagination)
        let size = (await docQuery.get()).size;

        // Fetch the data with pagination
        let snapshot = await docQuery.offset(skip).limit(limit).orderBy("createAt", 'desc').get();

        // Create a list of trainers and update the `company` field
        let trainerList = [];
        snapshot.forEach((doc) => {
            let data = doc.data();
            if (data.companydata && data.companydata.companyname) {
                data.company = data.companydata.companyname;
            }
            trainerList.push(data);
        });

        // If a search term is provided, filter the data client-side
        if (search) {
            trainerList = trainerList.filter(trainer => {
                // Make the comparison case-insensitive
                return trainer.slugname.toLowerCase().includes(search.toLowerCase());
            });
        }

        // Send the filtered trainers list along with the total count
        res.send({ message: "Trainers fetched successfully", status: true, data: trainerList, count: size });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong", status: false });
    }
};




const updateTrainerStatus=async(req,res)=>{//this is for updateing the trainer status
    try {
        let {id,status}=req.body
        let docRef=await admin.firestore().collection("UserNode").doc(id)
        await docRef.update({status:status})
        res.send({message:"Updated Successfully",status:true})
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"Somthing went wrong",status:false})
    }
}


const deleteTrainer=async(req,res)=>{//this is for deleting the trainer
    try {
        // console.log(req.body)
        let id=req.body.ids
        let batch=admin.firestore().batch()
        id.forEach((id)=>{
            let batchref=admin.firestore().collection("UserNode").doc(id)
            batch.update(batchref,{status:"0"})           
        })
        await batch.commit()

        // let docRef=await admin.firestore().collection("UserNode").doc(id).update({status:"0"})
        res.send({message:"Deleted Successfully", status:true})
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}







const viewCreatedBatch=async(req,res)=>{
    try {
        console.log(req.body)
        
        
        let status = ["1"];
        let reqdata=req.body
      
      

        let query = admin.firestore().collection("UserNode")
        .where('access', '==', 'App User')
        .where('status', 'in', status)
        

        if(reqdata.company){
            query=query.where("companyid","==",reqdata.company);
        }
        if(reqdata.city){
            reqdata.city=reqdata.city.map(v=>v.toLowerCase())
            query=query.where(("city").toLowerCase(),"in",reqdata.city)
        }
        // if(reqdata.country){
        //     query=query.where("country","==",reqdata.country)
        // }
        if(reqdata.role){
            reqdata.role=reqdata.role.map(v=>v.toLowerCase())

            query=query.where(("role").toLowerCase(),"in",reqdata.role)
        }
     
        if(reqdata.userjoiningdate){
            reqdata.startdate=moment(reqdata.userjoiningdate[0]).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            query=query.where("joindate", ">=", reqdata.startdate)

            reqdata.enddate=moment(reqdata.userjoiningdate[1]).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            console.log(reqdata.enddate)
            query=query.where("joindate", "<=", reqdata.enddate)
         }
        
        // if(reqdata.enddate){
        
        //     reqdata.To_Date=moment(reqdata.endate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        //     console.log(reqdata.enddate)
        //     query=query.where("joindate", "<=", reqdata.enddate)
        // }
        
        // if(req.body.search){
        //     let searchTerm=req.body.search.toLowerCase()
        //     query = query.where("username", ">=", searchTerm)
        //                  .where("username", "<=", searchTerm + "\uf8ff");
        // }
        
        const snapshot = await query.orderBy("createAt","desc").get();
            //console.log("length: ",snapshot.length);
            // let data = [];
            // let compids=[];
            // let arrobj={};
            // var snapshotres=[];
            // snapshot.forEach(doc => {
            //     snapshotres.push({_id: doc.id, ...doc.data()});
            // });

            console.log("Snapshop data .........................................................",snapshot.docs.length);
            console.log("Snapshop data .........................................................")
            
            // let i=1;
            // let a=0;
            // let x=1;
            // for (const doc of snapshot.docs) {
            //     //console.log(doc.data())
            //     x=x+1;
            //     console.log("doc.id: ",doc.id)
            //     //console.log("doc._id: ",doc.data())
            //     compids.push(doc.id);
            //     i=i+1;
            //     if(i==30){
            //         arrobj[a]=compids;
            //         compids=[];
            //         a=a+1;
            //         i=0;
            //     }
            // }
            //console.log("arrobj : ",arrobj)
            //console.log("xxxxxxxxxx : ",x);
            //let existsSnapshot = await admin.firestore().collection("userbatch").where("userid", "in", compids).get();
            // let existsSnapshot = await admin.firestore().collection("userbatch").where("userdata.status","in",status).where("companyid", "=", reqdata.company).get();

            // var existsSnapshotres=[];
            // existsSnapshot.forEach(doc => {
            //     existsSnapshotres.push({_id: doc.id, ...doc.data()});
            // });

            let existingusers=[];
            for (const doc of snapshot.docs) {
                console.log(doc.data())
                let existsSnapshot = await admin.firestore().collection("userbatch").where("userdata.status","in",status).where("userid", "==", doc.id).get();
                // console.log(existsSnapshot)
                if(!existsSnapshot.empty){
                    existingusers.push({ _id: doc.id, ...doc.data() });

                }
            }

           // console.log("existsSnapshot length : ",existsSnapshot.docs.length)
            console.log("existsSnapshot  : ",existingusers.length)

            // if(!existsSnapshot.empty){
            //     data.push({ _id: doc.id, ...doc.data() });
            // }
            let data={users:existingusers};
            return  res.status(200).send({data,message: "Users fetched successfully",status: true});

    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}

const createBatch=async(req,res)=>{
    try {
        console.log(req.body)
        
        let status = ["1"];
        let reqdata=req.body

        let query = admin.firestore().collection("UserNode")
        .where('access', '==', 'App User')
        .where('status', 'in', status)
    
        if(reqdata.company){
            query=query.where("companyid","==",reqdata.company);
        }
        let usersnapshot1= await query.orderBy("createAt","desc").get()
       let userres= usersnapshot1.docs.map(s=>s.data())
       console.log(userres.length)

        if(reqdata.city){
            //reqdata.city=reqdata.city.map(v=>v.toLowerCase());
            //query=query.where(("city").toLowerCase(),"in",reqdata.city)
        }
        // if(reqdata.country){
        //     query=query.where("country","==",reqdata.country)
        // }
       
        if(reqdata.role && reqdata.role.length !=0  ){
            //reqdata.role=reqdata.role.map(v=>v.toLowerCase());
            // reqdata.role.forEach(ele => {
            //     query=query.where("role","==",ele)
            // });
        }
     
      
        
        // if(reqdata.enddate){
        
        //     reqdata.To_Date=moment(reqdata.endate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        //     console.log(reqdata.enddate)
        //     query=query.where("joindate", "<=", reqdata.enddate)
        // }
        
        if(req.body.search){
            let searchTerm=req.body.search.toLowerCase()
            query = query.where("username", ">=", searchTerm)
                         .where("username", "<=", searchTerm + "\uf8ff");
        }
        
        const snapshot = await query.orderBy("createAt","desc").get()
        //let userres= snapshot.docs.map(s=>s.data())
        if (reqdata.userjoiningdate) {
            reqdata.startdate = moment(reqdata.userjoiningdate[0]).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            console.log("reqdata.startdate", reqdata.startdate)
            query = query.where("joindate", ">=", reqdata.startdate)

            reqdata.enddate = moment(reqdata.userjoiningdate[1]).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            console.log(reqdata.enddate)
            query = query.where("joindate", "<=", reqdata.enddate)
        }
            let data = [];
            // snapshot.forEach(doc => {
            //     data.push({_id: doc.id, ...doc.data()});
            // });

            //console.log("Snapshop data .........................................................",snapshot)
            console.log("Snapshop data .........................................................")
            
            for (const doc of snapshot.docs) {
                //console.log(doc.data())
                let existsSnapshot = await admin.firestore().collection("userbatch").where("userid", "==", doc.id).get();
                // console.log(existsSnapshot)
                if(existsSnapshot.empty){
                    data.push({ _id: doc.id, ...doc.data() });
                }
            }
            console.log(data)

            console.log(data.length)
           return  res.status(200).send({data,message: "Users fetched successfully",status: true});

    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}
const batchCreatedAdd=async(req,res)=>{
    try {
               
        // console.log(req.body)
        const {selectedusers,batchdata}=req.body
        // console.log(selectedusers)
        console.log(batchdata)
        batchdata.createDate=moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        batchdata.startdate=momenttz(batchdata.startdate).tz("Asia/Kolkata").format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        batchdata.enddate=momenttz(batchdata.enddate).tz("Asia/Kolkata").startOf("day").format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')

        batchdata.createAt=firebbase.firestore.FieldValue.serverTimestamp()

            let companyShort = batchdata.company.slice(0, 2).toUpperCase();   
            // let cityShort = batchdata.city.map(item => item.slice(0, 2)).join('').toUpperCase();  
            let cityShort = batchdata.city.map(item => item.slice(0, 2).toUpperCase()).join('+');
            let roleShort = batchdata.role.map(item => item.slice(0, 2).toUpperCase()).join('+');
            // let todaydata = new Date().toISOString().slice(5, 10).replace(/-/g, '-');
            const today = new Date(batchdata.startdate);
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = String(today.getFullYear()).slice(-2); // Last two digits of the year
            
            const formattedDate = `${day}-${month}-${year}`;
         
             let shortname = `${companyShort}-${cityShort}-${roleShort}-${formattedDate}`;
             batchdata.name=shortname
             batchdata.shortname=shortname
             batchdata.slugname=shortname.toLowerCase()
            let bathref=await admin.firestore().collection('batch').add(batchdata)
            let companyRef=await admin.firestore().collection("UserNode").doc(batchdata.companyid)
            await companyRef.update({
                batchcount:firebbase.firestore.FieldValue.increment(1)
            })
            let idofBatch=bathref.id
            console.log(idofBatch)
            let count=0
            let userIds=selectedusers.map(x => x._id);
            // await bathref.update({_id: idofBatch});
            let batchPromises = userIds.map(async (id,index) => {
                let userBatchSnapshot = await admin.firestore().collection("userbatch")
                .where("userid", "==", id)
                .get();
              
            
            if (userBatchSnapshot.empty) {
                count++
                let userBatchRef = await admin.firestore().collection("userbatch").add({userid: id, batchid: idofBatch,companyid:batchdata.companyid,userdata:selectedusers[index]});
                await userBatchRef.update({_id: userBatchRef.id});
            }

            });
            // Wait for all batchPromises to resolve
            await Promise.all(batchPromises);
            // console.log("here")
            console.log(count)
            await bathref.update({_id: idofBatch,usercount:count});
            

            res.send({message: `Batch ${shortname} created successfully!`,  status: true});

        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}

const batchCreateAndMove=async(req,res)=>{
    try {
               
        // console.log(req.body)
        const {selectedusers,batchdata,currentbatchid}=req.body
        // console.log(selectedusers)
        console.log(batchdata)
        batchdata.createDate=moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        batchdata.startdate=momenttz(batchdata.startdate).tz("Asia/Kolkata").format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        batchdata.enddate=momenttz(batchdata.enddate).tz("Asia/Kolkata").startOf("day").format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')

        batchdata.createAt=firebbase.firestore.FieldValue.serverTimestamp()

            let companyShort = batchdata.company.slice(0, 2).toUpperCase();   
            // let cityShort = batchdata.city.map(item => item.slice(0, 2)).join('').toUpperCase();  
            let cityShort = batchdata.city.map(item => item.slice(0, 2).toUpperCase()).join('+');
            let roleShort = batchdata.role.map(item => item.slice(0, 2).toUpperCase()).join('+');
            // let todaydata = new Date().toISOString().slice(5, 10).replace(/-/g, '-');
            const today = new Date(batchdata.startdate);
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = String(today.getFullYear()).slice(-2); // Last two digits of the year
            
            const formattedDate = `${day}-${month}-${year}`;
         
             let shortname = `${companyShort}-${cityShort}-${roleShort}-${formattedDate}`;
             batchdata.name=shortname
             batchdata.shortname=shortname
             batchdata.slugname=shortname.toLowerCase()

            //shortname="AU-CH-AN-01-03-25";
            let query = admin.firestore().collection("batch")
            .where('name', '==', shortname).get();
            console.log("query length : ",(await query).docs.length)
            if((await query).docs.length >0){
                res.send({message: `Batch ${shortname} already exists. Please add users in existing batch!`,  status: true});
            }
            else {

                let bathref = await admin.firestore().collection('batch').add(batchdata)
                let idofBatch = bathref.id;
                for (let i = 0; i < selectedusers.length; i++) {
                    let batchuserRef = await admin.firestore().collection("userbatch").where('userid', '==', selectedusers[i]._id).get();

                    batchuserRef.forEach(async (doc) => {
                        await doc.ref.update({ batchid: idofBatch });
                    });
                }
                //return;

                let count = selectedusers.length;

                let currentbatch = await admin.firestore().collection("batch").doc(currentbatchid)
                currentbatch.update({ usercount: firebbase.firestore.FieldValue.increment(-count) })

                res.send({ message: `Batch ${shortname} created successfully and users assigned`, status: true });
            }
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}

const editBatch=async(req,res)=>{
    try {
        let data=req.body
        let batchRef=admin.firestore().collection("batch").doc(data._id)
        batchRef.update(data)
        res.status(200).send({message:"Updated Successfully",status:true    })
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong ",status:false})
    }
}
const bacthnewUserList =async(req,res)=>{
    try {
        console.log(req.body)
        let status = ["1"];
        let reqdata=req.body
        let query = admin.firestore().collection("UserNode")
        .where('access', '==', 'App User')
        .where('status', 'in', status)
        if(reqdata.company){
            query=query.where("companyid","==",reqdata.company);
        }
        if(reqdata.city){
            query=query.where("city","in",reqdata.city)
        }
       
        if(reqdata.role){
            query=query.where("role","in",reqdata.role)
        }
     
        if(reqdata.startdate){
            reqdata.startdate=moment(reqdata.startdate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
          
            query=query.where("joindate", ">=", reqdata.startdate)
        }
        
        if(reqdata.enddate){
            console.log("hi  here")
            reqdata.To_Date=moment(reqdata.endate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            console.log(reqdata.enddate)
            query=query.where("joindate", "<=", reqdata.enddate)
        }    
        const snapshot = await query.orderBy("createAt","desc").get()
            
            let data = [];
            for (const doc of snapshot.docs) {
                let existsSnapshot = await admin.firestore().collection("userbatch").where("userid", "==", doc.id).get();
              
                if(existsSnapshot.empty){
                    data.push({ _id: doc.id, ...doc.data() });
                }
            }   
            console.log(data)
           return  res.status(200).send({data,message: "Users fetched successfully",status: true});


    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went worng ",status:false})
    }
}

const addUsertoBatch=async(req,res)=>{
    try {
        console.log(req.body)
        let {selectedUsers,batchid,company}=req.body
     
        let count=0
        let userIds=selectedUsers.map(x => x._id);
        let batchPromises = userIds.map(async (id,index) => {
            let userBatchSnapshot = await admin.firestore().collection("userbatch")
            .where("userid", "==", id)
            .get();
          
        
        if (userBatchSnapshot.empty) {
            count++
            let userBatchRef = await admin.firestore().collection("userbatch").add({userid: id, batchid: batchid,companyid:company,userdata:selectedUsers[index]});
            await userBatchRef.update({_id: userBatchRef.id});
        }

        });
       
        await Promise.all(batchPromises);
        console.log(count)
        
        let batchRef=await  admin.firestore().collection("batch").doc(batchid)
        batchRef.update({usercount:firebbase.firestore.FieldValue.increment(count)})

        res.send({message:"User added  successfully",status:true})

    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing wetn wrong",status:false})
    }
}




const shiftBathlist=async(req,res)=>{
    try{
        const filters = req.body;
        console.log(filters);
        let bathreQuery = admin.firestore().collection("batch").where("companyid", "==", filters.company);
        
        if (filters.From_Date) {
            filters.From_Date = moment(filters.startdata).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            bathreQuery = bathreQuery.where("startdate", ">=", filters.From_Date);
        }
        
        if (filters.To_Date) {
            filters.To_Date = moment(filters.To_Date).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            bathreQuery = bathreQuery.where("startdate", "<=", filters.enddate);
        }
        
        if (req.body.search) {
            let searchTerm = req.body.search;
            bathreQuery = bathreQuery.where(("slugname").toLowerCase(), ">=", searchTerm.toLowerCase())
                                     .where(("slugname").toLowerCase(), "<=", searchTerm.toLowerCase() + "\uf8ff");
        }
        
      
        
        try {
            const baseSnapshot = await bathreQuery.get();
            let baseData = [];
            baseSnapshot.forEach(doc => {
                baseData.push({_id: doc.id, ...doc.data()});
            });
        
          
        
            // Apply additional filtering for 'City'
            let filteredData = baseData;
        
            if (Array.isArray(filters.city) && filters.city.length > 0) {
                filters.city = filters.city.map(v => v.toLowerCase());
                filteredData = filteredData.filter(doc => {
                    const matches = doc.city && doc.city.some(city => filters.city.includes(city.toLowerCase()));
                    console.log(`Filtering by city: ${filters.city}, Document city: ${doc.city}, Matches: ${matches}`);
                    return matches;
                });
        
              
            }
        
            // Apply additional filtering for 'Role'
            if (Array.isArray(filters.role) && filters.role.length > 0) {
                filters.role = filters.role.map(v => v.toLowerCase());
                filteredData = filteredData.filter(doc => {
                    const matches = doc.role && doc.role.some(role => filters.role.includes(role.toLowerCase()));
                    // console.log(`Filtering by role: ${filters.Role}, Document role: ${doc.role}, Matches: ${matches}`);
                    return matches;
                }); 
            }    
            let batchdata=filteredData.filter((x)=>x._id!==req.body.batchid)
            const count = batchdata.length;
            if(batchdata.length>0){
             
                batchdata = batchdata.slice(req.body.skip,req.body.limit+req.body.skip);
                
            }
       
        
            res.send({ message: "batchlist", count: count, status: true, data: batchdata });
        } catch (error) {
            console.error('Error retrieving data:', error);
            res.status(500).send({ message: "Error retrieving data", status: false });
        }
    }catch(error){
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}

const shiftBatch=async(req,res)=>{//for shifting the uer form one batch to another
    try {
        console.log(req.body)

    let {userData,shiftingbatch,currentbatchid}=req.body
    console.log(userData)
    let count=userData.length


    console.log(currentbatchid)
    // console.log(shiftingbatch)
    let shifitingbatchid=shiftingbatch._id
    console.log(shifitingbatchid)
    for (let i = 0; i < userData.length; i++) {
        let batchuserRef = await admin.firestore().collection("userbatch").where('userid', '==', userData[i]._id).get();
        
        batchuserRef.forEach(async (doc) => {
            await doc.ref.update({ batchid: shifitingbatchid });
        });
    }

    let currentbatch=await admin.firestore().collection("batch").doc(currentbatchid)
    currentbatch.update({usercount:firebbase.firestore.FieldValue.increment(-count)})
    let shifitingbatch=await admin.firestore().collection("batch").doc(shifitingbatchid).update({usercount:firebbase.firestore.FieldValue.increment(count)})

    res.status(200).send({message:"Shifted successfully",status:true})


    //     console.log(req.body)
    //    let snapshot= await admin.firestore().collection("userbatch").where("userid","==",req.body.userid).get()
    //    console.log(snapshot.docs[0].data())
    //    let currentBatch=snapshot.docs[0].data().batchid
    //    let batchref=await await admin.firestore().collection("batch").doc(currentBatch)
    //    let batchdata=(await batchref.get()).data()
    //    console.log(batchdata.usercount===undefined)
    //    if(batchdata.usercount===undefined||batchdata.usercount===0){
        
    //     batchref.update({usercount:0})
    //    }else{
    //     batchref.update({usercount:batchdata.usercount-1})
    //    }
      
    //     snapshot.forEach((doc)=>{
    //         doc.ref.update({batchid:req.body.batchid})
    //     })
    //     res.status(200).send({message:"batch shfited succesfully",status:true})
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}



const firestoreBatchQuery = async (collection, field, values) => {
    const batchSize = 30; // Firestore's limit for 'in' queries
    const queries = [];

    for (let i = 0; i < values.length; i += batchSize) {
        const batch = values.slice(i, i + batchSize);
        const querySnapshot = await admin
            .firestore()
            .collection(collection)
            .where(field, "in", batch)
            .get();
        queries.push(querySnapshot.docs);
    }

    return queries.flat(); // Combine all documents into one array
};



const generateLearnerReport = async (req, res) => {
    try {
        
        // const practiceData1 = await practicedb.find().lean();
        // console.log("practiceData")

        // console.log(practiceData1)

        // console.log("Practice Data fetched:", practiceData1);

        const { company, city, startdate, enddate, team, limit = 10, skip = 0 } = req.body;

        const firestore = admin.firestore();

        // Parse dates
       // const startDate = new Date(startdate);
        //const endDate = new Date(enddate);

        //console.log("Start Date:", startDate, "End Date:", endDate);

        // Fetch user data from UserNode collection based on filters
        let uquery = await firestore
            .collection("UserNode")
            .where("companyid", "==", company)
            //.where("city", "==", "Chennai")
            //.where( ("City"), "==", ("Chennai"))

           // .where("City".toLowerCase(), "==", city.toLowerCase())

        //.where("team", "==", team)
        //.get();
       // console.log("Team", req.body.team)
        //console.log("City", req.body.city)

        //console.log("Body", req.body)


        // if (req.body.team) {
        //     req.body.team = req.body.team.map(v => v.toLowerCase());
        //     uquery = uquery.where(("Team").toLowerCase(), "in", req.body.team)
        // }
        // if(req.body.city){
        //     req.body.city = req.body.city.map(v => v.toLowerCase());
        //     uquery = uquery.where(("city").toLowerCase(), "in", req.body.city)
        // }
        let userres1 = await uquery.get();
        let userres= userres1.docs.map(s=>s.data())

        console.log("userQuerySnapshot ----= ",userres.length)
  
        var citydata=[];
        //let userres= usersnapshot.docs.map(s=>s.data())
        if (req.body.city && req.body.city.length !=0) {
            req.body.city = req.body.city.map(v => v.toLowerCase());
          
            req.body.city.forEach(d => {
                var res = userres.filter(x => x.city != undefined && x.city.toLowerCase() == d);
                console.log("var res len : ", d, res.length);
                res.forEach(p=>{
                    citydata.push(p);
                })
               
            })
            userres=citydata;
            citydata=[]
        }
        console.log("users data1 : ", userres.length);

        if (req.body.team && req.body.team.length !=0) {
            req.body.team = req.body.team.map(v => v.toLowerCase());
          
            req.body.team.forEach(d => {
                
                var res = userres.filter(x => x.course != undefined && x.course.toLowerCase() == d);
                console.log("var res len : ", d, res.length);
                res.forEach(p=>{
                    citydata.push(p);
                })
               
            });
            userres=citydata;
            citydata=[]  
        }

        if (userres.length ==0) {
            return res.status(404).send({
                message: "No users found for the provided filters",
                status: false,
                data: [],
                count: 0,
            });
        }
        // console.log("userQuerySnapshot")
        // console.log(userQuerySnapshot)

        userres = userres.map(obj => {
            obj['njoindate'] =new Date(obj.joindate) //moment(obj.joindate).startOf('day').format('YYYY-MM-DD');
            return { ...obj };
        });
      
        if (req.body.ustartdate) {
            userres =userres.filter(o=> (o.njoindate != undefined) && ( o.njoindate >= new Date( req.body.ustartdate) &&  o.njoindate <= new Date( req.body.uenddate)));
        }
        //console.log("userQuerySnapshot len :------------------------------------------- ")
        //console.log("userQuerySnapshot len : ",userQuerySnapshot);
        const userMap = {};
        //console.log("Before")

        //console.log(userQuerySnapshot)
        userres.forEach((doc) => {
            const userData = doc;
            userMap[doc.id] = {
                ...userData,
                userid: doc.id,
            };
        });
        //console.log("userMap")

       // console.log(userMap)
        //console.log("Users fetched from UserNode:", Object.keys(userMap).length);

        const userIds = Object.keys(userMap);

        req.body.startdate = new Date(req.body.startdate)//.startOf('day').format('DD-MMM-YYYY')
        req.body.enddate = new Date(req.body.enddate)//.endOf('day').format('DD-MMM-YYYY')
                
        console.log(req.body)
        let startnum=  new Date(req.body.perioddate[0]).getTime();
        let endnum=  new Date(req.body.perioddate[1]).getTime();

        let sentLabReports= admin.firestore().collection("SentenceLabReports")
        .where("companyId", "==", company)
        .where("timeCal",">=",startnum)
        .where("timeCal","<=",endnum)

        let sentres= await sentLabReports.get();
        sentLabReportsDocs=sentres.docs.map(s=>s.data())//.filter(o=>( o.dateTime !=undefined) && (new Date(o.dateTime) >= new Date( req.body.perioddate[0]) &&  new Date(o.dateTime) <= new Date( req.body.perioddate[1])));
        console.log("SentLabReports fetched:", sentLabReportsDocs.length);

        // let callFlowReports= admin.firestore().collection("callFlowReports")
        // .where("companyId", "==", company)
        // .where("timeCal",">=",startnum)
        // .where("timeCal","<=",endnum)

        // let calres= await callFlowReports.get();
        // callFlowReportsDocs=calres.docs.map(s=>s.data())
        // console.log("CallFlowReports fetched:", callFlowReportsDocs.length);

        

        let ures=userres.map(a1=>{
            //console.log(a1)
            const sendata = sentLabReportsDocs.filter(a2=>a2.userId == a1._id);
            //const caldata = callFlowReportsDocs.filter(a2=>a2.userId == a1._id);
            return { ...a1,sendata};
        });
   
        ures=ures.filter(o=> o.sendata.length !=0)

        // Send response
        res.status(200).send({
            message: "Learner report generated successfully",
            status: true,
            data: ures,
            count: ures.length,
        });
        return;
        //console.log("Filtered SentLabReports:", filteredSentLabReports.length);
        //console.log("Filtered CallFlowReports:", filteredCallFlowReports.length);

        // Fetch practice data from MongoDB
        // const practiceData = await PracticeModel.find({
        //     userid: { $in: userIds }
            
        // }).lean();
        const practiceData = await practicedb.find().lean();

        //console.log("Practice Data fetched:", practiceData);

        // Aggregate learner data
        const learnerData = {};

        // Process SentLabReports and CallFlowReports
        [...filteredSentLabReports, ...filteredCallFlowReports].forEach((doc) => {
            const data = doc.data();
            const { userId } = data;
            console.log("userId-----------")
                console.log(userId)
                //console.log(learnerData[userId])
            if (!learnerData[userId]) {
                console.log("usermap-----------")
                //console.log(userMap)
                const userDetails = userMap[userId] || {};
                console.log("userDetails-----------")
                //console.log(userDetails)
                
                learnerData[userId] = {
                    learnerName: userDetails.username || "Unknown",
                    userid:userDetails._id,
                    noOfSentences: 0,
                    listeningAttempts: 0,
                    practiceAttempts: 0,
                    averageScore: 0,
                    practiceTime: 0,
                    company: userDetails.company || "Unknown",
                    team: userDetails.team || "Unknown",
                    userProfile: userDetails.profile || "Unknown",
                    city: userDetails.city || "Unknown",
                };
            }

            learnerData[userId].noOfSentences += 1;
            learnerData[userId].listeningAttempts += data.listatt || 0;
            learnerData[userId].practiceAttempts += data.pracatt || 0;
            learnerData[userId].averageScore += data.score || 0;
            console.log("learnerData-----------")
            //console.log(learnerData)
        });
       // console.log(learnerData)
        // Process Practice Data
        practiceData.forEach((data) => {
            const { userid, totalPracticeTime, practicecount, listeningcount, score } = data;

            if (!learnerData[userid]) {
                const userDetails = userMap[userid] || {};
                learnerData[userid] = {
                    learnerName: userDetails.username || "Unknown",
                    noOfSentences: 0,
                    userid:userDetails._id,
                    listeningAttempts: 0,
                    practiceAttempts: 0,
                    averageScore: 0,
                    practiceTime: 0,
                    company: userDetails.company || "Unknown",
                    team: userDetails.team || "Unknown",
                    userProfile: userDetails.userProfile || "Unknown",
                    city: userDetails.city || "Unknown",
                };
            }

            learnerData[userid].practiceTime += totalPracticeTime || 0;
            learnerData[userid].practiceAttempts += practicecount || 0;
            learnerData[userid].listeningAttempts += listeningcount || 0;
            learnerData[userid].averageScore += (score || []).reduce((sum, s) => sum + s, 0);
        });

        // Finalize learner data
        Object.values(learnerData).forEach((data) => {
            data.averageScore = data.practiceAttempts
                ? (data.averageScore / data.practiceAttempts).toFixed(2) + "%"
                : "0%";

            const minutes = Math.floor(data.practiceTime / 60);
            const seconds = Math.floor(data.practiceTime % 60);
            data.practiceTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        });

        // Sort and paginate results
        const sortedData = Object.values(learnerData).sort((a, b) => b.noOfSentences - a.noOfSentences);
        const paginatedData = sortedData.slice(skip, skip + limit);

        // Send response
        res.status(200).send({
            message: "Learner report generated successfully",
            status: true,
            data: paginatedData,
            count: sortedData.length,
        });
    } catch (error) {
        console.error("Error generating learner report:", error);
        res.status(500).send({ message: "Something went wrong", status: false });
    }
};


const generateSentenceLabReportDashbpard = async (req, res) => {
    try {
        
        const { company, city, startdate, enddate, team, limit = 10, skip = 0 } = req.body;

        req.body.startdate = new Date(req.body.startdate)//.startOf('day').format('DD-MMM-YYYY')
        req.body.enddate = new Date(req.body.enddate)//.endOf('day').format('DD-MMM-YYYY')
        console.log(req.body);
        let startnum=  new Date(req.body.startdate).getTime();
        let endnum=  new Date(req.body.enddate).getTime();

        console.log(startnum,"------------------------------------------------------------------");   
       
        console.log("generateSentenceLabReportDashbpard............")


        let sentLabReports= admin.firestore().collection("sentLabReports")
        .where("companyId","==",req.body.company)
        //.where("timeCal",">=",startnum)
        //.where("timeCal","<=",endnum)


        let sentres= await sentLabReports.get();
       // sentLabReportsDocs=sentres.docs.map(s=>s.data()).filter(o=>( o.dateTime !=undefined) && (new Date(o.dateTime) >= new Date( req.body.startdate) &&  new Date(o.dateTime) <= new Date( req.body.enddate)));
        console.log("SentLabReports fetched:", sentres.docs.map(s=>s.data()).length);

        let callFlowReports= admin.firestore().collection("callFlowReports")   
        .where("companyId","==",req.body.company)
        //.where("timeCal",">=",startnum)
        //.where("timeCal","<=",endnum)
        let calres= await callFlowReports.get();
        //callFlowReportsDocs=calres.docs.map(s=>s.data()).filter(o=>( o.dateTime !=undefined) && (new Date(o.dateTime) >= new Date( req.body.startdate) &&  new Date(o.dateTime) <= new Date( req.body.enddate)));
        console.log("CallFlowReports fetched:", calres.docs.map(s=>s.data()).length);

        var reportsdata={'sent': sentres.docs.map(s=>s.data()),'call':calres.docs.map(s=>s.data())};

        // Send response
        res.status(200).send({
            message: "SentenceLab report generated successfully",
            status: true,
            data: reportsdata,
            count: 0,
        });

    } catch (error) {
        console.error("Error generating learner report:", error);
        res.status(500).send({ message: "Something went wrong", status: false });
    }
};
const pronunciationLabReportlistDashboard = async (req, res) => {
    try {
        console.log("prolab report-----------------------")
        console.log(req.body)

        //req.body.startdate = moment(req.body.startdate).startOf('day').format('DD-MMM-YYYY')
        //req.body.enddate = moment(req.body.enddate).endOf('day').format('DD-MMM-YYYY')
        //let startnum = new Date(req.body.perioddate[0]).getTime();
        //let endnum = new Date(req.body.perioddate[1]).getTime();

        let proquery = admin.firestore().collection("proLabReports")
            .where("companyId", "==", req.body.company)
           // .where("timeCal", ">=", startnum)
            //.where("timeCal", "<=", endnum)

        const prolabsnapshot = await proquery.get();

        let prolabres = prolabsnapshot.docs.map(s => s.data())//.filter(o=> (new Date(o.date)) >= (new Date(req.body.perioddate[0])) &&  (new Date(o.date)) <= (new Date(req.body.perioddate[1])));

        res.status(200).send({ message: "pronuncation lab listing overall", data: prolabres, status: true })
    }
    catch (error) {
        console.log("Error:{");
        console.log(error)
        console.log("Error:}");

        res.status(500).send({ message: error, status: false })
    }
}
const learninghoursReportlistDashboard= async(req,res)=>{
    try {

        console.log(req.body)
    
     
        let arsimtime= admin.firestore().collection("ARCallSimulationTimeStamp").where("companyID","==",req.body.company)//.orderBy('createdAt')
        let prosimtime= admin.firestore().collection("ProfluentEnglishTimeStamp").where("companyID","=",req.body.company)//.orderBy('createdAt')
        let softsimtime= admin.firestore().collection("SoftSkillsTimeStamp").where("companyID","==",req.body.company)
        let proslernsimtime= admin.firestore().collection("processLearningTimeStamp").where("companyID","==",req.body.company)

        // if(req.body.startdate){
        //     arsimtime=arsimtime.where("createdAt",">=", new Date( req.body.startdate)).where("createdAt","<=", new Date(req.body.enddate))//.where("companyID","==",req.body.company)
        //     prosimtime=prosimtime.where("createdAt",">=", new Date( req.body.startdate)).where("createdAt","<=", new Date(req.body.enddate))
        //     softsimtime=softsimtime.where("createdAt",">=", new Date( req.body.startdate)).where("createdAt","<=", new Date(req.body.enddate))
        //     proslernsimtime=proslernsimtime.where("createdAt",">=", new Date( req.body.startdate)).where("createdAt","<=", new Date(req.body.enddate))
        // }

        let ressnap= await arsimtime.get()
        let rese=ressnap.docs.map(s=>s.data());
        // await proslernsimtime.get().then(snapshot  =>{
        //     if (snapshot.empty) {
        //         console.log('No matching documents.');
        //         return;
        //       }
        //       snapshot.forEach(doc => {
        //         let ele2=doc.data();
        //         if (ele2.companyID == undefined) {
        //             console.log(`Deleting document with ID: ${doc.id}`);

        //             doc.ref.delete();
        //         }
        //       });
        // });
       
        let ressnap2= await prosimtime.get()
        let rese2=ressnap2.docs.map(s=>s.data());

        let ressnap3= await softsimtime.get()
        let rese3=ressnap3.docs.map(s=>s.data());

        let ressnap4= await proslernsimtime.get()
        let rese4=ressnap4.docs.map(s=>s.data());

        console.log(rese.length)

      
      
        //var udata1=udata.filter(m=>m.arcallsim.length !=0 || m.profluenteng.length !=0 || m.softskills.length !=0 || m.processlearning.length !=0  )
        let retdata={"AR":rese,"ProFlue":rese2,"Softskill":rese3,"ProcessLern":rese4}

        res.status(200).send({ message: "Learning Hours overall", data: retdata, status: true });


    }
    catch(error){
        console.log(error)
        res.status(500).send({ message: "somthing went wrong", status: false })
    }
}

const getDashboardUsersReports = async (req, res) => {
    try {

      console.log(req.body);
  
      let status = ["1", "2"];
      let reqdata = req.body;

    //   let query22 = admin.firestore().collection("batch")
    // const snapshot22 = await query22
    //     .get();

    //      let data22 = [];
    //     snapshot22.forEach(doc => {
    //         data22.push({ _id: doc.id, ...doc.data() });
    //     });
     
    //   fs.writeFile('batch.json', JSON.stringify( data22), 'utf8');

      let query = admin.firestore().collection("UserNode")
        .where('access', '==', 'App User')
        //.where('status', 'in', status);
  
      // Apply additional filters if they exist
      if (reqdata.Company) {
        query = query.where("companyid", "==", reqdata.Company);
      }
   
      // Fetch data without applying the search term
      //let count = (await query.get()).size;
      let count=0;
      const snapshot = await query
        .orderBy('status')  // Sort by status first
        .orderBy('createAt', 'desc') // Sort by createAt within each status group
        .get();
  
        let data = [];
        snapshot.forEach(doc => {
            data.push({ _id: doc.id, ...doc.data() });
        });
        console.log("Users list: ",data.length)

      // Return the filtered data
      return res.status(200).send({
        data,
        count,
        message: "Users fetched successfully",
        status: true
      });
  
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Something went wrong", statusP: false });
    }
  };
const getDashboardCompaniesReports = async (req, res) => {
    try {
        let sentLabReports = admin.firestore().collection("sentLabReports")
        let sentres = await sentLabReports.get();

        let callFlowReports = admin.firestore().collection("callFlowReports")
        let calres = await callFlowReports.get();

        let proquery = admin.firestore().collection("proLabReports")
        const prolabsnapshot = await proquery.get();

        let prolabres = prolabsnapshot.docs.map(s => s.data())

        let arsimtime = admin.firestore().collection("ARCallSimulationTimeStamp")//.where("companyID", "==", req.body.company)//.orderBy('createdAt')
        let prosimtime = admin.firestore().collection("ProfluentEnglishTimeStamp")//.where("companyID", "=", req.body.company)//.orderBy('createdAt')
        let softsimtime = admin.firestore().collection("SoftSkillsTimeStamp")//.where("companyID", "==", req.body.company)
        let proslernsimtime = admin.firestore().collection("processLearningTimeStamp")//.where("companyID", "==", req.body.company)

        let ressnap = await arsimtime.get()
        let rese = ressnap.docs.map(s => s.data());


        let ressnap2 = await prosimtime.get()
        let rese2 = ressnap2.docs.map(s => s.data());

        let ressnap3 = await softsimtime.get()
        let rese3 = ressnap3.docs.map(s => s.data());

        let ressnap4 = await proslernsimtime.get()
        let rese4 = ressnap4.docs.map(s => s.data());

        //console.log(rese.length)

        let retdata = { "AR": rese, "ProFlue": rese2, "Softskill": rese3, "ProcessLern": rese4 }

        var reportsdata = { 'sent': sentres.docs.map(s => s.data()), 'call': calres.docs.map(s => s.data()), 'prolabres': prolabres, 'retdata': retdata };
        res.status(200).send({ message: "Overall companies report", data: reportsdata, status: true });
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ message: "somthing went wrong", status: false })
    }
}
const getScenarioSummary = async (req, res) => {
    try {
        const { userid } = req.body;

        const firestore = admin.firestore();
        // const PracticeModel = require("./models/practice"); // MongoDB model

        const sentLabReports = await firestore.collection("sentLabReports").where("userId", "==", userid).get();
        const callFlowReports = await firestore.collection("callFlowReports").where("userId", "==", userid).get();

        const scenarioSummary = {};

        [...sentLabReports.docs, ...callFlowReports.docs].forEach((doc) => {
            const data = doc.data();
            const scenario = `${data.main || "Unknown"} > ${data.load || "Unknown"}`;

            if (!scenarioSummary[scenario]) {
                scenarioSummary[scenario] = {
                    scenario,
                    noOfSentences: 0,
                    listeningAttempts: 0,
                    practiceAttempts: 0,
                    averageScore: 0,
                    practiceTime: 0,
                };
            }

            scenarioSummary[scenario].noOfSentences += 1;
            scenarioSummary[scenario].listeningAttempts += data.listatt || 0;
            scenarioSummary[scenario].practiceAttempts += data.pracatt || 0;
            scenarioSummary[scenario].averageScore += data.score || 0;
        });

        // Finalize scores and practice time
        Object.values(scenarioSummary).forEach((summary) => {
            summary.averageScore = summary.practiceAttempts
                ? (summary.averageScore / summary.practiceAttempts).toFixed(2) + "%"
                : "0%";
            summary.practiceTime = "0:00"; // Adjust if practice time data is available
        });

        res.status(200).send({
            status: true,
            message: "Scenarios fetched successfully",
            data: Object.values(scenarioSummary),
        });
    } catch (error) {
        console.error("Error fetching scenarios:", error);
        res.status(500).send({ status: false, message: "Something went wrong" });
    }
};


const getScenarioDateDetails = async (req, res) => {
    try {
        const { userid, scenario } = req.body;

        if (!userid || !scenario) {
            return res.status(400).send({
                status: false,
                message: "User ID and scenario are required",
            });
        }

        const [main, load] = scenario.split(">");
        if (!main || !load) {
            return res.status(400).send({
                status: false,
                message: "Invalid scenario format. Expected format: 'Main > Load'",
            });
        }

        const firestore = admin.firestore();

        // Fetch SentLabReports for the scenario
        const sentLabReportsQuery = await firestore
            .collection("sentLabReports")
            .where("userId", "==", userid)
            .where("main", "==", main.trim())
            .where("load", "==", load.trim())
            .get();

        // Fetch CallFlowReports for the scenario
        const callFlowReportsQuery = await firestore
            .collection("callFlowReports")
            .where("userId", "==", userid)
            .where("main", "==", main.trim())
            .where("load", "==", load.trim())
            .get();

        const dateDetails = {};

        const timePerAttempt = 1; // Assume each practice attempt takes 1 minute (adjust as necessary)

        [...sentLabReportsQuery.docs, ...callFlowReportsQuery.docs].forEach((doc) => {
            const data = doc.data();
            // Ensure `dateTime` exists and is a Firestore Timestamp or string
            let createdAt = data.dateTime ? data.dateTime.toDate ? data.dateTime.toDate() : new Date(data.dateTime) : new Date(0);

            // If createdAt is invalid, skip this document
            if (createdAt.toString() === "Invalid Date") return;

            // Format date as 'DD-MMM-YYYY' (e.g., '29-Nov-2024')
            const day = createdAt.getDate().toString().padStart(2, '0');
            const month = createdAt.toLocaleString('default', { month: 'short' });
            const year = createdAt.getFullYear();
            const formattedDate = `${day}-${month}-${year}`;

            // If the date is not already in dateDetails, initialize it
            if (!dateDetails[formattedDate]) {
                dateDetails[formattedDate] = {
                    date: formattedDate,
                    noOfSentences: 0,
                    listeningAttempts: 0,
                    practiceAttempts: 0,
                    totalScore: 0,  // Accumulate scores from focusWords
                    practiceTime: 0, // Initialize practice time as 0
                };
            }

            // Increment counters based on data fields
            dateDetails[formattedDate].noOfSentences += 1;
            dateDetails[formattedDate].listeningAttempts += data.listatt || 0;
            dateDetails[formattedDate].practiceAttempts += data.pracatt || 0;

            // Calculate total score by averaging the focusWord scores
            let totalFocusScore = 0;
            let numFocusWords = 0;

            for (let timestamp in data.focusWord) {
                // Get the score from the last element of the array
                const score = parseFloat(data.focusWord[timestamp].slice(-1)[0]);
                if (!isNaN(score)) {
                    totalFocusScore += score;
                    numFocusWords += 1;
                }
            }

            if (numFocusWords > 0) {
                dateDetails[formattedDate].totalScore += totalFocusScore / numFocusWords;
            }

            // Calculate the practice time in minutes (1 minute per practice attempt)
            const practiceAttempts = data.pracatt || 0;
            dateDetails[formattedDate].practiceTime += practiceAttempts * timePerAttempt;
        });

        // Finalize average score and format practiceTime
        Object.values(dateDetails).forEach((detail) => {
            // Calculate average score
            detail.averageScore = detail.practiceAttempts
                ? ((detail.totalScore / detail.practiceAttempts).toFixed(2) + "%")
                : "0%";

            // Format practiceTime to HH:MM (based on the total minutes)
            const hours = Math.floor(detail.practiceTime / 60);
            const minutes = detail.practiceTime % 60;
            detail.practiceTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        });

        res.status(200).send({
            status: true,
            message: "Date-wise data fetched successfully",
            data: Object.values(dateDetails),
        });
    } catch (error) {
        console.error("Error fetching date-wise data:", error);
        res.status(500).send({ status: false, message: "Something went wrong" });
    }
};





const getSentencesByScenario = async (req, res) => {
    try {
        const { userid, scenario, date } = req.body;

        // Validate input
        if (!userid || !scenario || !date) {
            return res.status(400).send({
                status: false,
                message: "User ID, scenario, and date are required",
            });
        }

        const [main, load] = scenario.split(">");
        if (!main || !load) {
            return res.status(400).send({
                status: false,
                message: "Invalid scenario format. Expected format: 'Main > Load'",
            });
        }

        const firestore = admin.firestore();

        // Fetch SentLabReports for the scenario (without filtering by dateTime)
        const sentLabReportsQuery = await firestore
            .collection("sentLabReports")
            .where("userId", "==", userid)
            .where("main", "==", main.trim())
            .where("load", "==", load.trim())
            .get();

        // Fetch CallFlowReports for the scenario (without filtering by dateTime)
        const callFlowReportsQuery = await firestore
            .collection("callFlowReports")
            .where("userId", "==", userid)
            .where("main", "==", main.trim())
            .where("load", "==", load.trim())
            .get();

        const result = [];
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0); // Start of the day
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999); // End of the day

        // Helper function to format practice time in HH:MM format
        const formatPracticeTime = (practiceAttempts) => {
            const timeInMinutes = practiceAttempts * 1; // Assume 1 minute per attempt, adjust as needed
            const hours = Math.floor(timeInMinutes / 60);
            const minutes = timeInMinutes % 60;
            return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        };

        // Process SentLabReports
        sentLabReportsQuery.docs.forEach((doc) => {
            const data = doc.data();
            console.log(data);
            
            const docDateTime = new Date(data.dateTime);
            if (docDateTime >= startOfDay && docDateTime <= endOfDay) {
                // Calculate the average score
                const score = data.score || 0;
                const practiceAttempts = data.pracatt || 1;  // Avoid division by zero
                
                result.push({
                    sentences: data.sentence || "N/A", // Sentence text
                    category: "Sentence Lab",
                    scenarios: `${data.main} > ${data.load}`,
                    date: docDateTime.toISOString().split("T")[0],
                    listeningAttempts: data.listatt || 0,
                    practiceAttempts: practiceAttempts,
                    averageScore: `${(score / practiceAttempts).toFixed(2)} %`, // Calculate average score
                    practiceTime: formatPracticeTime(practiceAttempts), // Calculate practice time
                });
            }
        });

        // Process CallFlowReports
        callFlowReportsQuery.docs.forEach((doc) => {
            const data = doc.data();
            console.log(data);

            const docDateTime = new Date(data.dateTime);
            if (docDateTime >= startOfDay && docDateTime <= endOfDay) {
                // Calculate the average score
                const score = data.score || 0;
                const practiceAttempts = data.pracatt || 1;  // Avoid division by zero
                
                result.push({
                    sentences: data.sentence || "N/A", // Sentence text
                    category: "Call Flow Lab",
                    scenarios: `${data.main} > ${data.load}`,
                    date: docDateTime.toISOString().split("T")[0],
                    listeningAttempts: data.listatt || 0,
                    practiceAttempts: practiceAttempts,
                    averageScore: `${(score / practiceAttempts).toFixed(2)} %`, // Calculate average score
                    practiceTime: formatPracticeTime(practiceAttempts), // Calculate practice time
                });
            }
        });

        // Send the final result in the required format
        res.status(200).send({
            status: true,
            message: "Data fetched successfully for the given date",
            data: result,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send({ status: false, message: "Something went wrong" });
    }
};





const getPracticeDetailsBySentence = async (req, res) => {
    try {
        const { userid, scenario, sentence, date } = req.body;

        // Split the scenario using regex to handle both with and without spaces around '>'
        const scenarioParts = scenario.split(/\s*>\s*/);

        let main = scenarioParts[0]?.trim();
        let load = scenarioParts[1]?.trim() || ''; // If load is not provided, set it to empty string

        // Debugging: Log the parsed values of main, load, sentence, and date
        console.log("Parsed Values:", { main, load, sentence, date });

        if (!main) {
            return res.status(400).send({
                status: false,
                message: "Invalid scenario format. Expected 'Main > Load' or just 'Main'.",
            });
        }

        const firestore = admin.firestore();

        // If date is provided, create a JavaScript Date object
        let dateFilter = null;
        if (date) {
            const targetDate = new Date(date);
            const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
            dateFilter = { start: startOfDay, end: endOfDay };
        }

        // Fetch Sentence Lab and Call Flow practice data from Firestore
        const [sentenceLabDocs, callFlowDocs] = await Promise.all([
            firestore
                .collection("sentLabReports")
                .where("userId", "==", userid)
                .where("main", "==", main)
                .where("load", "==", load)
                .where("sentence", "==", sentence)
                .get(),

            firestore
                .collection("callFlowReports")
                .where("userId", "==", userid)
                .where("main", "==", main)
                .where("load", "==", load)
                .where("sentence", "==", sentence)
                .get(),
        ]);

        // Debugging: Log the number of documents returned by each query
        console.log("Sentence Lab Docs:", sentenceLabDocs.size);
        console.log("Call Flow Docs:", callFlowDocs.size);

        const practiceData = [];

        // Process Sentence Lab Data
        sentenceLabDocs.forEach((doc) => {
            const data = doc.data();
            console.log(data);

            // Ensure the date is a valid Firestore Timestamp or string and convert it to JavaScript Date
            let docDate;
            if (data.dateTime) {
                if (typeof data.dateTime === 'string') {
                    docDate = new Date(data.dateTime);
                } else if (data.dateTime.toDate) {
                    docDate = data.dateTime.toDate();
                }
            }

            // If dateFilter exists, check if the document date is within the given date range
            if (dateFilter && (docDate < dateFilter.start || docDate > dateFilter.end)) {
                return;
            }

            // Extract focus words and average score for each time
            if (data.focusWord) {
                Object.entries(data.focusWord).forEach(([timestamp, focusWords]) => {
                    const avgScore = focusWords[focusWords.length - 1]; // The last element is the average score
                    practiceData.push({
                        date: data.dateTime,
                        time: timestamp,
                        focusWords: focusWords.slice(0, -1), // Exclude the last element (average score)
                        score: avgScore,
                    });
                });
            }
        });

        // Process Call Flow Data
        callFlowDocs.forEach((doc) => {
            const data = doc.data();
            console.log(data);

            let docDate;
            if (data.dateTime) {
                if (typeof data.dateTime === 'string') {
                    docDate = new Date(data.dateTime);
                } else if (data.dateTime.toDate) {
                    docDate = data.dateTime.toDate();
                }
            }

            if (dateFilter && (docDate < dateFilter.start || docDate > dateFilter.end)) {
                return;
            }

            if (data.focusWord) {
                Object.entries(data.focusWord).forEach(([timestamp, focusWords]) => {
                    const avgScore = focusWords[focusWords.length - 1];
                    practiceData.push({
                        date: data.dateTime,
                        time: timestamp,
                        focusWords: focusWords.slice(0, -1), // Exclude the last element (average score)
                        score: avgScore,
                    });
                });
            }
        });

        // Sort practice data by date and time
        practiceData.sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));

        // Return the result
        res.status(200).send({
            status: true,
            message: "Practice details fetched successfully",
            data: practiceData,
        });
    } catch (error) {
        console.error("Error fetching practice details:", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong",
        });
    }
};









/**********************************************************************************************************************************************************************************************************************/

module.exports = {
    getUsersList,
    postLogin,
    roleCheck,
    subAdminslist,
    createUpdateSubAdmin,
    getSubadmin,
    deleteSubAdmin,
    companyList,
    addeditcompany,
    company_subadmin_Delete,
    getCompany,
    companyStatus,
    getcompanynames,
    addedituser,
    getuserDetails,
    userStatus,
    deleteUser,
    bulkuploaduser,
    addcompanySubadmin,
    companySubadminList,
    getcompanysubadmin,
    addeditBatch,
    getbatchlist,
    batchStatus,
    getBatchDetails,
    batchUsers,
    deletebathuser,
    chagneBatchList,
    shiftBatch,
    profileData,
    updateprofile,
    adduserbatchlist,
    addUserToBatch,
    deletedUserslist,
    permanentDeleteUser,
    restoreUser,
    addeditTrainer,
    trainersList,
    updateTrainerStatus,
    deleteTrainer,
    batchCompanyList,
    // smtpSetting,
    // smtpSave,
    companyDelete,
    createBatch,
    viewCreatedBatch,
    batchCreatedAdd,
    batchCreateAndMove,
    editBatch,
    bacthnewUserList,
    addUsertoBatch,
    shiftBathlist,
    //sentance callflow report
    generateLearnerReport,
    getScenarioSummary,
    getScenarioDateDetails,
    getSentencesByScenario,
    getPracticeDetailsBySentence,
    
    generateSentenceLabReportDashbpard,
    learninghoursReportlistDashboard,
    pronunciationLabReportlistDashboard,
    getDashboardUsersReports,
    getDashboardCompaniesReports
}












            // const snapshot = await admin.firestore().collection("subAdmins").where("_id", "==", data._id).get();

            // if (!snapshot.empty) {
            //     const updatePromises = snapshot.docs.map(doc => 
            //         admin.firestore().collection("subAdmins").doc(doc.id).update(data)
            //     );
    
            //     await Promise.all(updatePromises);
            //     res.status(200).send({ message: "Sub admin updated successfully", status: true });
            // } else {
            //     res.status(404).send({ message: "No sub admin found with the given ID", status: false });
            // }


            ////////////////////////////////////////////////////////////////////////////////////pagination implemented by me itself



            // let data = []
            // let query = admin.firestore().collection("subAdmins");
            // console.log(req.body);
            // if (req.body.search) {
            //     console.log("inside");
            //     query = query.where("name", "==", req.body.search);
            // }
            // const collectionRef = admin.firestore().collection('subAdmins');
            // const snapshot = await collectionRef.count().get();
            // let counts=snapshot.data().count
            // query.where("access","==","subAdmin").limit(req.body.limit).offset(req.body.skip).get()
            // .then(snapshot => {
            //               snapshot.forEach(doc => {
            //                     data.push(doc.data())
            //             })
            //             res.send({ message: "sub admin list", data: data, status: true,count:counts }) //here want to implement the actual count of the document that we got
            //         }) 



            //**********************************************************************************update methode another way*********************************************************


            //  let result= admin.firestore().collection("subAdmins").where("_id","==",data._id).get()
            //  .then(snapshot=>{
            //     snapshot.forEach((doc)=>{
            //         admin.firestore().collection("subAdmins").doc(doc.id).update(data).then((res)=>{
            //             return res.send({message:"Updated successfully",status:true})
            //         }).catch((error)=>{
            //             console.log(error);
            //             return res.status(500).send({message:"somthing went wrong",status:true})
            //         })
            //     })
            //  })

            //***********************************************************************************delete the documetn ***************************************************************************


            // let snapshots=await admin.firestore().collection("companies").where("access","==","App User").get()
            // snapshots.docs.map((doc)=>doc.ref.delete())


            //////////***************************************************************batch creation original code written by me */
        //     let today=moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        //     let filterdate=moment().subtract(data.date,"months").startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        //     let idofbatch
        //    await admin.firestore().collection("batch").add(data).then((docRef)=>{
        //         idofbatch=docRef.id
        //         return docRef.update({_id:docRef.id})
        //     })
        //     let userdatas=[]
        //    await admin.firestore().collection("UserNode").where("joindate",">=",filterdate).get().then((snapshot)=>{
        //         snapshot.forEach((doc)=>{
        //             userdatas.push(doc.data())
        //         })
        //     })  
        //     let userids=userdatas.map(x=>x._id)
        //     for(let id of userids){
        //         admin.firestore().collection("userbatch").add({userid:id,batchid:idofbatch}).then((docref)=>{
        //             return docref.update({_id:docref.id})
        //         })
        //     }
        //     res.send({message:"batch created",status:true})
        



        // previous bulk upload concurrent validtion removed by midhun 

                    // let countryExists = companydata.countryCity.some(x => x.country.toLowerCase() === data.country.toLowerCase());
            // if (countryExists) {
            //     let cityExists = companydata.countryCity.find(x => x.country.toLowerCase() === data.country.toLowerCase()).city.includes(data.city.toLowerCase());
            //     if (cityExists && rolelist.includes(data.role) && teamlist.includes(data.team) ) {
            //         let result = await admin.firestore().collection("UserNode").add(data);
            //         await admin.firestore().collection("UserNode").doc(result.id).update({ _id: result.id });
            //         insertcount++;
            //     } else {
            //         // count++;
            //         // skippeddocumets.push({ name: data.username, issues: {exists:true,city:"City not existed",}, data });
            //     issues.city = {exists:true,reason:"The city does not exist."}
                    
            //     }
            // } else {
            //     // count++;
            //     // skippeddocumets.push({ name: data.username, issues: {exists:true,country:"Country not existed"}, data });
            //     issues.country=  {exists:true,reason:"The country does not exist."}
            // }

const XLSX  =require("xlsx");
// const moment=require("moment")
const {admin}=require("../config/firebaseConfig")
const firebbase = require("firebase-admin");
const moment =require("moment")



const trainerUserList=async(req,res)=>{
    try {
        let status = [];
        let reqdata=req.body.filter_action
        let reqstatus=reqdata.Status
        if (reqstatus === "3") {
            status = ["1", "2"];
        } else if (reqstatus === '1') {
            status = ["1"];
        } else if (reqstatus ==='2') {
            status = ["2"];
        } else if (reqstatus === '0') {
            status = ["0"];
        }else{
           
            status=["1","2"]
        }
      

        let query = admin.firestore().collection("UserNode")
        .where('access', '==', 'App User')
        .where('status', 'in', status)
        if(reqdata.Company){
            query=query.where("companyid","==",reqdata.Company);
        }
        if(reqdata.City){
            query=query.where("city","==",reqdata.City)
        }
        if(reqdata.Country){
            query=query.where("country","==",reqdata.Country)
        }
        if(reqdata.Role){
            query=query.where("role","==",reqdata.Role)
        }
        if(reqdata.Team){
            query=query.where("team","==",reqdata.Team)
        }
        if(reqdata.From_Date){
            reqdata.From_Date=moment(reqdata.From_Date).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            console.log(reqdata.From_Date)
            query=query.where("joindate", ">=", reqdata.From_Date)
        }
        
        if(reqdata.To_Date){
        
            reqdata.To_Date=moment(reqdata.To_Date).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            console.log(reqdata.To_Date)
            query=query.where("joindate", "<=", reqdata.To_Date)
        }
        
        if(req.body.search){
            console.log("inside")
            let searchTerm=req.body.search.toLowerCase()
            console.log(searchTerm)
            query = query.where("username", ">=", searchTerm)
                         .where("username", "<=", searchTerm + "\uf8ff");
        }
        let count=(await query.get()).size
        const snapshot = await query.offset(req.body.skip).limit(req.body.limit).orderBy("createAt","desc").get();
            
            let data = [];
            snapshot.forEach(doc => {
                data.push({_id: doc.id, ...doc.data()});
            });
           return  res.status(200).send({ data,count, message: "Users fetched successfully",status: true, });
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}

const trainercompanyData=async(req,res)=>{
    try {
        let {id}=req.body
        let companyData=(await admin.firestore().collection("UserNode").doc(id).get()).data()
        res.send({message:"companyData",data:companyData,status:true})
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"somthing went wrong",status:false})
    }
}


module.exports={
    trainerUserList,
    trainercompanyData
}

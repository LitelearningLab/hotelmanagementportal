
const notificationSchema = require("../model/notification")
const { admin } = require("../config/firebaseConfig")
const practicedb = require("../model/practiceSchema")
const pronunciationlabSchema = require("../model/pronunciationlabSchema")
const sentencesLabReport = require("../model/sentenceslabSchema")
const momenttz = require("moment-timezone")

const moment = require('moment')
const { query, where, getDocs } = require('firebase/firestore');
const firebbase = require("firebase-admin");
const pronunciatonLabReport = require("../model/pronunciationlabSchema")
const axios = require("axios")
const dotenv = require("dotenv")
const { response } = require("../routes/admin")
dotenv.config()
const smsSchema = require("../model/smsSchema")
const momettz = require("moment-timezone")



const notificationList = async (req, res) => {
    try {

        const condition = { status: 1 }
        if (req.body.search) [
            condition['$or'] = [{ title: { $regex: req.body.search, $options: 'i' } }]
        ]
        let query = []

        query.push({ $match: condition })

        query.push({ $sort: { createdAt: -1 } });


        if (req.body.skip !== undefined && req.body.limit !== undefined) {
            query.push({ $skip: parseInt(req.body.skip, 0) });
            query.push({ $limit: parseInt(req.body.limit, 10) });
        }


        const count = await notificationSchema.countDocuments({ status: { $in: [1, 2] } });

        let result = await notificationSchema.aggregate(query)

        res.status(200).send({ message: "Fetched successfuly", status: true, data: result, count: count > 0 ? count : 0 });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "somthing went wrong", status: "false" })
    }
}

const startPractice = async (req, res) => {
    try {
        let action = req.body.action
        delete req.body.action
        let data = req.body
        data.date = momenttz().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss')
        let startdate = momenttz().tz("Asia/Kolkata").startOf("day").format('YYYY-MM-DD HH:mm:ss')
        let enddate = momenttz().tz("Asia/Kolkata").endOf("day").format('YYYY-MM-DD HH:mm:ss')

        let uesrExsist = await practicedb.findOne({ userid: data.userid, practicetype: req.body.practicetype, date: { $gte: startdate, $lte: enddate } })
        console.log(uesrExsist)
        if (uesrExsist) {
            if (["Pronunciation Lab Report", "Sentence Construction Lab Report", "Call Flow Practise Report", "Sound-wise Report", "Pronunciation Sound Lab Report"].includes(data.practicetype)) {
                delete data.date
                if (action === "practice") {

                    data.currentSessionStart = new Date()
                }
                await practicedb.updateOne({ userid: data.userid, practicetype: req.body.practicetype, date: { $gte: startdate, $lte: enddate } }, { $set: { ...data } })
                if (action === "listening") {

                    await practicedb.updateOne({ userid: data.userid, practicetype: req.body.practicetype, date: { $gte: startdate, $lte: enddate } }, { $inc: { listeningcount: 1 } })
                } else {
                    //    if(uesrExsist.currentSessionStart!=null){

                    //        let s= await practicedb.updateOne({ userid: data.userid, practicetype: req.body.practicetype, date: { $gte: startdate, $lte: enddate } } )
                    //    }else{

                    //        let s= await practicedb.updateOne({ userid: data.userid, practicetype: req.body.practicetype, date: { $gte: startdate, $lte: enddate } }, { $inc: { practicecount: 1 } })
                    //    }

                }
                res.send({ message: "pracitice session has started", status: true })
            } else {
                res.send({ message: "Plesea give a valid practice type", status: false })
            }

        } else {
            if (["Pronunciation Lab Report", "Sentence Construction Lab Report", "Call Flow Practise Report", "Sound-wise Report","Pronunciation Sound Lab Report"].includes(data.practicetype)) {

                data.currentSessionStart = new Date();
                if (action === "listening") {

                    data.listeningcount = 1
                } else {
                    data.practicecount = 0
                }
                let practiceData = new practicedb(data)
                let result = await practiceData.save()
                res.status(200).send({ message: "created the session", status: true })
            } else {
                res.send({ message: "Plesea give a valid practice type", status: false })
            }


        }



    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "somthing went wrong", status: false })
    }
}



const endPractice = async (req, res) => {
    try {
        let action = req.body.action;
        let scoredata = req.body.score;
        let successCount = req.body.successCount;
        console.log(successCount);
         // New field for 'Pronunciation Sound Lab Report'
        delete req.body.score;
        delete req.body.successCount;

        let startdate = momenttz().tz("Asia/Kolkata").startOf("day").format('YYYY-MM-DD HH:mm:ss');
        let enddate = momenttz().tz("Asia/Kolkata").endOf("day").format('YYYY-MM-DD HH:mm:ss');

        // Check if practicetype is valid
        if ([
            "Pronunciation Lab Report",
            "Sentence Construction Lab Report",
            "Call Flow Practise Report",
            "Sound-wise Report",
            "Pronunciation Sound Lab Report"
        ].includes(req.body.practicetype)) {
            let data = req.body;

            // Check if user exists for the given practice type and date
            let userExsist = await practicedb.findOne({
                userid: data.userid,
                practicetype: req.body.practicetype,
                date: { $gte: startdate, $lte: enddate }
            });

            if (!userExsist) return res.status(404).send({ message: 'User not found' });
            if (!userExsist.currentSessionStart) return res.status(400).send({ message: 'No session started' });

            const sessionStart = new Date(userExsist.currentSessionStart);
            const sessionEnd = new Date();
            const duration = (sessionEnd - sessionStart) / 1000; // Calculate session duration in seconds

            // Update total practice time and reset currentSessionStart
            data.totalPracticeTime = (userExsist.totalPracticeTime || 0) + duration;
            data.currentSessionStart = null;

            // Handle different actions
            if (action === "listening") {
                // Listening action logic (if any)
            } else {
                // Increment practice count for other actions
                if (userExsist.currentSessionStart != null) {
                    await practicedb.updateOne({
                        userid: data.userid,
                        practicetype: req.body.practicetype,
                        date: { $gte: startdate, $lte: enddate }
                    }, { $inc: { practicecount: 1 } });
                }
            }

            // Handle "Pronunciation Sound Lab Report" specifically
            if (req.body.practicetype === "Pronunciation Sound Lab Report") {
                // Validate successCount value
                if (successCount !== "correct" && successCount !== "wrong") {
                    return res.status(400).send({
                        message: "Invalid successCount value. Must be 'correct' or 'wrong'.",
                        status: false
                    });
                }

                // Update successCount as an array of strings
                await practicedb.updateOne({
                    userid: data.userid,
                    practicetype: req.body.practicetype,
                    date: { $gte: startdate, $lte: enddate }
                }, {
                    $set: { ...data },
                    $push: { successCount: successCount } // Append "correct" or "wrong"
                });

            } else {
                // Update score for other practice types
                await practicedb.updateOne({
                    userid: data.userid,
                    practicetype: req.body.practicetype,
                    date: { $gte: startdate, $lte: enddate }
                }, {
                    $set: { ...data },
                    $push: { score: scoredata }
                });
            }

            res.status(200).send({ message: "Session has ended successfully", status: true });
        } else {
            res.send({ message: "Please provide a valid practice type", status: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong", status: false });
    }
};


const pronunciationLabReport = async (req, res) => {
    try {
        console.log(req.body)
        const { userid, type, word } = req.body
        console.log(word)
        let dataexsist = await pronunciationlabSchema.findOne({ userid: userid })

        if (dataexsist) {
            if (type === "practice") {
                let result = await pronunciationlabSchema.updateMany(
                    { _id: dataexsist._id },
                    {
                        $inc: { practiceattempt: 1 },
                        $addToSet: { words: word }
                    },
                    {
                        multi: true
                    }
                );
            } else if (type === "listening") {
                let result = await pronunciationlabSchema.updateMany(
                    { _id: dataexsist._id },
                    {

                        $addToSet: { words: word },
                        $inc: { listeningattempt: 1 }
                    },
                    {
                        multi: true
                    }
                );

            } else if (type === "correct") {
                let result = await pronunciationlabSchema.updateMany(
                    { _id: dataexsist._id },
                    {
                        $inc: { correctattempt: 1 },
                        $addToSet: { words: word }
                    },
                    {
                        multi: true
                    }
                );
            }
            res.send({ message: "updated successfully", status: true })

        } else {

            let userdata = (await admin.firestore().collection("UserNode").doc(userid).get()).data()
            let companydata = (await admin.firestore().collection("UserNode").doc(userdata.companyid).get()).data()
            let batchUserSnapshot = await admin.firestore().collection("userbatch").where("userid", "==", userid).get()
            let batchUserData
            if (!batchUserSnapshot.empty) {
                batchUserData = batchUserSnapshot.docs[0].data();
            } else {
                console.log("No matching documents.");
                return res.send({ message: "this user has no batch!! please add to a batch", status: false })
            }
            let batchdata = (await admin.firestore().collection("batch").doc(batchUserData.batchid).get()).data()

            let data
            if (type === "practice") {
                data = {
                    userid: userid,
                    userData: userdata,
                    username: userdata.username,
                    companyid: userdata.companyid,
                    companydata: companydata,
                    words: [word],
                    practiceattempt: 1,
                    numberofword: 1,
                    batchid: batchUserData.batchid,
                    batchdata: batchdata

                }

            } else if (type === "listening") {
                data = {
                    userid: userid,
                    userData: userdata,
                    companyid: userdata.companyid,
                    username: userdata.username,
                    companydata: companydata,
                    words: [word],
                    listeningattempt: 1,
                    numberofword: 1,
                    batchid: batchUserData.batchid,
                    batchdata: batchdata

                }

            } else if (type === "correct") {
                data = {
                    userid: userid,
                    userData: userdata,
                    companyid: userdata.companyid,
                    username: userdata.username,
                    companydata: companydata,
                    words: [word],
                    correctattempt: 1,
                    numberofword: 1,
                    batchid: batchUserData.batchid,
                    batchdata: batchdata

                }
            }
            let pronunciationdata = new pronunciationlabSchema(data)
            let result = await pronunciationdata.save()
            // console.log(result)
            res.send({ message: "pronunciation report stored successfully", status: true })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "somthing went wrong", status: false })
    }
}
const pronunciationLabReportlist = async (req, res) => {
    try {
    //     let query2 = []
         console.log(req.body)
    //     if (req.body.company) {
    //         query2.push({ $match: { companyid: req.body.company } })
    //     }
    //    // const practiceData1 = await practicedb.find().lean();
    //     let result =await pronunciationlabSchema.find()

    //     console.log("result")

    //     console.log(result)

        //console.log(req.body)
        req.body.startdate = moment(req.body.startdate).startOf('day').format('DD-MMM-YYYY')
        req.body.enddate = moment(req.body.enddate).endOf('day').format('DD-MMM-YYYY')
        
     
        //console.log(req.body.ustartdate)
        //console.log(req.body.uenddate)


        let query = admin.firestore().collection("UserNode")
        .where('companyid', '==', req.body.company)

        // if(req.body.city){
        //     //req.body.city = req.body.city.map(v => v.toLowerCase());
        //     query=query.where('city' ,'array-contains', req.body.city)//.where('city'.toLowerCase() ,'in', req.body.city)
            
        // }



        // if(req.body.team){
        //     req.body.team = req.body.team.map(v => v.toLowerCase());
        //     query=query.where(('team'),'in', req.body.team)
        // }

        // if(req.body.ustartdate){
        //     query=query.where(Date('joindate'), '>=', req.body.ustartdate)
        //     .where(Date('joindate'), '<=', req.body.uenddate)
        // }
        let startnum=  new Date(req.body.perioddate[0]).getTime();
        let endnum=  new Date(req.body.perioddate[1]).getTime();
        const usersnapshot=await query.get();
        let proquery= admin.firestore().collection("ProLabReports")
        .where("companyId", "==", req.body.company)
        //.where("timeCal",">=",startnum)
        //.where("timeCal","<=",endnum)
       
        // .where('date', '>=', req.body.startdate)
        // .where('date', '<=', req.body.enddate)

        const prolabsnapshot=await proquery.get();
       
        var citydata=[];
        let userres= usersnapshot.docs.map(s=>s.data())
        console.log("userres ..",userres.length)
        if (req.body.city.length !=0) {
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
        console.log("users data2 : ", userres.length);

        let prolabres= prolabsnapshot.docs.map(s=>s.data())//.filter(o=> (new Date(o.date)) >= (new Date(req.body.perioddate[0])) &&  (new Date(o.date)) <= (new Date(req.body.perioddate[1])));
       // prolabsnapshot.docs.map(s=>s.data()).forEach(o=>{
            //console.log("sysdate: ",new Date(o.date));
            //console.log("priodstartdate : ", new Date( req.body.perioddate[0]))
        //})
        console.log("prolabres", prolabres.length);
        userres = userres.map(obj => {
            obj['njoindate'] = new Date(obj.joindate)//moment(obj.joindate).startOf('day').format('YYYY-MM-DD');
            return {...obj}; 
          });
        //   userres.forEach(k=>{
        //     console.log("User joining date 1: ",k.joindate)
        //     console.log("User joining date 2: ",k.njoindate)
        //     console.log("User joining date 3: ",new Date( req.body.ustartdate))

        //   })
        //console.log('usersnapshot:',userres)
        if(req.body.ustartdate){
            userres =userres.filter(o=> (o.njoindate != undefined) && ( o.njoindate >= new Date( req.body.ustartdate) &&  o.njoindate <= new Date( req.body.uenddate)));
        }
        //console.log(userres);

       // console.log('prolabsnapshot:')
        console.log("prolabres : ",prolabres.length)

        const udata=userres.map(a1=>{
            //console.log("----------------------------A1111111111111-------------------")
            //console.log(a1);
            const prdata = prolabres.filter(a2=>a2.userId == a1._id)
            //console.log("----------------------------A2222222222222222-------------------")
            //console.log(prdata)
            //console.log(prdata.length)
            //if(prdata.length !=0){
                return { ...a1,prdata};
            //}
        });
        //console.log(udata.filter(ss=>ss.prdata.length !=0));

        res.status(200).send({ message: "pronuncation lab listing overall", data: udata.filter(ss=>ss.prdata.length !=0), status: true })

    }
    catch (error) {
        console.log("Error:{");
        console.log(error)
        console.log("Error:}");

        res.status(500).send({ message: error, status: false })
    }
}

const pronunciationLabReportlist2 = async (req, res) => {
    try {
       

        console.log(req.body)
        const skip = req.body.skip ?? 0
        const limit = req.body.limit ?? 10
        req.body.startdate = moment(req.body.startdate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        req.body.enddate = moment(req.body.enddate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        console.log(req.body.startdate)
        console.log(req.body.enddate)
        let query = []
        if (req.body.search && req.body.search.trim() !== "") {
            query.push({
                $match: {
                    "userData.username": {
                        $regex: req.body.search.trim(),
                        $options: 'i'
                    }
                }
            });
        }
        if (req.body.company) {
            query.push({ $match: { companyid: req.body.company } })
        }
        if (req.body.city) {
            query.push({ $match: { "userData.city": req.body.city } })
        }
        if (req.body.startdate && req.body.enddate) {
            query.push({
                $match: {
                    "userData.joindate": {
                        $gte: req.body.startdate,
                        $lte: req.body.enddate
                    }
                }
            });
        }

        query.push(
            {
                $addFields: {
                    username: "$userData.username"
                }
            },
            {
                $addFields: {
                    batchname: "$batchdata.name"
                }
            },
            {
                $addFields: {
                    companyname: "$companydata.companyname",
                    cityname: "$userData.city",
                    team: "$userData.team"
                }
            },
            {
                $addFields: {
                    wordslength: { $size: "$words" },
                    successRatio: {
                        $cond: {
                            if: { $eq: ["$practiceattempt", 0] },
                            then: 0,
                            else: { $multiply: [{ $divide: ["$correctattempt", "$practiceattempt"] }, 100] }
                        }
                    }
                }
            },
            {
                $project: {
                    userid: 1,
                    username: 1,
                    batchname: 1,
                    companyname: 1,
                    correctattempt: 1,
                    practiceattempt: 1,
                    listeningattempt: 1,
                    wordslength: 1,
                    successRatio: 1,
                    cityname: 1,
                    team: 1
                }
            },
            {
                $facet: {
                    total: [
                        { $count: "count" }
                    ],
                    data: [
                        { $skip: parseInt(skip, 0) },
                        { $limit: parseInt(limit, 10) }
                    ]
                }
            }


        )

        console.log("pronunciationlabSchema.aggregate")
        let result = await pronunciationlabSchema.aggregate(query)

        res.status(200).send({ message: "pronuncation lab listing overall", data: result, status: true })

    } catch (error) {
        console.log("Error:{");
        console.log(error)
        console.log("Error:}");

        res.status(500).send({ message: error, status: false })
    }
}

const learninghoursReportlist= async(req,res)=>{
    try {
        console.log('test')
        console.log(req.body)
        let query = admin.firestore().collection("UserNode")
        .where('companyid', '==', req.body.company)

        const usersnapshot=await query.get();
        let userres= usersnapshot.docs.map(s=>s.data())
        //Process Learning
        let pr1= admin.firestore().collection("FoodProductionTimeStamp")//.where("companyID","==",req.body.company)
        let pr2= admin.firestore().collection("FoodAndBeverageTimeStamp")//.where("companyID","=",req.body.company)
        let pr3= admin.firestore().collection("FrontOfficeTimeStamp")//.where("companyID","==",req.body.company)
        let pr4= admin.firestore().collection("HouseKeepingTimeStamp")//.where("companyID","==",req.body.company)

        //AR Call
        let arsimtime= admin.firestore().collection("InteractiveSimulationTimeStamp")//.where("companyID","==",req.body.company)
        //Proflent English
        let prosimtime= admin.firestore().collection("LanguageLabTimeStamp")//.where("companyID","=",req.body.company)
        //Soft Skills
        let softsimtime= admin.firestore().collection("FrontOfficeTimeStamp")//.where("companyID","==",req.body.company)

        if(req.body.startdate){
            arsimtime=arsimtime.where("createdAt",">=", new Date( req.body.startdate)).where("createdAt","<=", new Date(req.body.enddate))//.where("companyID","==",req.body.company)
            prosimtime=prosimtime.where("createdAt",">=", new Date( req.body.startdate)).where("createdAt","<=", new Date(req.body.enddate))
            softsimtime=softsimtime.where("createdAt",">=", new Date( req.body.startdate)).where("createdAt","<=", new Date(req.body.enddate))

            //Process Learning
            pr1=pr1.where("createdAt",">=", new Date( req.body.startdate)).where("createdAt","<=", new Date(req.body.enddate))
            pr2=pr2.where("createdAt",">=", new Date( req.body.startdate)).where("createdAt","<=", new Date(req.body.enddate))
            pr3=pr3.where("createdAt",">=", new Date( req.body.startdate)).where("createdAt","<=", new Date(req.body.enddate))
            pr4=pr4.where("createdAt",">=", new Date( req.body.startdate)).where("createdAt","<=", new Date(req.body.enddate))
        }

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

        //Process Learning
        let ressnap4_1= await pr1.get()
        let rese4_1=ressnap4_1.docs.map(s=>s.data());
        let ressnap4_2= await pr2.get()
        let rese4_2=ressnap4_2.docs.map(s=>s.data());
        let ressnap4_3= await pr3.get()
        let rese4_3=ressnap4_3.docs.map(s=>s.data());
        let ressnap4_4= await pr4.get()
        let rese4_4=ressnap4_4.docs.map(s=>s.data());


        console.log(rese.length)

        var citydata=[];
        if (req.body.city.length !=0) {
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

        userres = userres.map(obj => {
            obj['njoindate'] = new Date(obj.joindate)//moment(obj.joindate).startOf('day').format('YYYY-MM-DD');
            return {...obj}; 
          });
       
        if(req.body.ustartdate){
            userres =userres.filter(o=> (o.njoindate != undefined) && ( o.njoindate >= new Date( req.body.ustartdate) &&  o.njoindate <= new Date( req.body.uenddate)));
        }
        const udata = userres.map(a1 => {
            const arcallsim = rese.filter(a2 => a2.userId == a1._id);
            const profluenteng = rese2.filter(a2 => a2.userId == a1._id);
            const softskills = rese3.filter(a2 => a2.userId == a1._id);

            const prs1=rese4_1.filter(a2 => a2.userId == a1._id);
            const prs2=rese4_2.filter(a2 => a2.userId == a1._id);
            const prs3=rese4_3.filter(a2 => a2.userId == a1._id);
            const prs4=rese4_4.filter(a2 => a2.userId == a1._id);
            let isprslern=true;
            if(prs1.length ==0 && prs2.length ==0 && prs3.length ==0 && prs4.length ==0){
                isprslern=false;
            }

            const processlearning = {prs1:prs1,prs2:prs2,prs3:prs3,prs4:prs4}

            return { ...a1, arcallsim,profluenteng,softskills,processlearning,isprslern };
        });
        var udata1=udata.filter(m=>m.arcallsim.length !=0 || m.profluenteng.length !=0 || m.softskills.length !=0 || m.isprslern  )
        //console.log(udata.filter(ss=>ss.prdata.length !=0));

        res.status(200).send({ message: "Learning Hours overall", data: udata1, status: true });


    }
    catch(error){
        console.log(error)
        res.status(500).send({ message: "somthing went wrong", status: false })
    }
}




const proUserOverAll = async (req, res) => {
    try {
        console.log(req.body)
        const attemptsCollection = admin.firestore().collection("proLabReports");


        const q = attemptsCollection.where("userId", "==", req.body.userid);


        const querySnapshot = await q.get();

        const results = {};


        querySnapshot.forEach((doc) => {
            const data = doc.data();


            let dateKey;
            if (data.date instanceof firebbase.firestore.Timestamp) {
                dateKey = moment(data.date.toDate()).format("DD-MMM-YYYY");
            } else {

                dateKey = moment(data.date).format("DD-MMM-YYYY");
            }

            if (!results[dateKey]) {
                results[dateKey] = {
                    date: dateKey,
                    totalWords: 0,
                    totalCorrectAttempts: 0,
                    totalPracticeAttempts: 0,
                    totalListeningAttempts: 0,
                };
            }


            results[dateKey].totalWords += 1;
            results[dateKey].totalCorrectAttempts += data.correct || 0;
            results[dateKey].totalPracticeAttempts += data.pracatt || 0;
            results[dateKey].totalListeningAttempts += data.listatt || 0;
            if (results[dateKey].totalPracticeAttempts > 0) {
                results[dateKey].successRatio =
                    (results[dateKey].totalCorrectAttempts / results[dateKey].totalPracticeAttempts) * 100;
            } else {
                results[dateKey].successRatio = 0;
            }
        });

        // Convert the results object to an array
        const resultArray = Object.values(results);
        resultArray.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        let count = resultArray.length
        console.log(resultArray)
        res.send({ message: "user overall pronunciaton result", status: true, data: resultArray, count: count })

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error, status: false })
    }
}
const proUserperDay = async (req, res) => {
    try {
        console.log(req.body)
        let { userid, date } = req.body
        let datasnapshot = await admin.firestore().collection("proLabReports").where("userId", "==", userid).where("date", "==", date).get()
        let data = []
        datasnapshot.forEach((doc) => {
            const docData = doc.data();
            let successRatio = 0;
            if (docData.pracatt && docData.correct) {
                successRatio = (docData.correct / docData.pracatt) * 100;
            }
            docData.successRatio = successRatio;
            data.push(docData);
        });
        let count = data.length
        console.log(data)

        res.send({ message: "user pracited per day", status: true, data: data, count: count })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "somthing went wrong", status: fasle })
    }
}

const proReportperWord = async (req, res) => {
    try {
        let { userid, word } = req.body
        console.log(req.body)
        let wordssnapshot = await admin.firestore().collection("proLabReports").where("userId", "==", userid).where("word", "==", word).get()

        let data = []
        wordssnapshot.forEach((doc) => {
            const docData = doc.data();
            let successRatio = 0;
            if (docData.pracatt && docData.correct) {
                successRatio = (docData.correct / docData.pracatt) * 100;
            }
            docData.successRatio = successRatio;
            data.push(docData);
        })

        let count = data.length

        res.send({ message: "word report overall data", status: true, data: data, count: count })

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "somthing went wrong", status: false })
    }
}



const speechlabReports = async (req, res) => {
    try {
        console.log(req.body)
        const { userid, score, type, sentence } = req.body

        let userexsists = await sentencesLabReport.findOne({ userid: userid })
        console.log(userexsists)
        if (userexsists) {
            console.log("inside")
            if (type === "listening") {
                let result = await sentencesLabReport.updateMany({ _id: userexsists._id }, { $inc: { listeningattempt: 1 }, $addToSet: { sentences: sentence } }, { multi: true })
            } else if (type === "practice") {
                let result = await sentencesLabReport.updateMany({ _id: userexsists._id }, { $inc: { practiceattempt: 1, score: score }, $addToSet: { sentences: sentence } }, { multi: true })
            }


        } else {

            let userdata = (await admin.firestore().collection("UserNode").doc(userid).get()).data()
            let companydata = (await admin.firestore().collection("UserNode").doc(userdata.companyid).get()).data()
            let batchUserSnapshot = await admin.firestore().collection("userbatch").where("userid", "==", userid).get()
            let batchUserData
            if (!batchUserSnapshot.empty) {
                batchUserData = batchUserSnapshot.docs[0].data();
            } else {
                console.log("No matching documents.");
                return res.send({ message: "this user has no batch!! please add to a batch", status: false })
            }
            let batchdata = (await admin.firestore().collection("batch").doc(batchUserData.batchid).get()).data()

            let datas
            if (type === "listening") {

                datas = {
                    userid: userid,
                    userdata: userdata,
                    username: userdata.username,
                    companyid: userdata.companyid,
                    companydata: companydata,
                    sentences: [sentence],
                    listeningattempt: 1,
                    batchid: batchUserData.batchid,
                    batchdata: batchdata

                }
                let sentencesdata = new sentencesLabReport(datas)
                let data = await sentencesdata.save()
                console.log(data)
            } else if (type === "practice") {
                datas = {
                    userid: userid,
                    userdata: userdata,
                    username: userdata.username,
                    companyid: userdata.companyid,
                    companydata: companydata,
                    sentences: [sentence],
                    practiceattempt: 1,
                    batchid: batchUserData.batchid,
                    batchdata: batchdata,
                    score: score

                }
                let sentencesdata = new sentencesLabReport(datas)
                let data = await sentencesdata.save()

            }
        }
        res.send({ message: "added successfully", status: true })


    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "somthing went worng", status: false })
    }
}

const speechlabReportList = async (req, res) => {
    try {
        console.log(req.body)
        let { company, city, role, fromdata, todate } = req.body

        let skip = req.body.skip ?? 0
        let limit = req.body.limit ?? 10
        req.body.startdate = moment(req.body.startdate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        req.body.enddate = moment(req.body.enddate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        console.log(req.body.startdate),
            console.log(req.body.enddate)

        let query = []
        if (req.body.search && req.body.search.trim() != "") {

            query.push({ $match: { username: { $regex: req.body.serach.trim(), $options: 'i' } } })
        }
        if (req.body.company) {
            query.push({ $match: { companyid: req.body.company } })
        }
        if (req.body.city) {
            query.push({ $match: { "userdata.city": req.body.city } })
        }
        if (req.body.startdatae && req.body.enddate) {
            query.push({ $match: { "userdata.joindate": { $gte: req.body.startdate, $lte: req.body.enddate } } })
        }

        query.push({
            $addFields: {
                batchname: "$batchdata.name",
                companyname: "$companydata.companyname",
                team: "$userdata.team",
                cityname: "$userdata.city"
            }
        }, {
            $addFields: {
                sentenceslength: { $size: "$sentences" },
                averagescore: {
                    $cond: {
                        if: { $eq: ["$practiceattempt", 0] },
                        then: 0,
                        else: { $divide: ["$score", "$practiceattempt"] }
                    }
                }
            }
        },
            {
                $project: {
                    userid: 1,
                    username: 1,
                    companyname: 1,
                    batchname: 1,
                    team: 1,
                    cityname: 1,
                    sentenceslength: 1,
                    averagescore: 1,
                    practiceattempt: 1,
                    score: 1,
                    listeningattempt: 1
                }
            },
            {
                $facet: {
                    total: [
                        { $count: 'count' }
                    ],
                    data: [
                        { $skip: parseInt(skip, 0) },
                        { $limit: parseInt(limit, 10) }
                    ]
                }
            }

        )


        let data = await sentencesLabReport.aggregate(query)
        res.send({ message: "senteces lab report overall ", status: true, data: data })

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "somthing went wrong ", status: false })
    }
}

const senteceslabOverallData = async (req, res) => {
    try {
        console.log(req.body);

        const { userid } = req.body;
        const senteceslabcollection = admin.firestore().collection("sentLabReports");
        const q = senteceslabcollection.where("userId", "==", userid);

        const querySnapshot = await q.get();

        const results = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            let senario;
            if (data.main && data.load) {
                senario = `${data.main}>${data.load}`;
            }

            if (!results[senario]) {
                results[senario] = {
                    userid: userid,
                    date: senario,
                    totalsentences: 0,
                    totalPracticeAttempts: 0,
                    totalListeningAttempts: 0,
                    practiceTime: 0,
                    totalscore: 0,
                    type: "sentanceslab",
                };
            }
            results[senario].totalsentences += 1;
            results[senario].totalPracticeAttempts += data.pracatt || 0;
            results[senario].totalListeningAttempts += data.listatt || 0;
            results[senario].totalscore += data.score || 0;
            if (results[senario].totalPracticeAttempts > 0) {
                results[senario].averagescore =
                    results[senario].totalscore / results[senario].totalPracticeAttempts;
            } else {
                results[senario].averagescore = 0;
            }
        });

        const resultArray = Object.values(results);
        resultArray.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        const callflowlabreqport = admin.firestore().collection("callFlowReports");
        const qs = callflowlabreqport.where("userId", "==", userid);

        const callsnapshot = await qs.get();

        const result = {};
        callsnapshot.forEach((doc) => {
            const data = doc.data();

            let datekey;

            if (data.main && data.load && data.main !== "" && data.load !== "" && data.main !== null && data.load !== null) {
                datekey = `${data.main}>${data.load}`;
            }

            if (!result[datekey]) {
                result[datekey] = {
                    userid: userid,
                    date: datekey,
                    totalsentences: 0,
                    totalPracticeAttempts: 0,
                    totalListeningAttempts: 0,
                    practiceTime: 0,
                    totalscore: 0,
                    type: "callflow",
                };
            }
            result[datekey].totalsentences += 1;
            result[datekey].totalPracticeAttempts += data.pracatt || 0;
            result[datekey].totalListeningAttempts += data.listatt || 0;
            result[datekey].totalscore += data.score || 0;
            if (result[datekey].totalPracticeAttempts > 0) {
                result[datekey].averagescore =
                    result[datekey].totalscore / result[datekey].totalPracticeAttempts;
            } else {
                result[datekey].averagescore = 0;
            }
        });

        const resultArrays = Object.values(result);
        resultArrays.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        // Fetch practice time data from MongoDB
        const practiceData = await practicedb.find({ userid }).lean();

        // Map practice data to scenarios
        const practiceTimeMap = {};
        practiceData.forEach((data) => {
            const key = `${data.practicetype.includes("Sentence") ? "Sentence" : "Call"}>${data.date}`;
            if (!practiceTimeMap[key]) {
                practiceTimeMap[key] = 0;
            }
            practiceTimeMap[key] += data.totalPracticeTime || 0;
        });

        // Add practice time to result arrays
        [...resultArray, ...resultArrays].forEach((entry) => {
            const key = entry.date;
            entry.practiceTime = practiceTimeMap[key] || 0;
        });

        let responsedata = [...resultArrays, ...resultArray];
        let count = responsedata.length;
        console.log(responsedata);

        res.send({
            message: "User sentences overall result",
            status: true,
            data: responsedata,
            count: count,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong", status: false });
    }
};



const sentecesPerDay = async (req, res) => {
    try {
        console.log(req.body)
        function formatDate(dateStr) {
            const [day, month, year] = dateStr.split('-');
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const formattedDate = `${day}-${monthNames[parseInt(month, 10) - 1]}-${year}`;
            return formattedDate;
        }

        const dateObj = req.body
        dateObj.date = formatDate(dateObj.date);


        let { userid, date } = req.body
        let datasnapshot = await admin.firestore().collection("sentLabReports").where("userId", "==", userid).where("dateTime", "==", dateObj.date).get()
        let data = []
        datasnapshot.forEach((doc) => {
            const docData = doc.data();
            let avaragescore = 0;
            if (docData.pracatt && docData.correct) {
                avaragescore = (docData.score / docData.pracatt);
            }
            docData.avaragescore = avaragescore;
            data.push(docData);
        });
        let count = data.length
        console.log(data)

        res.send({ message: "user pracited per day", status: true, data: data, count: count })

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "somthing went wrong", status: false })
    }
}




const createOrUpdateCombinedReport = async (data) => {
    try {
        const { userid, date, callFlowData, sentenceData } = data;

        // Fetch existing combined report for the user and date
        let combinedReport = await combinedLabReport.findOne({ userid, date });

        if (!combinedReport) {
            // Create a new combined report if none exists
            combinedReport = new combinedLabReport({
                userid,
                date,
                callFlowData: callFlowData || {},
                sentenceData: sentenceData || {},
                combinedScore: (callFlowData?.score || 0) + (sentenceData?.score || 0),
                combinedPracticeAttempts: (callFlowData?.pracatt || 0) + (sentenceData?.practiceattempt || 0),
                listeningAttempts: (callFlowData?.listatt || 0) + (sentenceData?.listeningattempt || 0),
            });
        } else {
            // Update existing report
            if (callFlowData) combinedReport.callFlowData = callFlowData;
            if (sentenceData) combinedReport.sentenceData = sentenceData;

            // Update combined metrics
            combinedReport.combinedScore = 
                (combinedReport.callFlowData?.score || 0) + 
                (combinedReport.sentenceData?.score || 0);
            combinedReport.combinedPracticeAttempts =
                (combinedReport.callFlowData?.pracatt || 0) + 
                (combinedReport.sentenceData?.practiceattempt || 0);
            combinedReport.listeningAttempts =
                (combinedReport.callFlowData?.listatt || 0) + 
                (combinedReport.sentenceData?.listeningattempt || 0);
        }

        // Save the report
        await combinedReport.save();
    } catch (error) {
        console.error("Error creating/updating combined report:", error);
    }
};






const sentencesReportperSentences = async (req, res) => {
    try {
        let { userid, sentence } = req.body
        let labsentencesdata = await (await admin.firestore().collection("sentLabReports").doc(sentence).get()).data()
        console.log(req.body)
        let wordssnapshot = await admin.firestore().collection("sentLabReports").where("userId", "==", userid).where("sentence", "==", labsentencesdata.sentence).get()
        let data = []
        wordssnapshot.forEach((doc) => {
            const docData = doc.data();
            let averagescore = 0;

            if (docData.pracatt && docData.score) {
                averagescore = docData.score / docData.pracatt;
            }

            // Assuming there's a timestamp field in docData, e.g., lastAttempt
            if (docData.lastAttempt) {
                const formattedTime = formatTo12Hour(docData.lastAttempt);
                docData.time = formattedTime;  // Store the formatted time in 'time' field
            }

            docData.averagescore = averagescore;
            data.push(docData);
        });

        function formatTo12Hour(dateString) {
            const date = new Date(dateString);

            let hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'pm' : 'am';

            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            const minutesStr = minutes < 10 ? '0' + minutes : minutes;

            return `${hours}:${minutesStr} ${ampm}`;
        }

        function sortByDateAscending(dataArray) {
            return dataArray.sort((a, b) => {
                const dateA = new Date(a.dateTime.split('-').reverse().join('-'));
                const dateB = new Date(b.dateTime.split('-').reverse().join('-'));
                return dateB - dateA;
            });
        }

        const sortedData = sortByDateAscending(data);
        let count = data.length

        res.send({ message: "word report overall data", status: true, data: sortedData, count: count })

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "somthing went wrong", status: false })
    }
}

const speechlabsenariodropdown = async (req, res) => {
    try {
        let { word, userid, type } = req.body
        let data = req.body.word.split('>')
        console.log(data[1])
        let snapShot
        if (type === "callflow") {
            snapShot = await admin.firestore().collection("callFlowReports").where("load", "==", data[1]).where("userId", "==", userid).get()
        } else if (type === "sentanceslab") {
            snapShot = await admin.firestore().collection("sentLabReports").where("load", "==", data[1]).where("userId", "==", userid).get()
        }
        let result = {}
        snapShot.forEach((doc) => {
            const data = doc.data()
            let datekey
            if (data.date instanceof firebbase.firestore.Timestamp) {
                datekey = moment(data.date.toDate()).format("DD-MM-YYYY");
            } else {
                // Adjust the format string based on the actual format of data.dateTime
                if (type === "callflow") {

                    datekey = moment(data.dateTime, "DD-MM-YYYY").format("DD-MM-YYYY");
                } else if (type === "sentanceslab") {
                    datekey = moment(data.dateTime,).format("DD-MM-YYYY");
                }
            }
            if (!result[datekey]) {
                result[datekey] = {
                    date: datekey,
                    totalsentences: 0,
                    totalPracticeAttempts: 0,
                    totalListeningAttempts: 0,
                    totalscore: 0,
                }
            }
            result[datekey].totalsentences += 1
            result[datekey].totalPracticeAttempts += data.pracatt || 0
            result[datekey].totalListeningAttempts += data.listatt || 0
            result[datekey].totalscore += data.score || 0
            if (result[datekey].totalPracticeAttempts > 0) {
                result[datekey].averagescore =
                    (result[datekey].totalscore / result[datekey].totalPracticeAttempts);
            } else {
                result[datekey].averagescore = 0;
            }

        })
        const resultArrays = Object.values(result);
        resultArrays.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        // console.log(resultArrays)
        res.status(200).send({ message: "report drop down", status: true, data: resultArrays })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "somthing went wrong", status: false })
    }
}

const speechlabreportMainLoad = async (req, res) => {
    try {
        console.log(req.body)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "somthing went wrong", status: false })
    }
}




const sendOtp = async (req, res) => {
    try {
        console.log("here I have reached");
        let { phone } = req.body;

        function generateOtp() {
            let otp = "";
            for (let i = 0; i < 6; i++) {
                otp += Math.floor(Math.random() * 10);
            }
            return otp;
        }

        let smsgateway = await smsSchema.findOne({ gateway: "taggsms" });

        let otp_number = generateOtp();

        let snapshot = await admin.firestore().collection("UserNode").where("mobile", "==", phone).limit(1).get();

        let userid;
        let size = snapshot.size;
        if (size > 0) {
            let userdata = snapshot.docs[0].data();
            userid = userdata._id;

            // Get the country dial code dynamically
            let dialCode = userdata.dialCode || "+91"; // Default to +91 if dialCode is not available
            dialCode = dialCode.replace('+', ''); // Remove the '+' from dialCode // Default to +91 if dialCode is not available

            if (smsgateway.mode === "development") {
                const indianTime = moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
                await admin.firestore().collection("UserNode").doc(userdata._id).update({ otp: otp_number, otptime: indianTime });
                return res.send({ message: "otp sent successfully", otp: otp_number, _id: userid });
            } else {
                const indianTime = moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
                await admin.firestore().collection("UserNode").doc(userdata._id).update({ otp: otp_number, otptime: indianTime });

                let name = userdata.username;
                let userPhone = userdata.mobile;

                // Dynamically format the phone number with dialCode
                let fullPhoneNumber = `${dialCode}${userPhone}`;

                let result = await axios.post(process.env.smsgatewayurl, {
                    "SenderId": "PRFLNT",
                    "Is_Unicode": false,
                    "Is_Flash": false,
                    "DataCoding": 0,
                    "Message": `Your OTP for Profluent AR login is ${otp_number}. Please DO NOT share this OTP with anyone.\nEnjoy easy & effective learning!`,
                    "MobileNumbers": fullPhoneNumber, 
                    "ApiKey": smsgateway.apikey,
                    "ClientId": smsgateway.clientid
                });
             console.log(result);
             
                res.send({ message: "otp sent successfully", _id: userid, status: true });
            }
        } else {
            return res.send({ message: "no user found ", status: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "something went wrong ", status: false });
    }
}


const verifyOtp = async (req, res) => {
    try {
        const currenttime = moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
        const { _id, mobile, otp } = req.body;

        // Fetch user data
        let userData = (await admin.firestore().collection("UserNode").doc(_id).get()).data();
        if (!userData) {
            return res.status(404).send({ message: "User not found", status: false });
        }

        let timeDifference = new Date(currenttime) - new Date(userData.otptime);
        let differenceInSeconds = Math.floor(timeDifference / 1000);

        // Check if OTP is provided
        if (!otp || otp === "") {
            return res.send({ message: "Otp is required", status: false });
        }

        // Check if the OTP matches
        if (userData.otp === otp) {
            // Check if OTP has expired
            if (differenceInSeconds > 120) {
                return res.send({ message: "Otp has expired", status: false });
            }

            // If `joindate` doesn't exist, add it using `createAt`
            if (!userData.joindate) {
                userData.joindate = new Date(userData.createAt.seconds * 1000).toISOString();
            }

            // Handle "Company" access type
            if (userData.access === "Company") {
                const subscriptionEndDate = userData.subscriptionEndDate;
                const subscriptionStartDate = userData.subscriptionstartdate;

                userData.endDate = subscriptionEndDate ? subscriptionEndDate : null;
                userData.joindate = subscriptionStartDate ? subscriptionStartDate : userData.joindate;

                return res.send({
                    message: "Otp verified successfully",
                    status: true,
                    userdata: userData,
                });
            }

            // Handle other access types
            let userBatchSnapshot = await admin.firestore().collection("userbatch")
                .where("userid", "==", _id)
                .limit(1)
                .get();

                let batchId
                let batchData 
                if (!userBatchSnapshot.empty) {
                    // Only access docs[0] if the snapshot is not empty
                    batchId = userBatchSnapshot.docs[0].data().batchid;
                    batchData = (await admin.firestore().collection("batch").doc(batchId).get()).data();
                } else {
                    // Handle the case when no batch is found (you can return or assign a default value)
                    //  return res.send({ message: "No batch associated with user", status: false });
                    batchData = null;
                }


            const batchEndDate = batchData ? batchData.endate : null;

            // Add 60 days to joindate to calculate default endDate
            let joinDate = new Date(userData.joindate);
            joinDate.setDate(joinDate.getDate() + 60);

            userData.endDate = batchEndDate ? batchEndDate : joinDate.toISOString();

            return res.send({
                message: "Otp verified successfully",
                status: true,
                userdata: userData,
            });
        } else {
            return res.send({ message: "Invalid otp", status: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong", status: false });
    }
};





const sentecesflowlabgraph = async (req, res) => {
    try {
        let type = req.body.type
        let query = []
        if (type === "5 days") {
            let currentdate = momenttz().tz("Asia/Kolkata").endOf("day").format('YYYY-MM-DD HH:mm:ss')
            let uptodate = momettz().tz("Asia/Kolkata").subtract(5, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')


            query.push({
                $match: {
                    date: { $gte: uptodate, $lte: currentdate },
                    userid: req.body.userid,
                    practicetype: { $in: ["Sentence Construction Lab Report", "Call Flow Practise Report"] }
                }
            })
            query.push({
                $addFields: {
                    date: {
                        $cond: {
                            if: { $eq: [{ $type: "$date" }, "string"] },
                            then: { $dateFromString: { dateString: "$date" } },
                            else: "$date"
                        }
                    }
                }
            });

            query.push({
                $group: {
                    _id: {
                        userid: "$userid",
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
                    },
                    totalpracticecount: { $sum: "$practicecount" },
                    totallisteningcount: { $sum: "$listeningcount" },
                    averageScore: {
                        $avg: { $cond: { if: { $isArray: "$score" }, then: { $avg: "$score" }, else: "$score" } }
                    }
                }
            })
            query.push({
                $project: {
                    _id: 0,
                    userid: "$_id.userid",
                    date: "$_id.date",
                    totalpracticeCount: {
                        $cond: {
                            if: { $gte: ["$totalpracticecount", 0] },
                            then: "$totalpracticecount",
                            else: 0
                        }
                    },
                    totallisteningcount: 1,
                    averagescore: {
                        $cond: {
                            if: { $gte: ["$averageScore", 0] },
                            then: "$averageScore",
                            else: 0
                        }
                    }
                }
            });
            query.push({ $sort: { date: 1 } })
            let finalResults = await practicedb.aggregate(query)
            res.send({ data: finalResults, status: true })
        } else if (type === "4 weeks") {
            // const momenttz = require('moment-timezone');


            const query = [];


            const startDate = momenttz().tz("Asia/Kolkata").subtract(4, 'weeks').startOf('week').startOf('day');
            const endDate = momenttz().tz("Asia/Kolkata").endOf('week').endOf('day');

            let weeks = [];
            for (let weekStart = startDate; weekStart <= endDate; weekStart.add(1, 'week')) {
                weeks.push({
                    weekStart: weekStart.format('YYYY-MM-DD'),
                    totalpracticecount: 0,
                    totallisteningcount: 0,
                    averageScore: 0
                });
            }

            let currentdate = momenttz().tz("Asia/Kolkata").endOf("day").format('YYYY-MM-DD HH:mm:ss');
            let uptodate = momenttz().tz("Asia/Kolkata").subtract(4, 'weeks').startOf('day').format('YYYY-MM-DD HH:mm:ss');

            query.push({
                $match: {
                    date: { $gte: uptodate, $lte: currentdate },
                    userid: req.body.userid,
                    practicetype: { $in: ["Sentence Construction Lab Report", "Call Flow Practise Report"] }
                }
            });

            query.push({
                $addFields: {
                    convertedDate: {
                        $cond: {
                            if: { $eq: [{ $type: "$date" }, "string"] }, // Convert if date is a string
                            then: { $dateFromString: { dateString: "$date" } },
                            else: "$date"
                        }
                    }
                }
            });

            query.push({
                $addFields: {
                    weekStart: {
                        $dateSubtract: {
                            startDate: "$convertedDate",
                            unit: "day",
                            amount: {
                                $subtract: [
                                    { $dayOfWeek: "$convertedDate" }, // Calculate the start of the week
                                    1 // Adjust based on when your week starts
                                ]
                            }
                        }
                    }
                }
            });

            // Group without unwinding to avoid multiplying the practice and listening counts
            query.push({
                $group: {
                    _id: {
                        userid: "$userid",
                        weekStart: { $dateToString: { format: "%Y-%m-%d", date: "$weekStart" } }
                    },
                    totalpracticecount: { $sum: "$practicecount" },
                    totallisteningcount: { $sum: "$listeningcount" },
                    // Calculate the average score over the array of scores
                    averageScore: {
                        $avg: { $cond: { if: { $isArray: "$score" }, then: { $avg: "$score" }, else: "$score" } }
                    }
                    // averageScore: {
                    //     $avg: {
                    //         $reduce: {
                    //             input: "$score",
                    //             initialValue: 0,
                    //             in: { $divide: [{ $add: ["$$value", "$$this"] }, { $size: "$score" }] }
                    //         }
                    //     }
                    // }
                }
            });

            query.push({
                $project: {
                    _id: 0,
                    userid: "$_id.userid",
                    weekStart: "$_id.weekStart",
                    totalpracticecount: { $ifNull: ["$totalpracticecount", 0] },
                    totallisteningcount: { $ifNull: ["$totallisteningcount", 0] },
                    averageScore: { $ifNull: ["$averageScore", 0] }
                }
            });


            // console.log("Aggregation Query: ", JSON.stringify(query, null, 2));


            const results = await practicedb.aggregate(query);
            console.log(results)


            const resultMap = results.reduce((map, item) => {
                map[item.weekStart] = item;
                return map;
            }, {});


            weeks.forEach(week => {
                if (!resultMap[week.weekStart]) {
                    resultMap[week.weekStart] = week;
                }
            });
            [{}, {}]

            const finalResults = await Object.values(resultMap).sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart))
            finalResults.shift()
            res.send({ data: finalResults, status: true })

        } else if (type === "3 months") {
            const momenttz = require('moment-timezone');

            // Calculate the start and end of the current month
            const currentMonthStart = momenttz().tz("Asia/Kolkata").startOf('month');
            const currentMonthEnd = momenttz().tz("Asia/Kolkata").endOf('month');

            // Calculate the start and end dates for the last two months
            const previousMonthStart = momenttz().tz("Asia/Kolkata").subtract(1, 'months').startOf('month');
            const previousMonthEnd = momenttz().tz("Asia/Kolkata").subtract(1, 'months').endOf('month');

            const twoMonthsAgoStart = momenttz().tz("Asia/Kolkata").subtract(2, 'months').startOf('month');
            const twoMonthsAgoEnd = momenttz().tz("Asia/Kolkata").subtract(2, 'months').endOf('month');

            // Initialize the months array with proper formatting
            let months = [
                { monthStart: currentMonthStart.format('YYYY-MM-01'), totalpracticecount: 0, totallisteningcount: 0, averageScore: 0 },
                { monthStart: previousMonthStart.format('YYYY-MM-01'), totalpracticecount: 0, totallisteningcount: 0, averageScore: 0 },
                { monthStart: twoMonthsAgoStart.format('YYYY-MM-01'), totalpracticecount: 0, totallisteningcount: 0, averageScore: 0 }
            ];

            // Set the current and up-to-date date ranges
            let currentdate = currentMonthEnd.endOf('day').format('YYYY-MM-DD HH:mm:ss');
            let uptodate = twoMonthsAgoStart.startOf('day').format('YYYY-MM-DD HH:mm:ss');

            // Aggregation query
            const query = [];

            // Add $match stage to filter data from the last three months
            query.push({
                $match: {
                    date: { $gte: uptodate, $lte: currentdate },
                    userid: req.body.userid,
                    practicetype: { $in: ["Sentence Construction Lab Report", "Call Flow Practise Report"] }
                }
            });

            // Convert date if it's in string format
            query.push({
                $addFields: {
                    convertedDate: {
                        $cond: {
                            if: { $eq: [{ $type: "$date" }, "string"] },
                            then: { $dateFromString: { dateString: "$date" } },
                            else: "$date"
                        }
                    }
                }
            });

            // Set the first day of the month for each record
            query.push({
                $addFields: {
                    monthStart: {
                        $dateToString: { format: "%Y-%m-01", date: "$convertedDate" }
                    }
                }
            });

            // Group by user ID and the start of each month
            query.push({
                $group: {
                    _id: {
                        userid: "$userid",
                        monthStart: "$monthStart"
                    },
                    totalpracticecount: { $sum: "$practicecount" },
                    totallisteningcount: { $sum: "$listeningcount" },
                    // Calculate the average of the scores from the score array
                    averageScore: {
                        $avg: { $cond: { if: { $isArray: "$score" }, then: { $avg: "$score" }, else: "$score" } }
                    }
                    // averageScore: {
                    //     $avg: {
                    //         $reduce: {
                    //             input: "$score",
                    //             initialValue: 0,
                    //             in: {
                    //                 $divide: [{ $add: ["$$value", "$$this"] }, { $size: "$score" }]
                    //             }
                    //         }
                    //     }
                    // }
                }
            });

            // Project the fields into the required structure
            query.push({
                $project: {
                    _id: 0,
                    userid: "$_id.userid",
                    monthStart: "$_id.monthStart",
                    totalpracticecount: { $ifNull: ["$totalpracticecount", 0] },
                    totallisteningcount: { $ifNull: ["$totallisteningcount", 0] },
                    averageScore: { $ifNull: ["$averageScore", 0] }
                }
            });

            // Sort by monthStart
            query.push({ $sort: { monthStart: 1 } });

            // Perform the aggregation
            const results = await practicedb.aggregate(query);

            // Convert results to a map for easy lookup
            const resultMap = results.reduce((map, item) => {
                map[item.monthStart] = item;
                return map;
            }, {});

            // Ensure all months are included with zero values if not present in results
            months.forEach(month => {
                if (!resultMap[month.monthStart]) {
                    resultMap[month.monthStart] = month;
                }
            });

            // Convert the map back to an array and sort
            const finalResults = Object.values(resultMap).sort((a, b) => new Date(a.monthStart) - new Date(b.monthStart));

            // Print or return the final results
            console.log("Final Results: ", finalResults);



            res.send({ data: finalResults, status: true })

        }




    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "somthing went wrong ", status: false })
    }
}


const pronunciationSoundLabGraph = async (req, res) => {
    try {
        const type = req.body.type;
        const query = [];
        const momenttz = require('moment-timezone');

        // Utility function to calculate the average count for "correct" and "wrong"
        const getCorrectWrongAvg = {
            $reduce: {
                input: "$successCount",
                initialValue: { correct: 0, wrong: 0 },
                in: {
                    correct: { $cond: [{ $eq: ["$$this", "correct"] }, { $add: ["$$value.correct", 1] }, "$$value.correct"] },
                    wrong: { $cond: [{ $eq: ["$$this", "wrong"] }, { $add: ["$$value.wrong", 1] }, "$$value.wrong"] }
                }
            }
        };
        const calcAverages = {
            $addFields: {
                averageCorrect: {
                    $cond: {
                        if: { $eq: [{ $add: ["$reduced.correct", "$reduced.wrong"] }, 0] },
                        then: 0,
                        else: { $divide: ["$reduced.correct", { $add: ["$reduced.correct", "$reduced.wrong"] }] }
                    }
                },
                averageWrong: {
                    $cond: {
                        if: { $eq: [{ $add: ["$reduced.correct", "$reduced.wrong"] }, 0] },
                        then: 0,
                        else: { $divide: ["$reduced.wrong", { $add: ["$reduced.correct", "$reduced.wrong"] }] }
                    }
                },
                averageSuccessRate: {
                    $cond: {
                        if: { $eq: [{ $add: ["$reduced.correct", "$reduced.wrong"] }, 0] },
                        then: 0,
                        else: {
                            $multiply: [
                                { $divide: ["$reduced.correct", { $add: ["$reduced.correct", "$reduced.wrong"] }] },
                                100
                            ]
                        }
                    }
                }
            }
        };
        
        

        if (type === "5 days") {
            const currentdate = momenttz().tz("Asia/Kolkata").endOf("day").format('YYYY-MM-DD HH:mm:ss');
            const uptodate = momenttz().tz("Asia/Kolkata").subtract(5, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');

            query.push({
                $match: {
                    date: { $gte: uptodate, $lte: currentdate },
                    userid: req.body.userid,
                    practicetype: "Pronunciation Sound Lab Report"
                }
            });

            query.push({
                $addFields: {
                    date: {
                        $cond: {
                            if: { $eq: [{ $type: "$date" }, "string"] },
                            then: { $dateFromString: { dateString: "$date" } },
                            else: "$date"
                        }
                    },
                    reduced: getCorrectWrongAvg
                }
            });

            query.push({
                $group: {
                    _id: {
                        userid: "$userid",
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
                    },
                    totalpracticecount: { $sum: "$practicecount" },
                    totallisteningcount: { $sum: "$listeningcount" },
                    reduced: { $first: "$reduced" }
                }
            });

            query.push(calcAverages);

            query.push({
                $project: {
                    _id: 0,
                    userid: "$_id.userid",
                    date: "$_id.date",
                    totalpracticecount: { $ifNull: ["$totalpracticecount", 0] },
                    totallisteningcount: { $ifNull: ["$totallisteningcount", 0] },
                    averageCorrect: { $ifNull: ["$averageCorrect", 0] },
                    averageWrong: { $ifNull: ["$averageWrong", 0] },
                    averageSuccessRate: { $ifNull: ["$averageSuccessRate", 0] } // Include success rate
                }
            });
            

            query.push({ $sort: { date: 1 } });

            const finalResults = await practicedb.aggregate(query);
            res.send({ data: finalResults, status: true });

        } else if (type === "4 weeks") {
            const startDate = momenttz().tz("Asia/Kolkata").subtract(4, 'weeks').startOf('week').startOf('day');
            const endDate = momenttz().tz("Asia/Kolkata").endOf('week').endOf('day');

            const weeks = Array.from({ length: 4 }, (_, i) => ({
                weekStart: startDate.clone().add(i, 'weeks').format('YYYY-MM-DD'),
                totalpracticecount: 0,
                totallisteningcount: 0,
                averageCorrect: 0,
                averageWrong: 0
            }));

            const currentdate = momenttz().tz("Asia/Kolkata").endOf("day").format('YYYY-MM-DD HH:mm:ss');
            const uptodate = momenttz().tz("Asia/Kolkata").subtract(4, 'weeks').startOf('day').format('YYYY-MM-DD HH:mm:ss');

            query.push({
                $match: {
                    date: { $gte: uptodate, $lte: currentdate },
                    userid: req.body.userid,
                    practicetype: "Pronunciation Sound Lab Report"
                }
            });

            query.push({
                $addFields: {
                    convertedDate: {
                        $cond: {
                            if: { $eq: [{ $type: "$date" }, "string"] },
                            then: { $dateFromString: { dateString: "$date" } },
                            else: "$date"
                        }
                    },
                    reduced: getCorrectWrongAvg
                }
            });

            query.push({
                $addFields: {
                    weekStart: {
                        $dateSubtract: {
                            startDate: "$convertedDate",
                            unit: "day",
                            amount: { $subtract: [{ $dayOfWeek: "$convertedDate" }, 1] }
                        }
                    }
                }
            });

            query.push({
                $group: {
                    _id: {
                        userid: "$userid",
                        weekStart: { $dateToString: { format: "%Y-%m-%d", date: "$weekStart" } }
                    },
                    totalpracticecount: { $sum: "$practicecount" },
                    totallisteningcount: { $sum: "$listeningcount" },
                    reduced: { $first: "$reduced" }
                }
            });

            query.push(calcAverages);

            query.push({
                $project: {
                    _id: 0,
                    userid: "$_id.userid",
                    weekStart: "$_id.weekStart",
                    totalpracticecount: { $ifNull: ["$totalpracticecount", 0] },
                    totallisteningcount: { $ifNull: ["$totallisteningcount", 0] },
                    averageCorrect: { $ifNull: ["$averageCorrect", 0] },
                    averageWrong: { $ifNull: ["$averageWrong", 0] },
                    averageSuccessRate: { $ifNull: ["$averageSuccessRate", 0] }
                }
            });

            const results = await practicedb.aggregate(query);
            const resultMap = results.reduce((map, item) => {
                map[item.weekStart] = item;
                return map;
            }, {});

            weeks.forEach(week => {
                if (!resultMap[week.weekStart]) {
                    resultMap[week.weekStart] = week;
                }
            });

            const finalResults = Object.values(resultMap).sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart));
            finalResults.shift(); // Remove extra data if required
            res.send({ data: finalResults, status: true });

        } else if (type === "3 months") {
            const months = Array.from({ length: 3 }, (_, i) => ({
                monthStart: momenttz().tz("Asia/Kolkata").subtract(i, 'months').startOf('month').format('YYYY-MM-01'),
                totalpracticecount: 0,
                totallisteningcount: 0,
                averageCorrect: 0,
                averageWrong: 0
            }));

            const currentdate = momenttz().tz("Asia/Kolkata").endOf('month').format('YYYY-MM-DD HH:mm:ss');
            const uptodate = momenttz().tz("Asia/Kolkata").subtract(2, 'months').startOf('month').format('YYYY-MM-DD HH:mm:ss');

            query.push({
                $match: {
                    date: { $gte: uptodate, $lte: currentdate },
                    userid: req.body.userid,
                    practicetype: "Pronunciation Sound Lab Report"
                }
            });

            query.push({
                $addFields: {
                    convertedDate: {
                        $cond: {
                            if: { $eq: [{ $type: "$date" }, "string"] },
                            then: { $dateFromString: { dateString: "$date" } },
                            else: "$date"
                        }
                    },
                    reduced: getCorrectWrongAvg
                }
            });

            query.push({
                $addFields: {
                    monthStart: {
                        $dateToString: { format: "%Y-%m-01", date: "$convertedDate" }
                    }
                }
            });

            query.push({
                $group: {
                    _id: {
                        userid: "$userid",
                        monthStart: "$monthStart"
                    },
                    totalpracticecount: { $sum: "$practicecount" },
                    totallisteningcount: { $sum: "$listeningcount" },
                    reduced: { $first: "$reduced" }
                }
            });

            query.push(calcAverages);

            query.push({
                $project: {
                    _id: 0,
                    userid: "$_id.userid",
                    monthStart: "$_id.monthStart",
                    totalpracticecount: { $ifNull: ["$totalpracticecount", 0] },
                    totallisteningcount: { $ifNull: ["$totallisteningcount", 0] },
                    averageCorrect: { $ifNull: ["$averageCorrect", 0] },
                    averageWrong: { $ifNull: ["$averageWrong", 0] },
                    averageSuccessRate: { $ifNull: ["$averageSuccessRate", 0] }
                }
            });

            const results = await practicedb.aggregate(query);
            const resultMap = results.reduce((map, item) => {
                map[item.monthStart] = item;
                return map;
            }, {});

            months.forEach(month => {
                if (!resultMap[month.monthStart]) {
                    resultMap[month.monthStart] = month;
                }
            });

            const finalResults = Object.values(resultMap).sort((a, b) => new Date(a.monthStart) - new Date(b.monthStart));
            res.send({ data: finalResults, status: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong", status: false });
    }
};













module.exports = {
    notificationList,
    startPractice,
    endPractice,
    pronunciationLabReport,
    pronunciationLabReportlist,
    learninghoursReportlist,
    proUserOverAll,
    proUserperDay,
    proReportperWord,
    speechlabReports,
    speechlabReportList,
    senteceslabOverallData,
    sentecesPerDay,
    sentencesReportperSentences,
    speechlabsenariodropdown,
    sendOtp,
    verifyOtp,
    speechlabreportMainLoad,
    sentecesflowlabgraph,
    pronunciationSoundLabGraph
    

}
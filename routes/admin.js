const express=require("express")
const adminRouter=express()
const adminController=require("../controller/adminController")
const { upload,uploads } = require("../middleware/multer");
const companyController=require("../controller/companyController");
const commonController=require("../controller/commonController")
const trainerController=require("../controller/trainerController");
const mongController=require("../controller/mongoController")
const { admin } = require("../config/firebaseConfig");
const dashboardController =require("../controller/dashboardController")


/****************************************************Admin routes */

// adminRouter.post("/login",adminController.postLogin)
adminRouter.post("/role_check",adminController.roleCheck)


adminRouter.post("/getsubadmin",adminController.subAdminslist)
adminRouter.post("/addsubadmin",adminController.createUpdateSubAdmin)
adminRouter.post("/editsubadmin",adminController.getSubadmin)
adminRouter.post("/deletesubadmin",adminController.deleteSubAdmin)
adminRouter.post("/permanentdeleteuser",adminController.permanentDeleteUser)
adminRouter.post("/restoreuser",adminController.restoreUser)


adminRouter.post("/companeylist",adminController.companyList)
adminRouter.post("/addeditcompany",adminController.addeditcompany)
adminRouter.post("/deletecompany",adminController.companyDelete)
adminRouter.post("/deletesubadmincompany",adminController.company_subadmin_Delete)
adminRouter.post("/getcompany",adminController.getCompany)
adminRouter.post("/updatecompanystatus",adminController.companyStatus)
adminRouter.get("/getcompnaynames",adminController.getcompanynames)
adminRouter.post("/addcompnaysubadmin",adminController.addcompanySubadmin)
adminRouter.post("/companysubadminlist",adminController.companySubadminList)

adminRouter.post("/get_users",adminController.getUsersList)



adminRouter.post("/addedituser",adminController.addedituser)
adminRouter.post('/getuserdetail',adminController.getuserDetails)
adminRouter.post("/updateuserstatus",adminController.userStatus)
adminRouter.post("/users/delete",adminController.deleteUser)
adminRouter.post('/bluckuploaduser', upload.single('file'),adminController.bulkuploaduser)



//batch implementation in new way

adminRouter.post("/createbatch",adminController.createBatch)
adminRouter.post("/viewcreatedbatch",adminController.viewCreatedBatch)
adminRouter.post("/batchcreatedadd",adminController.batchCreatedAdd)
adminRouter.post("/batchcreateandmove",adminController.batchCreateAndMove)

adminRouter.post("/editbatch",adminController.editBatch)

adminRouter.post("/bathnewuserlist",adminController.bacthnewUserList)
adminRouter.post("/addusertobatch",adminController.addUsertoBatch)
adminRouter.post("/batchlist",adminController.getbatchlist)
adminRouter.post("/batchusers",adminController.batchUsers)
adminRouter.post("/shiftbatchlist",adminController.shiftBathlist)


adminRouter.post("/batchaddedit",adminController.addeditBatch)
adminRouter.post("/batchstatus",adminController.batchStatus)
adminRouter.post("/getbatchdetails",adminController.getBatchDetails)
adminRouter.post("/deletebathuser",adminController.deletebathuser)
adminRouter.post("/changebatchlist",adminController.chagneBatchList)
adminRouter.post("/shiftbatch",adminController.shiftBatch)

adminRouter.post("/profiledetails",adminController.profileData)
adminRouter.post("/updateprofile",adminController.updateprofile)
adminRouter.post("/batchadduserlist",adminController.adduserbatchlist)
adminRouter.post("/addusertobatch",adminController.addUserToBatch)
adminRouter.get('/deleteduserslist',adminController.deletedUserslist)
adminRouter.post("/batchcompaneylist",adminController.batchCompanyList)

adminRouter.post("/addedittrainer",adminController.addeditTrainer)
adminRouter.post("/trainerslist",adminController.trainersList)
adminRouter.post("/updatetrainerstatus",adminController.updateTrainerStatus)
adminRouter.post("/deletetrainer",adminController.deleteTrainer)

// **********************************************************************************************Company admin apies

adminRouter.post("/company/userslist",companyController.comUserList)
adminRouter.post("/company/userlist",companyController.comUsersList)
adminRouter.post("/company/senduserlist",companyController.sendUsersList)


adminRouter.post("/company/adduser",companyController.comAddEditUser)
adminRouter.post("/company/bulkuserupload", upload.single('file'),companyController.comBulkUserUpload)
adminRouter.post("/company/addbatch",companyController.addeditBatch)
adminRouter.post("/company/trainers/",companyController.companyTrainers)
adminRouter.post("/company/addeditcompany",companyController.addeditCompany)



//*******************************************************************************common routes for company and admin */
adminRouter.post("/common/profiledata",commonController.profileData)
adminRouter.post("/common/updateprofile",commonController.profileUpdate)

//*****************************************************************************************trainer routes */

adminRouter.post("/trainer/userlist",trainerController.trainerUserList)
adminRouter.post("/trainer/company",trainerController.trainercompanyData)


//********************************************************************************************General settings */

adminRouter.get("/settings/smtp",mongController.smtpSetting)
adminRouter.post("/settings/smtp/save",mongController.smtpSave)
adminRouter.post("/settings/sms/save",mongController.smsSave)
adminRouter.get("/settings/sms",mongController.getSmsSetting)





//************************************************************************************mongodb */

adminRouter.post("/createnotification",uploads.single('file'),mongController.createNotification)
adminRouter.post("/notificationlist",mongController.notificationList)
adminRouter.post("/notificationdata",mongController.getNotificationData)
adminRouter.post("/deletenotification",mongController.deleteNotification)
adminRouter.post("/email-template/list",mongController.emailTemplate)
adminRouter.post("/email-template/edit",mongController.editEmailTemplate)
adminRouter.post("/email-template/save",mongController.updateEmailTemplate)



//*****************************************************************************************Dashboard api */
adminRouter.post("/subscriptonendingcompanies",dashboardController.subscriptionendingCompanies)

//************************************************ */
adminRouter.post("/sentance-callflow-report-list-1",adminController.generateLearnerReport)
adminRouter.post("/sentance-callflow-report-user-2",adminController.getScenarioSummary)
adminRouter.post("/sentance-callflow-report-date-3",adminController.getSentencesByScenario)
adminRouter.post("/sentance-callflow-report-date-4",adminController.getScenarioDateDetails)
adminRouter.post("/sentance-callflow-report-senctence-5",adminController.getPracticeDetailsBySentence)

adminRouter.post("/generateSentenceLabReportDashbpard",adminController.generateSentenceLabReportDashbpard)
adminRouter.post("/learninghoursReportlistDashboard",adminController.learninghoursReportlistDashboard)
adminRouter.post("/pronunciationLabReportlistDashboard",adminController.pronunciationLabReportlistDashboard)
adminRouter.post("/getDashboardUsersReports",adminController.getDashboardUsersReports)


module.exports=adminRouter

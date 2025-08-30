import { updateCurrentUser } from "firebase/auth";
import { url } from "inspector";


export const Apiconfig = {
    //prfouletn api
    admin_role_check:{
        url:"role_check",
        method:"post"
    },
    sub_admin_list:{
        url:"getsubadmin",
        method:"post"
    },
    add_sub_admin:{
        url:"addsubadmin",
        method:"post"
    },
    subAdminEdit: {
        "url": "editsubadmin",
        "method": "post"
    },
    subadminDelete: {
        "url": "deletesubadmin",
        "method": "post"
    },
    add_edit_company:{
        url:"addeditcompany",
        method:"post"
    },
    companies_list:{
        url:"companeylist",
        method:"post"
    },
    batch_companies_list:{
        url:"batchcompaneylist",
        method:"post"
    },
    deletecompany: {
        "url": "deletecompany",
        "method": "post"
    },
    company_subadmin_Delete: {
        "url": "deletesubadmincompany",
        "method": "post"
    },
    getCompnay:{
        url:"getcompany",
        method:"post"
    },
    update_company_status:{
        url:"updatecompanystatus",
        method:"post"
    },
    getCompanynames:{
        url:"getcompnaynames",
        method:"get"
    },
    addUser:{
        url:'addedituser',
        method:"post"
    },
    getUser:{
        url:"getuserdetail",
        method:"post"
    },
    update_user_status:{
        url:"updateuserstatus",
        method:"post"
    },
    bulk_upload_user:{
        url:"bluckuploaduser",
        method:"post"
    },
    compnay_sub_admim:{
        url:"addcompnaysubadmin",
        method:"post"
    },
    company_subadmin_list:{
        url:"companysubadminlist",
        method:"post"
    },
    add_edit_batch:{
        url:"batchaddedit",
        method:"post"
    },
    batch_list:{
        url:'batchlist',
        method:"post"
    },
    update_batch_status:{
        url:"batchstatus",
        method:"post"
    },
    get_batch_details:{
        url:"getbatchdetails",
        method:'post'
    },
    edit_batch:{
        url:"editbatch",
        method:"post"
    },
    batch_users_list:{
        url:"batchusers",
        method:"post"
    },
    batch_user_delete:{
        url:"deletebathuser",
        method:'post'
    },
    change_batchs_details:{
        url:"changebatchlist",
        method:"post"
    },
    shiftBatch:{
        url:"shiftbatch",
        method:"post"
    },
    profile_data:{
        url:"profiledetails",
        method:"post"
    },
    update_profile:{
        url:"updateprofile",
        method:"post"
    },
    user_add_to_batchlist:{
        url:"batchadduserlist",
        method:"post"
    },
    user_add_to_batch:{
        url:"addusertobatch",
        method:"post"
    },
    user_permanet_delete:{
        url:"permanentdeleteuser",
        method:"post"
    },
    restoreUser:{
        url:"restoreuser",
        method:"post"
    },
    add_edit_trainer:{
        url:"addedittrainer",
        method:"post"

    },
    trainer_list:{
        url:"trainerslist",
        method:"post"
    },
    update_trainer_status:{
        url:"updatetrainerstatus",
        method:"post"
    },
    delete_trainer:{
        url:"deletetrainer",
        method:"post"
    },
    get_smtpSetting: {
        "url": "settings/smtp",
        "method": "get"
    },


    create_batch:{
        "url":"createbatch",
        "method":"post"
    },
    get_created_batch:{
        "url":"viewcreatedbatch",
        "method":"post"
    },
    add_batch:{
        "url":"batchcreatedadd",
        "method":"post"
    },
    batchcreateandmove:{
        "url":"batchcreateandmove",
        "method":"post"
    },
    get_batch_com_detail:{
        "url":"batchcompanydetails",
        "method":"post"
    },
    bath_newuser_list:{
        "url":"bathnewuserlist",
        "method":"post"
    },
    addusertobatch:{
        "url":"addusertobatch",
        "method":"post"
    },
    batch_list_shift:{
        "url":"shiftbatchlist",
        "method":"post"
    },
    //company api part
    com_user_list:{
        url:"company/userslist",
        method:"post"
    },
    user_list:{
        url:"company/userlist",
        method:"post"
    },
     send_user_list:{
        url:"company/senduserlist",
        method:"post"
    },
    com_add_user:{
        url:"company/adduser",
        method:"post"
    },
    com_bulk_user_upload:{
        url:"company/bulkuserupload",
        method:"post"
    },
    com_add_batch:{
        url:"company/addbatch",
        method:"post"
    },
    com_trainer_list:{
        url:"company/trainers",
        method:"post"
    },
    com_trainer_addedit:{
        url:"company/addeditcompany",
        method:"post"
    },

    ////mongodb

    create_notification:{
        url:"createnotification",
        method:"post"
    },
    notification_list:{
        url:"notificationlist",
        method:"post"
    },
    get_nofication:{
        url:"notificationdata",
        method:"post"
    },
    delete_notification: {
        "url": "deletenotification",
        "method": "post"
    },
    pronunciatonlaboverall: {
        "url": "v1/pronuniciationlabreportlist",
        "method": "post"
    },
  
    learninghoursoverall: {
        "url": "v1/learninghoursreportlist",
        "method": "post"
    },
    pronunciatonlabuseroverall: {
        "url": "v1/prouseroveralldata",
        "method": "post"
    },
    pronunciationperday:{
          "url": "v1/prouserperdayresult",
        "method": "post"
    },
    pronunciationreportforword:{
        "url": "v1/proreportperword",
      "method": "post"
  },
  sentenceslaboverall:{
    "url":"v1/speechlabreportlist",
    "method":"post"
  },
  sentenceslabuserdataall:{
    "url":"v1/senteceslabuseroverall",
    "method":"post"
  },
  sentenceslabdatesenario:{
    "url":"sentance-callflow-report-date-4",
    "method":"post"
  },
  sentenceslabforaday:{
    "url":"v1/sentecesperdayresult",
    "method":"post"
  },
  sentenceslabforsenarios:{
    "url":"sentance-callflow-report-date-3",
    "method":"post"
  },
  sentenceslabforsentences:{
    "url":"v1/senteceslabreportforsentences",
    "method":"post"
  },
  sentenceslabsentences:{
    "url":"sentance-callflow-report-senctence-5",
    "method":"post"
  },
  sentencescalllabforsentences:{
    "url":"sentance-callflow-report-list-1",
    "method":"post"
  },
  generateSentenceLabReportDashbpard:{
    "url":"generateSentenceLabReportDashbpard",
    "method":"post"
  },

    learninghoursReportlistDashboard: {
        "url": "learninghoursReportlistDashboard",
        "method": "post"
    },
    pronunciationLabReportlistDashboard: {
        "url": "pronunciationLabReportlistDashboard",
        "method": "post"
    },

    getDashboardUsersReports: {
        "url": "getDashboardUsersReports",
        "method": "post"
    },

    getDashboardCompaniesReports: {
        "url": "getDashboardCompaniesReports",
        "method": "post"
    },
    //common api
    common_profile_data:{
        url:"common/profiledata",
        method:"post"
    },
    common_update_profile:{
        url:"common/updateprofile",
        method:"post"
    },

    //trainer api

    trainer_user_list:{
        url:"trainer/userlist",
        method:"post"
    },
    trainercompany:{
        ur1:"trainer/company",
        method:"post"
    }





    //end

    ,landingData: {
        "url": "settings/general",
        "method": "get"
    },
    forgotPassword: {
        "url": "dashboard/forgotpass",
        "method": "post"
    },
    widgets: {
        "url": "settings/widgets",
        "method": "get"
    },
    save_widegets: {
        "url": "settings/widgets/save",
        "method": "post"
    },
    resetPassword: {
        "url": "api/admin/resetpassword",
        "method": "post"
    },
    adminList: {
        "url": "admins/getadmins",
        "method": "post"
    },
    subadminList: {
        "url": "admins/getsubadmins",
        "method": "post"
    },
    adminEdit: {
        "url": "admins/edit",
        "method": "post"
    },
    subadminEdit: {
        "url": "admins/getusersrole",
        "method": "post"
    },
    adminSave: {
        "url": "admins/save",
        "method": "post"
    },
    subadminSave: {
        "url": "admins/rolemanager",
        "method": "post"
    },
    adminDelete: {
        "url": "admins/delete",
        "method": "post"
    },
    dashboardData: {
        "url": "api/dashboard-data",
        "method": "get"
    },
    dashboardChartData: {
        "url": "api/dashboard/chart-data",
        "method": "post"
    },
    dashboardChartDebate: {
        "url": "api/dashboard/chart-data-debate",
        "method": "post"
    },
    dashboardChartEarning: {
        "url": "api/dashboard/chart-data-earning",
        "method": "post"
    },
    interestMaster: {
        "url": "api/admin/interest/masterList",
        "method": "get"
    },
    languageMaster: {
        "url": "api/admin/language/masterList",
        "method": "get"
    },
    userSave: {
        "url": "users/save",
        "method": "post"
    },
    userList: {
        "url": "get_users",
        "method": "post"
    },
   
    subscribeUser: {
        "url": "users/subscribe",
        "method": "post"
    },
    userEdit: {
        "url": "users/edit",
        "method": "post"
    },
    userDelete: {
        "url": "users/delete",
        "method": "post"
    },
    userRestore: {
        "url": "admins/changeStatus",
        "method": "post",
        "db": "users",
        "value": 1
    },
    time_zone: {
        "url": "settings/general/timezones",
        "method": "get"
    },
    reviewsRestore: {
        "url": "admins/changeStatus",
        "method": "post",
        "db": "ratings",
        "value": 1
    },
    brandRestore: {
        "url": "admins/changeStatus",
        "method": "post",
        "db": "brands",
        "value": 1
    },
    main_categoryRestore: {
        "url": "admins/changeStatus",
        "method": "post",
        "db": "rcategory",
        "value": 1
    },
    walkthrough_imageRestore: {
        "url": "admins/changeStatus",
        "method": "post",
        "db": "walkthroughimages",
        "value": 1
    },
    sub_categoryRestore: {
        "url": "admins/changeStatus",
        "method": "post",
        "db": "scategory",
        "value": 1
    },
    banner_mobRestore: {
        "url": "admins/changeStatus",
        "method": "post",
        "db": "mobbanners",
        "value": 1
    },
    subadmin_restore: {
        "url": "admins/changeStatus",
        "method": "post",
        "db": "admins",
        "value": 1
    },
    banner_webRestore: {
        "url": "admins/changeStatus",
        "method": "post",
        "db": "webbanners",
        "value": 1
    },
    userInactive: {
        "url": "admins/multichangeStatus",
        "method": "post",
        "db": "users",
        "value": 2
    },
    userActive: {
        "url": "admins/multichangeStatus",
        "method": "post",
        "db": "users",
        "value": 2
    },
    userExport: {
        "url": "api/admin/user/exportData",
        "method": "post"
    },
    getUserDetails: {
        "url": "users/edit",
        "method": "post"
    },
    categoryList: {
        "url": "rcategory/list",
        "method": "post"
    },
    walkthroughImageList: {
        "url": "walkthrough_image/list",
        "method": "post"
    },
    walkthrough_archieve: {
        "url": "walkthrough_image/dlist",
        "method": "post"
    },
    categoryFeatured: {
        "url": "admins/changeFeatured",
        "method": "post"
    },
    subcategoryList: {
        "url": "scategory/list",
        "method": "post"
    },
    categoryEdit: {
        "url": "rcategory/edit",
        "method": "post"
    },
    categorySave: {
        "url": "rcategory/save",
        "method": "post"
    },
    categoryDelete: {
        "url": "rcategory/delete",
        "method": "post"
    },
    productList: {
        "url": "food/getproductlist",
        "method": "post"
    },
    productbrandns: {
        "url": "food/getbrandns",
        "method": "get"
    },
    productCatbrandns: {
        "url": "food/catbrandns",
        "method": "post"
    },
    productcatgory: {
        "url": "food/get/rcategory",
        "method": "get"
    },
    productsubcatgory: {
        "url": "scategory/get_all_sub",
        "method": "get"
    },
    productcity: {
        "url": "food/getcity",
        "method": "get"
    },
    productattributes: {
        "url": "food/getattributes",
        "method": "post"
    },
    productDelete: {
        "url": "food/delete",
        "method": "post"
    },
    languageSave: {
        "url": "api/admin/language/List",
        "method": "post"
    },
    languageList: {
        "url": "api/admin/language/List",
        "method": "post"
    },
    languageEdit: {
        "url": "api/admin/language/edit/",
        "method": "get"
    },
    languageDelete: {
        "url": "api/admin/language/delete",
        "method": "post"
    },
    languageDefault: {
        "url": "api/admin/language/default",
        "method": "post"
    },
    getSetting: {
        "url": "api/admin/settings/",
        "method": "get"
    },
    gentralSettingSave: {
        "url": "api/admin/settings/gentralSettingSave",
        "method": "post"
    },
    smtpSettingSave: {
        "url": "api/admin/settings/smtpSettingSave",
        "method": "post"
    },
    smsSettingSave: {
        "url": "api/admin/settings/smsSettingSave",
        "method": "post"
    },
    debateSettingSave: {
        "url": "api/admin/settings/debateSettingSave",
        "method": "post"
    },
    s3BucketSettingSave: {
        "url": "api/admin/settings/s3BucketSettingSave",
        "method": "post"
    },
    socialNetSettingSave: {
        "url": "api/admin/settings/socialNetSettingSave",
        "method": "post"
    },
    emailTempletSave: {
        "url": "email-template/save",
        "method": "post"
    },
    emailTempletList: {
        "url": "email-template/list",
        "method": "post"
    },
    emailTempletEdit: {
        "url": "email-template/edit",
        "method": "post"
    },
    emailTempletDelete: {
        "url": "api/admin/emailTemplet/delete",
        "method": "post"
    },
    reportTempletSave: {
        "url": "api/admin/reporttemplete/save",
        "method": "post"
    },
    reportTempletList: {
        "url": "api/admin/reporttemplete/List",
        "method": "post"
    },
    reportTempletEdit: {
        "url": "api/admin/reporttemplete/edit/",
        "method": "get"
    },
    reportTempletDelete: {
        "url": "api/admin/reporttemplete/delete",
        "method": "post"
    },
    reportTemplateInactive: {
        "url": "api/admin/reporttemplete/inactive",
        "method": "post"
    },
    reportedList: {
        "url": "api/admin/reported/List",
        "method": "post"
    },
    pageSave: {
        "url": "pages/submitmainpage",
        "method": "post"
    },
    pageList: {
        "url": "pages/getlist",
        "method": "post"
    },
    pageEdit: {
        "url": "pages/editpage",
        "method": "post"
    },
    pageDelete: {
        "url": "pages/deletepage",
        "method": "post"
    },
    postreturnreason:{
        "url":"returnreasons",
        "method":"post"
    },
    Getpage: {
        "url": "api/admin/get-page/",
        "method": "get"
    },
    debateList: {
        "url": "api/admin/debate/list",
        "method": "post"
    },
    debateView: {
        "url": "api/admin/debate/view/",
        "method": "get"
    },
    debateDelete: {
        "url": "api/admin/debate/delete",
        "method": "post"
    },
    debateDetails: {
        "url": "api/admin/debate/details",
        "method": "post"
    },
    debateViewDetails: {
        "url": "api/admin/debate-details",
        "method": "post"
    },
    replyCommandList: {
        "url": "api/admin/reply-command",
        "method": "post"
    },
    subscriptionSave: {
        "url": "api/admin/subscription/save",
        "method": "post"
    },
    subscriptionList: {
        "url": "api/admin/subscription/list",
        "method": "post"
    },
    subscriptionEdit: {
        "url": "api/admin/subscription/edit/",
        "method": "get"
    },
    subscriptionDelete: {
        "url": "api/admin/subscription/delete",
        "method": "post"
    },
    paymentgatewaySave: {
        "url": "paymentGateway/save",
        "method": "post"
    },
    paymentgatewayList: {
        "url": "paymentGateway/list",
        "method": "post"
    },
    paymentgatewayEdit: {
        "url": "paymentGateway/edit",
        "method": "post"
    },
    paymentgatewayDelete: {
        "url": "api/admin/paymentgateway/delete",
        "method": "post"
    },
    supportTicketList: {
        "url": "api/admin/reporttemplete/support-List",
        "method": "post"
    },
    supportTicketView: {
        "url": "api/admin/reporttemplete/support-view/",
        "method": "get"
    },
    supportTicketDelete: {
        "url": "api/admin/reporttemplete/support-delete",
        "method": "post"
    },
    supportTicketClose: {
        "url": "api/admin/reporttemplete/support-close",
        "method": "post"
    },
    rattingSave: {
        "url": "api/admin/ratting/save",
        "method": "post"
    },
    rattingList: {
        "url": "api/admin/ratting/List",
        "method": "post"
    },
    rattingEdit: {
        "url": "api/admin/ratting/edit/",
        "method": "get"
    },
    rattingDelete: {
        "url": "api/admin/ratting/delete",
        "method": "post"
    },
    pushNotificationList: {
        "url": "api/admin/push-notification/List",
        "method": "post"
    },
    pushNotificationTempList: {
        "url": "api/admin/notification-templete/List",
        "method": "post"
    },
    pushNotificationTempSave: {
        "url": "api/admin/notification-templete/save",
        "method": "post"
    },
    pushNotificationTempEdit: {
        "url": "api/admin/notification-templete/edit/",
        "method": "get"
    },
    pushNotificationTempDelete: {
        "url": "api/admin/notification-templete/delete",
        "method": "post"
    },
    pushNotificationSend: {
        "url": "api/admin/notification/send",
        "method": "post"
    },
    transactionList: {
        "url": "api/admin/transaction/List",
        "method": "post"
    },
    brands: {
        "url": "brands/list",
        "method": "post"
    },
    brandsDelete: {
        "url": "brands/delete",
        "method": "post"
    },
    brandcategory: {
        "url": "food/get/rcategory",
        "method": "get"
    },
    brandsubcategory: {
        "url": "scategory/get_all_sub",
        "method": "post"
    },
    addBrands: {
        "url": "brands/save",
        "method": "post"
    },
    listBanners: {
        "url": "banners/weblist",
        "method": "post"
    },
    mobilelistBanners: {
        "url": "banners/moblist",
        "method": "post"
    },
    restaurantCategory: {
        "url": "restarant/get/rcategory",
        "method": "get"
    },
    addSubCategory: {
        "url": "scategory/save",
        "method": "post"
    },
    editSubCategory: {
        "url": "scategory/edit",
        "method": "post"
    },
    changeStatus: {
        "url": "admins/changeStatus",
        "method": "post"
    },
    getSubCatSetting: {
        "url": "subcategories/getSetting",
        "method": "get"
    },
    addLanding: {
        "url": "pages/addLanding",
        "method": "post"
    },
    getLandingContent: {
        "url": "pages/getLandingContent",
        "method": "post"
    },
    addBanner: {
        "url": "pages/addBanner",
        "method": "post"
    },
    brandAdd: {
        "url": "brands/save",
        "method": "post"
    },
    addWeb: {
        "url": "banners/websave",
        "method": "post"
    },
    webEdit: {
        "url": "banners/webedit",
        "method": "post"
    },
    addWalkthrough: {
        "url": "walkthrough_image/add",
        "method": "post"
    },
    walkthroughEdit: {
        "url": "walkthrough_image/edit",
        "method": "post"
    },
    mobSave: {
        "url": "banners/mobsave",
        "method": "post"
    },
    mobEdit: {
        "url": "banners/mobedit",
        "method": "post"
    },
    unitslist: {
        "url": "admin/attributes/list",
        "method": "post"
    },
    unitslists: {
        "url": "admin/attributes/attributesList",
        "method": "get"
    },
    unitssave: {
        "url": "admin/attributes/save",
        "method": "post"
    },
    unitedit: {
        "url": "admin/attributes/edit",
        "method": "post"
    },
    notificationuserlist: {
        "url": "notification/user/list",
        "method": "post"
    },
    notificationTemplate: {
        "url": "notification/email-template/list",
        "method": "post"
    },
    saveemailTemplate: {
        "url": "notification/email-template/save",
        "method": "post"
    },
    sendgmail: {
        "url": "newsletter/sendmessagemail",
        "method": "post"
    },
    deletetemplate: {
        "url": "notification/email-template/list",
        "method": "post"
    },
    getmessagetemplate: {
        "url": "notification/email-template/getmessagetemplate",
        "method": "get"
    },
    getmailemplate: {
        "url": "notification/email-template/getmailtemplate",
        "method": "get"
    },
    getedittemplate: {
        "url": "notification/email-template/edit",
        "method": "post"
    },
    getdriverlist: {
        "url": "notification/driver/list",
        "method": "post"
    },
    ordersdashboard: {
        "url": "orders/ordersDashboard",
        "method": "post"
    },
    orderslist: {
        "url": "orders/list",
        "method": "post"
    },
    returnOrderslist: {
        "url": "orders/retur_list",
        "method": "post"
    },
    seenstatus: {
        "url": "orders/list1",
        "method": "post"
    },
    getorders: {
        "url": "get/orders",
        "method": "post"
    },
    returnViewOrder: {
        "url": "get/return-order",
        "method": "post"
    },
    cancelOrder: {
        "url": "order/cancel-admin",
        "method": "post"
    },
    deleteOrder: {
        "url": "order/delete-admin",
        "method": "post"
    },
    printOrders: {
        "url": "order/printDocument",
        "method": "post"
    },
    packedOrders: {
        "url": "order/accept",
        "method": "post"
    },
    taxlist: {
        "url": "admin/tax/list",
        "method": "post"
    },
    state: {
        "url": "get/state",
        "method": "post"
    },
    taxsave: {
        "url": "admin/tax/save",
        "method": "post"
    },
    taxedit: {
        "url": "get/edit/tax",
        "method": "post"
    },
    getvehicle: {
        "url": "admin/vehicle/get",
        "method": "post"
    },
    savevehicle: {
        "url": "admin/vehicle/add",
        "method": "post"
    },
    editvehicle: {
        "url": "vehicle/editdoc",
        "method": "post"
    },
    deletevehicle: {
        "url": "vehicle/delete",
        "method": "post"
    },
    admincancelorders: {
        "url": "orders/adminCancelOrders",
        "method": "post"
    },
    showorderlist: {
        "url": "orders/list1",
        "method": "post"
    },
    restaurantsubcity: {
        "url": "food/get/subcity",
        "method": "post"
    },
    restaurantcity: {
        "url": "restarant/getcity",
        "method": "get"
    },
    getorderdata: {
        "url": "get/getOrderdata",
        "method": "post"
    },
    couponlist: {
        "url": "coupons/list",
        "method": "post"
    },
    getAssignJobOrder: {
        "url": "orders/getAssignJobOrder",
        "method": "post"
    },
    savecoupons: {
        "url": "coupons/save",
        "method": "post"
    },
    editcoupons: {
        "url": "coupons/edit",
        "method": "post"
    },
    brandDelete: {
        "url": "brands/delete",
        "method": "post"
    },
    time_slotDelete: {
        "url": "admin/timeslots/delete",
        "method": "post"
    },
    archievelist: {
        "url": "deletedbrands/list",
        "method": "post"
    },
    banner_mobDelete: {
        "url": "banners/mobdelete",
        "method": "post"
    },
    banner_mob_archieve: {
        "url": "banners/dmoblist",
        "method": "post"
    },
    banner_webDelete: {
        "url": "banners/webdelete",
        "method": "post"
    },
    banner_web_archieve: {
        "url": "banners/dweblist",
        "method": "post"
    },
    subadmin_archieve: {
        "url": "admins/getdeleted/subadmins",
        "method": "post"
    },
    dashboard_get: {
        "url": "dashboard/allStats",
        "method": "get"
    },
    dashboard_today_Order: {
        "url": "orders/todayOrderDetails",
        "method": "get"
    },
    dashboard_orderstats: {
        "url": "orders/todayOrderDetails",
        "method": "get"
    },
    language_List: {
        "url": "settings/language/list",
        "method": "post"
    },
    language_Edit: {
        "url": "settings/language/getlanguage/",
        "method": "get"
    },
    language_Default: {
        "url": "settings/language/default/save",
        "method": "post"
    },
    language_Delete: {
        "url": "settings/language/delete",
        "method": "post"
    },
    language_Save: {
        "url": "settings/language/edit",
        "method": "post"
    },
    language_Manage: {
        "url": "settings/language/manage",
        "method": "post"
    },
    language_translation_save: {
        "url": "settings/language/translation/save",
        "method": "post"
    },
    document_list: {
        "url": "document/list",
        "method": "post"
    },
    document_add: {
        "url": "admin/doc/add",
        "method": "post"
    },
    document_edit: {
        "url": "document/editdoc",
        "method": "post"
    },
    document_delete: {
        "url": "document/delete",
        "method": "post"
    },
    couponsdelete: {
        "url": "coupons/deletecoupon",
        "method": "post"
    },
    cancellationlist: {
        "url": "cancellation/list",
        "method": "post"
    },
    cancellationsave: {
        "url": "cancellation/save",
        "method": "post"
    },
    cancellationedit: {
        "url": "cancellation/edit",
        "method": "post"
    },
    deletecancellation: {
        "url": "cancellation/deletecancellation",
        "method": "post"
    },
    adminearnings: {
        "url": "billing/adminEarnings",
        "method": "post"
    },
    time_slotsList: {
        "url": "admin/timeslots/list",
        "method": "post"
    },
    time_slotsSave: {
        "url": "admin/timeslots/save",
        "method": "post"
    },
    time_slotsEdit: {
        "url": "admin/timeslots/edit",
        "method": "post"
    },
    deletenotification: {
        "url": "notification/deletenotification",
        "method": "post"
    },
    driverslist: {
        "url": "drivers/getusers",
        "method": "post"
    },
    driveredit: {
        "url": "drivers/edit",
        "method": "post"
    },
    driversave: {
        "url": "drivers/save",
        "method": "post"
    },
    getrestaurantdoc: {
        "url": "document/dynamic",
        "method": "post"
    },
    driverdelete: {
        "url": "drivers/delete",
        "method": "post"
    },
    adminrestore: {
        "url": "admins/changeStatus",
        "method": "post",
        "db": "drivers",
        "value": 1
    },
    deletelist: {
        "url": "drivers/getdeletedusers",
        "method": "post"
    },
    getnewdrivers: {
        "url": "drivers/getNewDrivers",
        "method": "post"
    },
    getdriversusers: {
        "url": "drivers/getidusers",
        "method": "post"
    },
    dashboard: {
        "url": "driver/dashboard",
        "method": "post"
    },
 
    smtp_SettingSave: {
        "url": "settings/smtp/save",
        "method": "post"
    },
    get_smsSetting: {
        "url": "settings/sms",
        "method": "get"
    },
    sms_SettingSave: {
        "url": "settings/sms/save",
        "method": "post"
    },
    seo_Setting: {
        "url": "settings/seo",
        "method": "get"
    },
    seo_SettingSave: {
        "url": "settings/seo/save",
        "method": "post"
    },
    beforeMapFilter: {
        "url": "map/all/beforefilter",
        "method": "post"
    },
    getappearance_Setting: {
        "url": "images/admin-Image",
        "method": "post"
    },
    getappearance: {
        "url": "images/getappearance",
        "method": "post"
    },
    getappearance_save: {
        "url": "images/save",
        "method": "post"
    },
    postheader_list: {
        "url": "postheader/list",
        "method": "post"
    },
    postheader_edit: {
        "url": "postheader/edit",
        "method": "post"
    },
    postheader_save: {
        "url": "postheader/save",
        "method": "post"
    },
    postheader_delete: {
        "url": "postheader/deletepostheader",
        "method": "post"
    },
    get_socialnetwork: {
        "url": "settings/social-networks",
        "method": "get"
    },
    save_socialnetwork: {
        "url": "settings/social-networks/save",
        "method": "post"
    },
    get_foodcategory: {
        "url": "food/get/rcategory",
        "method": "get"
    },
    save_cuurency: {
        "url": "settings/general/currency/save",
        "method": "post"
    },
    get_currency: {
        "url": "settings/currency",
        "method": "get"
    },
    get_general: {
        "url": "settings/general",
        "method": "get"
    },
    save_general: {
        "url": "settings/general/save",
        "method": "post"
    },
    delete_splachScreen: {
        "url": "settings/general/delete_splash_screen",
        "method": "post"
    },
    foodAdd: {
        "url": "food/add",
        "method": "post"
    },
    foodClone: {
        "url": "food/clone/save",
        "method": "post"
    },
    foodEdit: {
        "url": "food/getFoodDetails",
        "method": "post"
    },
    foodDelete: {
        "url": "food/delete",
        "method": "post"
    },
    adminattributes: {
        "url": "admin/attributes/delete",
        "method": "post"
    },
    cityDashboard: {
        "url": "driver/dashboard",
        "method": "post"
    },
    getCity: {
        "url": "restarant/getcity",
        "method": "get"
    },
    getCityDrivers: {
        "url": "city/getDrivers",
        "method": "post"
    },
    cityList: {
        "url": "city/list",
        "method": "post"
    },
    cityAdd: {
        "url": "city/add",
        "method": "post"
    },
    cityEdit: {
        "url": "city/editdoc",
        "method": "post"
    },
    editdoc: {
        "url": "city/editdoc",
        "method": "post"
    },
    editcityfare: {
        "url": "city/edit/faredoc",
        "method": "post"
    },
    addcityfare: {
        "url": "city/add/fare",
        "method": "post"
    },
    cityarealist: {
        "url": "city/area/list",
        "method": "post"
    },
    warehouse: {
        "url": "add/city/warehouse",
        "method": "post"
    },
    editcityarea: {
        "url": "city/area/editdoc",
        "method": "post"
    },
    savecityarea: {
        "url": "add/city/warehouse",
        "method": "post"
    },
    savecity_area: {
        "url": "add/city/area",
        "method": "post"
    },
    editSavecity_area: {
        "url": "edit/city/area",
        "method": "post"
    },
    sendmessage: {
        "url": "newsletter/sendmessage",
        "method": "post"
    },
    orderdashboard1: {
        "url": "orders/ordersDashboard1",
        "method": "post"
    },
    exportdashboardorder: {
        "url": "orders/exportdashboardorder",
        "method": "post"
    },
    pendinglist: {
        "url": "user/plist",
        "method": "get"
    },
    currentuser: {
        "url": "admins/currentuser",
        "method": "post"
    },
    archieveCategory: {
        "url": "rcategory/dlist",
        "method": "post"
    },
    archieveDeleteCategory: {
        "url": "rcategory/delete",
        "method": "post"
    },
    archieveDeleteWalkthrough: {
        "url": 'walkthrough_image/delete',
        "method": "post"
    },
    archieveSubCategory: {
        "url": "scategory/dlist",
        "method": "post"
    },
    archieveDeleteSubCategory: {
        "url": "scategory/delete",
        "method": "post"
    },
    updateOrderStatus: {
        "url": "order/update-status",
        "method": "post"
    },
    returnOrderStatus: {
        "url": "order/update_return_status",
        "method": "post"
    },
    cancelOrderstatus:{
        'url':"order/cancel-order",
        "method":"post"
    },
    checkRefundStatus: {
        "url": 'order/refund-status',
        "method": "post"
    },
    trendingProduct: {
        "url": "trending/product",
        "method": "get"
    },
    sendMail: {
        "url": "sendmail/subscribe/user",
        "method": "post"
    },
    UserPermanentDele: {
        "url": "user/permanent-delete",
        "method": "post"
    },
    bannerPermanentDele: {
        "url": "banners/permanent/delete",
        "method": "post"
    },
    walthroughImagePermenentDel: {
        "url": "walkthrough_image/permenent_delete",
        "method": "post"
    },
    reviewsRatingList: {
        "url": "reviews/rating/list",
        "method": "post"
    },
    reviewsRatingDelete: {
        "url": "reviews/rating/delete",
        "method": "post"
    },
    reviewsRatingDetails: {
        "url": "reviews/rating/details",
        "method": "post"
    }
}

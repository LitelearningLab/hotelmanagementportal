import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ComponentFactoryResolver, Inject, OnInit, TemplateRef } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { settings } from '../interface/interface';
import { navItems } from '../menu/_nav';
import { Apiconfig } from '../_helpers/api-config';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { DefaultStoreService } from '../_services/default-store.service';
import { NotificationService } from '../_services/notification.service';
import { WebSocketService } from '../_services/webSocketService.service';
import { filter, map } from 'rxjs/operators';
import { SpinnerService } from '../_services/spinner.service';
import { PopupService } from '../_services/popup.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.scss']
})
export class ViewsComponent implements OnInit, AfterViewInit {

  minimized = false;
  public navItems = [...navItems];
  settings: settings;
  currentDate: Date = new Date();
  icon: string = 'assets/image/icon.svg';
  currentUrl: string = '';
  selectedParentMenu: string = '';
  total: any;
  pendingOrderlength: any;
  pendingOrders: any;
  pendingDriverlength: any;
  pendingDrivers: any;
  modalLogoutRef: BsModalRef;
  currentuser: any;
  privileges: any;
  profile : string;
  profilename: string;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private apiService: ApiService,
    private titleService: Title,
    private store: DefaultStoreService,
    private notifyService: NotificationService,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private socketService: WebSocketService,
    private meta: Meta,
    private activatedRoute: ActivatedRoute,
    private spinner: SpinnerService,
    private popupService: PopupService,
    private modalService: BsModalService,

  ) {
    let userObj
    if(localStorage.getItem('Admin')){

      let user = localStorage.getItem('Admin');
       userObj = JSON.parse(user);
    }else if(localStorage.getItem("company")){
      let user=localStorage.getItem("company")
      userObj=JSON.parse(user)
    }else if(localStorage.getItem("subAdmin")){
      let user=localStorage.getItem("subAdmin")
     userObj=JSON.parse(user)

    }else if(localStorage.getItem("Trainer Login")){
      let user=localStorage.getItem("Trainer Login")
      userObj=JSON.parse(user)
    }else if(localStorage.getItem("companysubadmin")){

      let user=localStorage.getItem("companysubadmin")
      userObj=JSON.parse(user)
    }
    debugger;
    // Parse the JSON string into a JavaScript object
    
    // Access the name property
    let userName = userObj.name||"User";
    
    this.profile = this.generateDefaultImage(userName)
    this.profilename = userName;//this.generateDefaultImage(userName)


    this.apiService.CommonApi(Apiconfig.landingData.method, Apiconfig.landingData.url, {}).subscribe(
      (result) => {
        if (result && result.site_url) {
          this.settings = result;
          this.apiService.setAppFavicon(this.settings.favicon);
          this.titleService.setTitle(this.settings.site_title);
          this.store.generalSettings.next(this.settings);
          this.meta.updateTag({ name: 'og:title', content: this.settings.site_title });

          this.apiService.imageExists(environment.apiUrl + this.settings.admin_profile, (exists) => {
            if (exists) {
              this._document.getElementsByClassName('img-avatar')[0].setAttribute('src', environment.apiUrl + this.settings.admin_profile);
            }
          });
          this.apiService.imageExists(environment.apiUrl + this.settings.logo, (exists) => {
            if (exists) {
              this.icon = environment.apiUrl + this.settings.favicon;
            }
          });
        }
      },
      (error) => {
        // console.log(error);
      }
    );

    this.apiService.tapObservable$.subscribe(result => {
      if (result) {
        this.notificationData();
      }
    })
  }
  audioplay() {
    var sounds = new Audio();
    sounds.src = "assets/audio/Notification.mp3";
    sounds.load();
    sounds.play();
    setTimeout(() => {
      sounds.pause()
    }, 1000)
  }
  ngOnInit(): void {
    this.notificationData()

    // this.apiService.CommonApi(Apiconfig.currentuser.method, Apiconfig.currentuser.url, { currentUserData: this.authService.currentUserValue.user }).subscribe(result => {
    //   this.currentuser = result[0]
    //   this.privileges = result[0].privileges
    //   this.authService.currentUserSubject.next(this.currentuser);
    //   console.log("this.current", this.currentuser)
    // })

     this.clearreportdata()
    this.socketService.listen('order_notification_to_admin').subscribe(data => {
      if (data) {
        this.audioplay()
        this.notifyService.showInfo(data.data);
        this.apiService.CommonApi(Apiconfig.pendinglist.method, Apiconfig.pendinglist.url, {}).subscribe(
          (result) => {
            this.pendingOrderlength = result[2].length
            this.pendingOrders = result[2]
            this.pendingDriverlength = result[1].length
            this.pendingDrivers = result[1]
            this.total = this.pendingOrderlength
          })
      }
    })


    this.socketService.listen('joinNotifyRoom').subscribe(data => {
      if (data && data != '') {
        console.log('room joined');
      }
    });
    this.socketService.listen('admin_new_debate').subscribe(data => {
      if (data && data != '') {
        if (data.message && data.message != '') {
          this.notificationMessage(data, this.settings.site_title, this.icon, this.router);
        }
      }
    });
    this.socketService.listen('admin_debate_new_request').subscribe(data => {
      if (data && data != '') {
        if (data.message && data.message != '') {
          this.notificationMessage(data, this.settings.site_title, this.icon, this.router);
        }
      }
    });
    this.socketService.listen('admin_debate_leave_request').subscribe(data => {
      if (data && data != '') {
        if (data.message && data.message != '') {
          this.notificationMessage(data, this.settings.site_title, this.icon, this.router);
        }
      }
    });
    this.socketService.listen('admin_debate_participate_accept').subscribe(data => {
      if (data && data != '') {
        if (data.message && data.message != '') {
          this.notificationMessage(data, this.settings.site_title, this.icon, this.router);
        }
      }
    });
    this.socketService.listen('admin_debate_participate_remove').subscribe(data => {
      if (data && data != '') {
        if (data.message && data.message != '') {
          this.notificationMessage(data, this.settings.site_title, this.icon, this.router);
        }
      }
    });
    this.socketService.listen('admin_debate_participate_reject').subscribe(data => {
      if (data && data != '') {
        if (data.message && data.message != '') {
          this.notificationMessage(data, this.settings.site_title, this.icon, this.router);
        }
      }
    });
    this.socketService.listen('admin_debate_add_to_feed').subscribe(data => {
      if (data && data != '') {
        if (data.message && data.message != '') {
          this.notificationMessage(data, this.settings.site_title, this.icon, this.router);
        }
      }
    });
    this.socketService.listen('admin_debate_completed').subscribe(data => {
      if (data && data != '') {
        if (data.message && data.message != '') {
          this.notificationMessage(data, this.settings.site_title, this.icon, this.router);
        }
      }
    });
    this.socketService.listen('admin_join_debate').subscribe(data => {
      if (data && data != '') {
        if (data.message && data.message != '') {
          this.notificationMessage(data, this.settings.site_title, this.icon, this.router);
        }
      }
    });
    this.socketService.listen('admin_start_debate').subscribe(data => {
      if (data && data != '') {
        if (data.message && data.message != '') {
          this.notificationMessage(data, this.settings.site_title, this.icon, this.router);
        }
      }
    });
    this.socketService.listen('admin_debate_delete').subscribe(data => {
      if (data && data != '') {
        if (data.message && data.message != '') {
          this.notificationMessage(data, this.settings.site_title, this.icon, this.router);
        }
      }
    });
    // this.socketService.listen('new_follow').subscribe(data => {
    //   console.log(data);
    // });

    this.socketService.listen('sub_admin_logout').subscribe(data => {
      if (data && data.message) {
        this.notifyService.showWarning(data.message);
        this.logout();
      }
    });

    this.socketService.listen('subadmin_change').subscribe(data => {
      this.notifyService.showWarning('Your Access Data Changed From Admin.');
      this.sidebarFunction();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) { route = route.firstChild; }
          return route;
        })
      ).subscribe((event) => {
        const path = this.router.url.split('?')[0];
        const paramtersLen = Object.keys(event.snapshot.params).length;
        const pathArr = path.split('/').slice(0, path.split('/').length - paramtersLen);
        this.currentUrl = pathArr.join('/');
      });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const toParentUrl = this.currentUrl.split('/').filter(x => x !== '')[1];
      if (toParentUrl !== undefined || toParentUrl !== null) {
        this.selectedParentMenu = toParentUrl.toLowerCase();
      } else {
        this.selectedParentMenu = 'dashboards';
      }
      window.scrollTo(0, 0);
    });
    this.sidebarFunction()
  };





  clearreportdata(){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)  // Only care about NavigationEnd events
    ).subscribe((event: NavigationEnd) => {
      // Check if the current URL contains the desired path
      if (!event.url.includes('/reports/pronunciationlabreports')) {
        // If the route does not include '/reports/pronunciationlabreports', remove the item from localStorage
        localStorage.removeItem('batchRequestData');
      }
    });
  }
  generateDefaultImage(name: string) {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    canvas.style.display = "none";
    canvas.width = 32;
    canvas.height = 32;
    document.body.appendChild(canvas);
    const context = canvas.getContext("2d")!;
    
    // Generate a color based on the initials
    const initials = this.getInitials(name);
    const color = this.getColorFromInitials(initials);
  
    // Fill the canvas with the generated color
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    // Set font and text color
    context.font = "14px Helvetica";
    context.fillStyle = "#fff";
  
    // Draw the initials on the canvas
    if (initials.length > 1) {
      context.fillText(initials.toUpperCase(), 6, 22);
    } else {
      context.fillText(initials.toUpperCase(), 11, 22);
    }
  
    // Convert the canvas to a data URL
    const data = canvas.toDataURL();
    document.body.removeChild(canvas);
    return data;
  }
  
  // Function to extract initials from a name
  getInitials(name: string): string {
    const nameArray = name.split(" ");
    let initials = "";
    for (let i = 0; i < nameArray.length; i++) {
      if (i <= 1) {
        initials = initials + nameArray[i][0];
      }
    }
    return initials;
  }
  
  // Function to generate a dark color based on initials
  getColorFromInitials(initials: string): string {
    const hash = initials.charCodeAt(0) + (initials.length > 1 ? initials.charCodeAt(1) : 0);
    const hue = hash % 360; 
    return `hsl(${hue}, 70%, 20%)`; // Darker shade with lightness set to 20%
  }





  notificationData() {
    // this.apiService.CommonApi(Apiconfig.pendinglist.method, Apiconfig.pendinglist.url, {}).subscribe(
    //   (result) => {
    //     this.pendingOrderlength = result[2].length
    //     this.pendingOrders = result[2]
    //     this.pendingDriverlength = result[1].length
    //     this.pendingDrivers = result[1]
    //     this.total = this.pendingOrderlength
    //   })
  }

  logOutPop(template: TemplateRef<any>) {
    this.modalLogoutRef = this.modalService.show(template, { id: 1, class: 'logoutPop-model', ignoreBackdropClick: false })
  }
  destroyPopup() {
    this.modalLogoutRef.hide();
  }

  sidebarFunction() {
    // console.log("settingscheck")
    // this.spinner.loadingSpinner.next(false)
    // console.log("If this work it is a lotary________________-----------------------------________________");
    let data=localStorage.getItem("company")
    let menu=[]
    if(data){
      this.navItems.forEach((value) => {
        // console.log(value, 'this isvalue');
        // console.log(value);
        
        var checkmodule = [ "Setting","Lecturer","Users","Dashboard","Reports" ];
        if (value.name && checkmodule.includes(value.name)) {
          menu.push(value);
        }
      });
      this.navItems = menu;
    }else if(localStorage.getItem("Admin")){
      this.navItems.forEach((value) => {
        // console.log(value, 'this isvalue');
        var checkmodule = [ , "Settings","Reports", "Profluent Sub Admin","Lecturer","Notification","Email Template","Users","Push Notification","Institution","Dashboard" ];
        if (value.name && checkmodule.includes(value.name)) {
          menu.push(value);
        }
      });
      this.navItems = menu;
    }else if(localStorage.getItem("Trainer Login")){
      console.log(menu)
      this.navItems.forEach((value) => {
        // console.log(value)
        var checkmodule = [ , "Setting","Dashboard","Reports" ];
        if (value.name && checkmodule.includes(value.name)) {
          
          if(value.name==="Users"){
            value.children=value.children.filter((x)=>x.name==="Edit Users")
          }
          menu.push(value);
        }
      });
      this.navItems = menu;
    }else if(localStorage.getItem("companysubadmin")){
      let companysubadmin=JSON.parse(localStorage.getItem("companysubadmin"))
      this.navItems.forEach((value) => {
        // console.log(value, 'this isvalue');
        // console.log(value);
        
        var checkmodule = [ "Setting","Lecturer","Users","Dashboard","Reports" ];
        if (value.name && checkmodule.includes(value.name)) {
          menu.push(value);
        }
      });
      this.navItems = menu;

    }
    else if(localStorage.getItem("subAdmin")){
      let submadminData=JSON.parse(localStorage.getItem("subAdmin"))
      let privilageData=submadminData.privileges

      // let submadminData=JSON.parse(localStorage.getItem("subAdmin"))
      let id = submadminData._id
      // let privilageData
      console.log(privilageData ,"oldrev");
      
      this.apiService.CommonApi(Apiconfig.subAdminEdit.method,Apiconfig.subAdminEdit.url,{data:id}).subscribe((result)=>{
        console.log(result.data.privileges,"newprev");
        
        privilageData=result.data.privileges
        // this.adminDetails=result.data
        // this.activedata=true
      })
      // console.log(privilageData)
      // console.log("+++++++++++++++++++++++++++++++++83475973457371834891349234+++++++++++")
      // console.log(menu)
      // console.log(menu.length)
      this.navItems.forEach((value) => {
        // console.log(value)
        var checkmodule = [ , "Settings","Lecturer","Notification","Email Template","Users","Push Notification","Institution","Dashboard" ,"Reports" ];
        if (value.name && checkmodule.includes(value.name)) {
          if(value.name==="Users"){
          
            if(privilageData[0].status.add===false){
              console.log("user");
              
              let data = ["Edit Users"];
       
              value.children = value.children.filter((x) => data.includes(x.name));
            }
          }
          if(value.name==="Institution"){
            
          console.log(privilageData[1].status,'privilageData[1].status');
          
            if(privilageData[1].status.add===false){
              
              
              let data = ["Institution List",'Sub Admin List'];
       
              value.children = value.children.filter((x) => data.includes(x.name));
            }else{
              let data = ["Institution List", "Add Company","Add Institution Sub Admin","Sub Admin List"];
              value.children = value.children.filter((x) => data.includes(x.name));
            }
          }
          // if(value.name==="Batch"){
          
          //   if(privilageData[2].status.add===false){
          //     console.log("user");
              
          //     let data = ["Edit Batches"];
       
          //     value.children = value.children.filter((x) => data.includes(x.name));
          //   }
          // }
          if(value.name==="Lecturer"){
          
            if(privilageData[3].status.add===false){
              
              
              let data = ["Lecturer List"];
       
              value.children = value.children.filter((x) => data.includes(x.name));
            }
          }
          menu.push(value);
        }
      });
      this.navItems = menu;

    }

    // this.apiService.CommonApi(Apiconfig.get_general.method, Apiconfig.get_general.url, {}).subscribe(
    //   (result) => {
    //     console.log("settingscheck",result)
    //     const settings = result;
    //     console.log(settings, 'this are settings');
    //     console.log(this.navItems, 'this are nav itemssssssssss');
    //     let menu = [];
    //     menu.push(this.navItems[0])

    //     if (settings.time_slot == 'disable') {
    //       this.navItems.forEach((value) => {
    //         console.log(value, 'this isvalue');
    //         var checkmodule = ["Administrators", "Banners", "Users", "Categories", "Products", "Coupon Management", "Email Template", "Orders", 'Walkthrough Images', "Reviews Ratings", "Settings", "Site Earnings", "Payment Gateway", "Units/Metrics", "Page Management", "language"];
    //         if (value.name && checkmodule.includes(value.name)) {
    //           menu.push(value);
    //         }
    //       });
    //       this.navItems = menu;
    //     } else {
    //       this.navItems.forEach((value) => {
    //         console.log(value, 'this isvalue');
    //         var checkmodule = ["Administrators", "Banners", "Users", "Categories", "Products", "Coupon Management", "Email Template", "Orders", 'Walkthrough Images', "Reviews Ratings", "Settings", "Site Earnings", "Payment Gateway", "Units/Metrics", "Page Management", "language", "Time Slots"];
    //           if (value.name && checkmodule.includes(value.name)) {
    //           menu.push(value);
    //         }
    //       });
    //       this.navItems = menu;
    //     }
    //     // this.ngOnInit()
    //   });

    // var currentUser = this.authService.currentUserValue;
    // if (this.authService.currentUserValue.role == "subadmin") {
    //   this.apiService.CommonApi(Apiconfig.currentuser.method, Apiconfig.currentuser.url, { currentUserData: this.authService.currentUserValue.user }).subscribe(
    //     (result) => {
    //       console.log("result", result)
    //       if (result[0]) {
    //         // console.log('////////////////', result);
    //         // localStorage.setItem('currentAdmin', JSON.stringify(result.data));
    //         this.authService.currentUserSubject.next(result[0]);
    //         currentUser.privileges = result[0].privileges;
    //         let menu = [];
    //         menu.push(this.navItems[0])
    //         console.log('MMMMMMMMMMMMMMMMMmmmmmmmmmmmmmmmmmmmmmmmMMMMMMMMMMMMMMMMMM', menu, 'this is MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMmmmmmmmmmmmmmmmmmmmmmmmmmmmMMMMMMMMMM');

    //         this.navItems.forEach((value) => {
    //           let index = result[0].privileges.findIndex(x => x.alias == value.id);
    //           if (index != -1) {
    //             if (currentUser.privileges[index].status.view) {
    //               if (!currentUser.privileges[index].status.add) {
    //                 var checkmodule = ["users", "category", "Brand", "Banners", "Cancellation Reason", "City Management", "Coupon Management", "Document Management", "Drivers ", "email-template", "mapview", "language", "Orders", "pages", "paymentgateway", "products", "notification", "Site Earnings", "taxmanagement", "Time Slots", "Units", "vehicle"];
    //                 if (value.children) {
    //                   var check = checkmodule.indexOf(value.id);
    //                   if (check != -1) {
    //                     value.children = value.children.filter(x => x.id != 'add');
    //                   }
    //                   menu.push(value);
    //                   // console.log('MMMMMMMMMMMMMMMMMmmmmmmmmmmmmmmmmmmmmmmmMMMMMMMMMMMMMMMMMM',menu,'this is MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMmmmmmmmmmmmmmmmmmmmmmmmmmmmMMMMMMMMMM');

    //                 } else {
    //                   menu.push(value);
    //                 }
    //               } else {
    //                 menu.push(value);
    //               }
    //             }
    //           }
    //         });
    //         this.navItems = menu;
    //       }
    //     });
    // }

  }

  notificationMessage(data, title, icon, router) {
    var message = data.message ? data.message : '';
    Notification.requestPermission(function (permission) {
      var notification = new Notification(title ? title : "Voizout", { body: message, icon: icon, dir: 'auto' });
      notification.onclick = () => {
        if (data && data.debate_id && data.debate_id != '') {
          window.location.href = '/app/debate/view/' + data.debate_id
        }
      };
      setTimeout(function () {
        notification.close();
      }, 5000);
    });
  }

  ngAfterViewInit(): void {
    this.authService.currentUser.subscribe(val => {
      if (val && typeof val._id != 'undefined') {
        this.socketService.emit('joinNotifyRoom', { user: val._id });
      }
    });
  }

  toggleMinimize(e) {
    this.minimized = e;
  }

 logout() {
  this.modalLogoutRef.hide()
  this.authService.currentUser.subscribe(val => {
    if (val && typeof val._id !== 'undefined') {
      this.socketService.emit('disconnect', { user: val._id });
    }
  });
  this.authService.logout().then(() => {
    
    this.notifyService.showSuccess('Logged out successfully');
    // this.router.navigate(['/auth']);
   
    setTimeout(() => {
    this.spinner.loadingSpinner.next(false)
      this.router.navigate(['/auth']);
    }, 1000);
  }).catch(error => {
    console.error('Error during logout', error);
    this.notifyService.showError('Error during logout. Please try again.');
  });
}

// logout() {
//   this.authService.currentUser.subscribe(val => {
//     if (val && typeof val._id != 'undefined') {
//       this.socketService.emit('disconnect', { user: val._id });
//     }
//   });
//   this.authService.logout();
//   this.notifyService.showSuccess('Logout Successfully!');
//   setTimeout(() => {
//     this.router.navigate(['/auth']);
//   }, 1000);
// }
confirmPopunModal() {
  this.popupService.confirmModal();
}

}

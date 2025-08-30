import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Apiconfig } from 'src/app/_helpers/api-config';
import { ApiService } from 'src/app/_services/api.service';
import { FirebaseServiceService } from 'src/app/_services/firebase-service.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent  implements OnInit{
  submitebtn: boolean=false;
  checkpassword:boolean=false
  @ViewChild ("profileForm") form:NgForm
  companyadmin: boolean=false;
  admin: boolean=false;
  traineradmin: boolean=false;
   localdata:any
  common: boolean=false;
  countryname:any=[]
  citynames:any=[]
  countrylist: { name: string; }[];
  countryList:any=[]
  teamnames:any=[]
  rolenames:any=[]
  countryCity: { country: string, city: string[] }[] = [{ country: '', city: [] }];
  cityList: any=[]
  subadmin: boolean=false;
  companysubadmin: boolean;
  constructor(private  firebaseSerive:FirebaseServiceService,
    private apiservice:ApiService,
    private notification:NotificationService,
   
  ){
    if(localStorage.getItem("Trainer Login")){
      this.traineradmin=true
      this.common=true
      this.localdata=JSON.parse(localStorage.getItem("Trainer Login"))
      console.log(this.localdata)
      this.countryList=this.localdata.companydata.countryCity
    
      let citylist=this.localdata.companydata.countryCity.filter(x=>x.country===this.localdata.country)
      
      this.cityList=citylist[0].city
    }else if(localStorage.getItem("Admin")){
      this.admin=true
      this.common=true
      this.localdata=JSON.parse(localStorage.getItem("Admin"))
    }else if(localStorage.getItem("subAdmin")){
      this.subadmin=true
      this.common=true
      this.localdata=JSON.parse(localStorage.getItem("subAdmin"))
    }
    else if(localStorage.getItem("company")){
      this.companyadmin=true
      this.common=true
      this.localdata=JSON.parse(localStorage.getItem("company"))
    }else if(localStorage.getItem("companysubadmin")){
      this.companysubadmin=true
      this.common=true
      this.localdata=JSON.parse(localStorage.getItem("companysubadmin"))
    }
  }
  ngOnInit(): void {
    this.countrylist = [
      {name: "afghanistan"}, {name: "albania"}, {name: "algeria"}, {name: "andorra"}, {name: "angola"}, {name: "antigua and barbuda"}, {name: "argentina"}, {name: "armenia"}, {name: "australia"}, {name: "austria"},
      {name: "azerbaijan"}, {name: "bahamas"}, {name: "bahrain"}, {name: "bangladesh"}, {name: "barbados"}, {name: "belarus"}, {name: "belgium"}, {name: "belize"}, {name: "benin"}, {name: "bhutan"},
      {name: "bolivia"}, {name: "bosnia and herzegovina"}, {name: "botswana"}, {name: "brazil"}, {name: "brunei"}, {name: "bulgaria"}, {name: "burkina faso"}, {name: "burundi"}, {name: "cabo verde"}, {name: "cambodia"},
      {name: "cameroon"}, {name: "canada"}, {name: "central african republic"}, {name: "chad"}, {name: "chile"}, {name: "china"}, {name: "colombia"}, {name: "comoros"}, {name: "congo (congo-brazzaville)"}, {name: "costa rica"},
      {name: "croatia"}, {name: "cuba"}, {name: "cyprus"}, {name: "czechia (czech republic)"}, {name: "democratic republic of the congo"}, {name: "denmark"}, {name: "djibouti"}, {name: "dominica"}, {name: "dominican republic"}, {name: "ecuador"},
      {name: "egypt"}, {name: "el salvador"}, {name: "equatorial guinea"}, {name: "eritrea"}, {name: "estonia"}, {name: "eswatini (fmr. swaziland)"}, {name: "ethiopia"}, {name: "fiji"}, {name: "finland"}, {name: "france"},
      {name: "gabon"}, {name: "gambia"}, {name: "georgia"}, {name: "germany"}, {name: "ghana"}, {name: "greece"}, {name: "grenada"}, {name: "guatemala"}, {name: "guinea"}, {name: "guinea-bissau"},
      {name: "guyana"}, {name: "haiti"}, {name: "honduras"}, {name: "hungary"}, {name: "iceland"}, {name: "india"}, {name: "indonesia"}, {name: "iran"}, {name: "iraq"}, {name: "ireland"},
      {name: "israel"}, {name: "italy"}, {name: "jamaica"}, {name: "japan"}, {name: "jordan"}, {name: "kazakhstan"}, {name: "kenya"}, {name: "kiribati"}, {name: "kuwait"}, {name: "kyrgyzstan"},
      {name: "laos"}, {name: "latvia"}, {name: "lebanon"}, {name: "lesotho"}, {name: "liberia"}, {name: "libya"}, {name: "liechtenstein"}, {name: "lithuania"}, {name: "luxembourg"}, {name: "madagascar"},
      {name: "malawi"}, {name: "malaysia"}, {name: "maldives"}, {name: "mali"}, {name: "malta"}, {name: "marshall islands"}, {name: "mauritania"}, {name: "mauritius"}, {name: "mexico"}, {name: "micronesia"},
      {name: "moldova"}, {name: "monaco"}, {name: "mongolia"}, {name: "montenegro"}, {name: "morocco"}, {name: "mozambique"}, {name: "myanmar (formerly burma)"}, {name: "namibia"}, {name: "nauru"}, {name: "nepal"},
      {name: "netherlands"}, {name: "new zealand"}, {name: "nicaragua"}, {name: "niger"}, {name: "nigeria"}, {name: "north korea"}, {name: "north macedonia"}, {name: "norway"}, {name: "oman"}, {name: "pakistan"},
      {name: "palau"}, {name: "palestine state"}, {name: "panama"}, {name: "papua new guinea"}, {name: "paraguay"}, {name: "peru"}, {name: "philippines"}, {name: "poland"}, {name: "portugal"}, {name: "qatar"},
      {name: "romania"}, {name: "russia"}, {name: "rwanda"}, {name: "saint kitts and nevis"}, {name: "saint lucia"}, {name: "saint vincent and the grenadines"}, {name: "samoa"}, {name: "san marino"}, {name: "sao tome and principe"}, {name: "saudi arabia"},
      {name: "senegal"}, {name: "serbia"}, {name: "seychelles"}, {name: "sierra leone"}, {name: "singapore"}, {name: "slovakia"}, {name: "slovenia"}, {name: "solomon islands"}, {name: "somalia"}, {name: "south africa"},
      {name: "south korea"}, {name: "south sudan"}, {name: "spain"}, {name: "sri lanka"}, {name: "sudan"}, {name: "suriname"}, {name: "sweden"}, {name: "switzerland"}, {name: "syria"}, {name: "taiwan"},
      {name: "tajikistan"}, {name: "tanzania"}, {name: "thailand"}, {name: "timor-leste"}, {name: "togo"}, {name: "tonga"}, {name: "trinidad and tobago"}, {name: "tunisia"}, {name: "turkey"}, {name: "turkmenistan"},
      {name: "tuvalu"}, {name: "uganda"}, {name: "ukraine"}, {name: "united arab emirates"}, {name: "united kingdom"}, {name: "united states of america"}, {name: "uruguay"}, {name: "uzbekistan"}, {name: "vanuatu"}, {name: "vatican city"},
      {name: "venezuela"}, {name: "vietnam"}, {name: "yemen"}, {name: "zambia"}, {name: "zimbabwe"}
  ];
    if(this.admin){

      this.apiservice.CommonApi(Apiconfig.profile_data.method,Apiconfig.profile_data.url,{type:"Admin"}).subscribe((result)=>{
        if(result.status){
          
          console.log(result);
          
          this.form.controls['name'].setValue(result.data.name?result.data.name:"")
          this.form.controls['email'].setValue(result.data.email?result.data.email:"")
          this.form.controls['mobile'].setValue(result.data.mobile?result.data.mobile:"")
        }
      })
    }else if(this.companysubadmin){
      let data={
        type:"companysubadmin",
        id:this.localdata._id
      }
      
      this.apiservice.CommonApi(Apiconfig.common_profile_data.method,Apiconfig.common_profile_data.url,data).subscribe((res)=>{
        console.log(res)
        if(res.status){
          console.log(res.data)
          this.form.controls['name'].setValue(res.data.name?res.data.name:"")
          this.form.controls['email'].setValue(res.data.email?res.data.email:"")
          this.form.controls['mobile'].setValue(res.data.mobile?res.data.mobile:"")
        }
      })

    }
    else if(this.subadmin){
      let data={
         type:"subAdmin",
         id:this.localdata._id

      }
      this.apiservice.CommonApi(Apiconfig.common_profile_data.method,Apiconfig.common_profile_data.url,data).subscribe((res)=>{
        console.log(res)
        if(res.status){
          console.log(res.data)
          this.form.controls['name'].setValue(res.data.name?res.data.name:"")
          this.form.controls['email'].setValue(res.data.email?res.data.email:"")
          this.form.controls['mobile'].setValue(res.data.mobile?res.data.mobile:"")
        }
      })
    }
    else{
      if(this.traineradmin){
          // this.citynames=this.localdata.city
          let data={
            type:"Trainer Login",
            id:this.localdata._id
          }
          this.apiservice.CommonApi(Apiconfig.common_profile_data.method,Apiconfig.common_profile_data.url,data).subscribe((result)=>{
            if(result.status){
              this.citynames=result.cityies
              this.form.controls['name'].setValue(result.data.name?result.data.name:"")
              this.form.controls['email'].setValue(result.data.email?result.data.email:"")
              this.form.controls['mobile'].setValue(result.data.mobile?result.data.mobile:"")
              this.form.controls['country'].setValue(result.data.country?result.data.country:"")
              this.form.controls['city'].setValue(result.data.city?result.data.city:"")
              this.form.controls['company'].setValue(result.data.company?result.data.company:"")
              }
              })
      }
  
      if(this.companyadmin){
        
        let data={
          type:"company",
          id:this.localdata._id
        }
        this.apiservice.CommonApi(Apiconfig.common_profile_data.method,Apiconfig.common_profile_data.url,data).subscribe((result)=>{
          if(result.status){
            // this.citynames=result.data.city
         
            
            this.form.controls['name'].setValue(result.data.name?result.data.name:"")
            this.form.controls['email'].setValue(result.data.email?result.data.email:"")
            this.form.controls['mobile'].setValue(result.data.mobile?result.data.mobile:"")
            // this.form.controls['city'].setValue(result.data.city?result.data.city:"")
            // this.form.controls['country'].setValue(result.data.country?result.data.country:'')
            this.form.controls['team'].setValue(result.data.team?result.data.team:'')
            this.form.controls['role'].setValue(result.data.role?result.data.role:'')
           
            
            console.log(result.data.countryCity)
            this.countryCity=result.data.countryCity
            }
            })
        console.log("inside of this arary")
      }
    }
    
    
  }

  changecountry(data:any){
    console.log("++++++++++++++++++++++++++++++++++++++++")
    console.log(data)
    this.form.controls['city'].setValue("")
    this.cityList=data.city
  }
  addCountryCity(i) {
    console.log(i)
    
    this.countryCity.push({ country: '', city: [] });
  }

  // Remove a country-city pair
  removeCountryCity(index: number) {
    this.countryCity.splice(index, 1);
  }

  onFormSubmit(changepasswordForm:NgForm){
    // this.submitebtn = true;
    let data=changepasswordForm.value
    

    if(changepasswordForm.valid){

      
     
      

      if(this.admin){
        let adminlocaldata=JSON.parse(localStorage.getItem("Admin"))
        if(adminlocaldata.mobile!=data.mobile){
          this.firebaseSerive.checkmobileexsist(data.mobile).then((result)=>{
            if(result>0){
              this.notification.showError("Phone number already exsisted")

            }else{
              this.apiservice.CommonApi(Apiconfig.update_profile.method,Apiconfig.update_profile.url,data).subscribe((result)=>{
                if(result.status){
                  localStorage.setItem('Admin',JSON.stringify(result.data))
                  this.notification.showSuccess("Updated successfully")
                }
              })
            }
          })
        }else{
              this.apiservice.CommonApi(Apiconfig.update_profile.method,Apiconfig.update_profile.url,data).subscribe((result)=>{
                if(result.status){
                  localStorage.setItem('Admin',JSON.stringify(result.data))
                  this.notification.showSuccess("Updated successfully")
                }
              })
        }
       
      }
      else if(this.companysubadmin){
        let subadminlocaldata=JSON.parse(localStorage.getItem("companysubadmin"))
        data._id=subadminlocaldata._id
        if(subadminlocaldata.mobile!=data.mobile){
        
          this.firebaseSerive.checkmobileexsist(data.mobile).then((result:any)=>{
            console.log(result)
            if(result>0){
              this.notification.showError("Phone number already exsisted")
            }else{
              this.apiservice.CommonApi(Apiconfig.common_update_profile.method,Apiconfig.common_update_profile.url,data).subscribe((result)=>{
                if(result.status){
                  this.notification.showSuccess("Updated successfully")
                  localStorage.setItem(result.access,JSON.stringify(result.data))
                }else{
                  this.notification.showError(result.message)
                }
              })
            }
          })
        }else{
            this.apiservice.CommonApi(Apiconfig.common_update_profile.method,Apiconfig.common_update_profile.url,data).subscribe((result)=>{
          if(result.status){
            this.notification.showSuccess("Updated successfully")
            localStorage.setItem(result.access,JSON.stringify(result.data))
          }else{
            this.notification.showError(result.message)
          }
        })
      
        }

        
      }else if(this.subadmin){
        let subadminlocaldata=JSON.parse(localStorage.getItem("subAdmin"))
        data._id=subadminlocaldata._id
        if(subadminlocaldata.mobile!=data.mobile){
        
          this.firebaseSerive.checkmobileexsist(data.mobile).then((result:any)=>{
            console.log(result)
            if(result>0){
              this.notification.showError("Phone number already exsisted")
            }else{
              this.apiservice.CommonApi(Apiconfig.common_update_profile.method,Apiconfig.common_update_profile.url,data).subscribe((result)=>{
                if(result.status){
                  this.notification.showSuccess("Updated successfully")
                  localStorage.setItem(result.access,JSON.stringify(result.data))
                }else{
                  this.notification.showError(result.message)
                }
              })
            }
          })
        }else{
            this.apiservice.CommonApi(Apiconfig.common_update_profile.method,Apiconfig.common_update_profile.url,data).subscribe((result)=>{
          if(result.status){
            this.notification.showSuccess("Updated successfully")
            localStorage.setItem(result.access,JSON.stringify(result.data))
          }else{
            this.notification.showError(result.message)
          }
        })
      
        }

        
      }
      else {
        console.log(this.localdata)
        data._id=this.localdata._id
        if(this.localdata.access==="company"){
          data.countryCity=this.countryCity
        }
        
        if(this.localdata.mobile!=data.mobile){
          this.firebaseSerive.checkmobileexsist(data.mobile).then((result:any)=>{
            console.log(result)
            if(result>0){
              this.notification.showError("Phone number already exsisted")
            }else{
              this.apiservice.CommonApi(Apiconfig.common_update_profile.method,Apiconfig.common_update_profile.url,data).subscribe((result)=>{
                if(result.status){
                  this.notification.showSuccess("Updated successfully")
                  localStorage.setItem(result.access,JSON.stringify(result.data))
                }else{
                  this.notification.showError(result.message)
                }
              })
            }
          })
        }else{
            this.apiservice.CommonApi(Apiconfig.common_update_profile.method,Apiconfig.common_update_profile.url,data).subscribe((result)=>{
          if(result.status){
            this.notification.showSuccess("Updated successfully")
            localStorage.setItem(result.access,JSON.stringify(result.data))
          }else{
            this.notification.showError(result.message)
          }
        })
      
        }
       
        
      }
    }else{
      this.notification.showError("Please fillt the fields")
    }
  } 

}

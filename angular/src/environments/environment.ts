// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: "http://34.100.213.250:4002/",
  //PROD API url
  //apiUrl: "http://34.100.213.250:4000/", 
  //local
  //apiUrl: "http://localhost:4000/", 

  // apiUrl: "https://profluent.quickiz.com/",

  // apiUrl:"http://192.168.1.45:4000/",
  // apiUrl: "https://ecommerce-dev.quickiz.com/",
  // apiUrl: 'https://ecommerce-testing.quickiz.com/',
  mapKey: 'AIzaSyBxvZ4uekYJgs7atKyK3x0UOhZzcYw19Rg',
  // firebaseConfig :{
  //   apiKey: "AIzaSyDGyQDDDN3dt7-jr3gSmCy12Ij24c25_Xs",
  //   authDomain: "lite-learning-lab.firebaseapp.com",
  //   databaseURL: "https://lite-learning-lab.firebaseio.com",
  //   projectId: "lite-learning-lab",
  //   storageBucket: "lite-learning-lab.appspot.com",
  //   messagingSenderId: "620147953805",
  //   appId: "1:620147953805:web:7e001c3a9822dc5cb752c4"
  // }
 firebaseConfig: {
    apiKey: "AIzaSyBWDZkn03gGxw7jnJYSQI0PZQbSTY8LC1Q",
    authDomain: "hotel-management-app-d25d5.firebaseapp.com",
    databaseURL: "https://hotel-management-app-d25d5-default-rtdb.firebaseio.com",
    projectId: "hotel-management-app-d25d5",
    storageBucket: "hotel-management-app-d25d5.firebasestorage.app",
    messagingSenderId: "233565329277",
    appId: "1:233565329277:web:eb0011844adb7e25005e14",
    //measurementId: "G-7ZKCWWK72K"
  }
};
// export const environment = {
//   production: false,
//   apiUrl:"  https://ecommerce-testing.quickiz.com/",
//   mapKey: 'AIzaSyBxvZ4uekYJgs7atKyK3x0UOhZzcYw19Rg'
// };
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

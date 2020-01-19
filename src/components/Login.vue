<template>
    <div class="login">
      <div style="margin-bottom: 40px;">
        <img class="tt-logo" src="../assets/tt-logo.png">
        <h1 class="tt-portal is-italic is-size-4">Galaxy Maps</h1>
      </div>
      <div id="firebaseui-auth-container"></div>
      <!-- <div style="margin-top: 60px;">
        <p class="dev-by is-italic">Developed by</p>
        <img class="dev-logo" src="../assets/seenbros.png">
      </div> -->
    </div>
  </template>
  
  <script>
  import firebase from "firebase";
  import * as firebaseui from "firebaseui";
  import "firebaseui/dist/firebaseui.css";
  
  export default {
    name: "Login",
    data: function() {
      return {
        email: "",
        password: ""
      };
    },
    mounted() {
      // FirebaseUI config.
      var uiConfig = {
        signInSuccessUrl: process.env.BASE_URL,
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ]
      };
      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
      //if (ui.isPendingRedirect()) {
      ui.start("#firebaseui-auth-container", uiConfig);
      //}
    }
  };
  </script>
  
  <style scoped>
  .login {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #393e46;
    background-image: url('../assets/unsplash-galaxy.jpg');
    background-size: cover;
  }
  
  .tt-logo {
    width: 150px;
  }
  .tt-portal {
    color: white;
    font-family: monospace;
  }
  
  .dev-by {
    color: white;
    font-family: monospace;
    font-size: 10px;
  }
  .dev-logo {
    width: 100px;
  }
  </style>
  
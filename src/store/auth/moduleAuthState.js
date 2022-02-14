/*=========================================================================================
  File Name: moduleAuthState.js
  Description: Auth Module State
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import auth from "@/auth/authService";
import firebase from "firebase/app";
import "firebase/auth";

export default {
  isUserLoggedIn: () => {
    return localStorage.getItem("userInfo");
  },
};

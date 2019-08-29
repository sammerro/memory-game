import Vue from "vue";
import App from "./App.vue";
import firebase from "firebase";

Vue.config.productionTip = false;

const config = {
  apiKey: "AIzaSyBG95iixK_JyLw5kfhU5OwgJuHyZYPAgPU",
  authDomain: "memory-1cf1f.firebaseapp.com",
  databaseURL: "https://memory-1cf1f.firebaseio.com",
  projectId: "memory-1cf1f",
  storageBucket: "",
  messagingSenderId: "306319575118",
  appId: "1:306319575118:web:1126ac319022be01"
};

firebase.initializeApp(config);

export const db = firebase.firestore();

new Vue({
  render: h => h(App)
}).$mount("#app");

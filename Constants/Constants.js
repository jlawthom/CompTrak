const DEV = false;
const LOCAL_DIR = location.origin + "/CompTrak/";
const BASE_DIR = location.origin + "/";

let active_dir = BASE_DIR;
let redirect_uri = BASE_DIR + "Auth/Login_Redirect.html";
if (DEV) {
  active_dir = LOCAL_DIR;
  redirect_uri = "https://jlawthom.github.io/CompTrak-Dev-Auth-Redirect"
}

console.log("active_dir: " + active_dir);
console.log("redirect_uri: " + redirect_uri);

const LOGIN_HTML = "Login/Login.html";
const REGISTER_HTML = "Register/Register.html";
const HOME_HTML = "Home%20Page/Home%20Page.html";
const NEW_TOURNAMENT_TREE_HTML = "New%20Tournament/New%20Tournament.html";
const TOURNAMENT_TREE_HTML = "Tournament%20Tree/Tournament%20Tree.html";
const ACCOUNT_HTML = "Account/Account.html";

const LOCAL_URL = "http://localhost:8080";
const BASE_URL = "http://35.234.133.160:8081";
const ACTIVE_URL = BASE_URL;
const API_CALLER = ".execute-api.eu-west-2.amazonaws.com/prod/";

const CRT_TOURNAMENT = "https://v2ev1qydtk";
const DEL_TOURNAMENT = "https://qbsi45jdv4";
const UPD_TOURNAMENT = "/Tournament/update/";
const GET_TOURNAMENT = "https://v2ev1qydtk";

const CRT_MATCH = "https://dby1vipvh6";
const DEL_MATCH = "/Match/delete/";
const UPD_MATCH = "https://8dffjixrt8";
const GET_MATCH = "https://5mvewi1zdh";

const CRT_USER = "/User/create";
const DEL_USER = "/User/delete/";
const UPD_USER = "/User/update/";
const GET_USERS = "/User/getAll";
const LOGIN_USER = "/User/login/";
const GET_USR_BY_ID = "/User/getById/"


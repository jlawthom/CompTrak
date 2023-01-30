// Local Dev = localhost:8080/CompTrak/
// Staging = CompTrak-Dev.lawthom.tech
// Production = CompTrak.lawthom.tech
const active_dir = location.origin + "/";
const login_redirect_uri = location.origin + "/Auth/Login_Redirect.html";
const logout_redirect_uri = location.origin + "/Auth/Logout_Redirect.html";

const api_stage = window.location.hostname.includes('-dev') ? "dev" : "prod";

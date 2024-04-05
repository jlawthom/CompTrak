const active_dir = location.origin + "/CompTrak/";
const login_redirect_uri = location.origin + "/CompTrak/Auth/Login_Redirect.html";
const logout_redirect_uri = location.origin + "/CompTrak/Auth/Logout_Redirect.html";
const api_stage = sessionStorage.getItem('api_stage') || "prod";

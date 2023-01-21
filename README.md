# CompTrak

## Local Dev Auth0 Redirects
Auth0 doesn't allow redirects to http (e.g. http://localhost:8080), therefore, a proxy is used using env.js

env.js was pushed to GitHub with STG / PROD values. Local version should use the below:

```
// Local Dev = localhost:8080/CompTrak/
// Staging = CompTrak-Dev.lawthom.tech
// Production = CompTrak.lawthom.tech
const active_dir = location.origin + "/CompTrak/";

// Redirects to http://localhost:8080/CompTrak/Auth/Login_Redirect.html" + url_params;
const login_redirect_uri = "https://jlawthom.github.io/CompTrak-Dev-Auth-Redirect";

// Redirects to http://localhost:8080/CompTrak/Auth/Logout_Redirect.html" + url_params;
const logout_redirect_uri = "https://jlawthom.github.io/CompTrak-Dev-Auth-Redirect/logout-redirect.html";
```

Use `git update-index --assume-unchanged env.js` to ensure these changes are not pushed to GitHub.
let userInfo = localStorage.getItem("userAcc");

userInfo === null ? userInfo === null : userInfo = JSON.parse(userInfo);
function isAuth() {
  if (userInfo !== null ) {
    console.log("user Exist ==== ", userInfo);
    console.log("after Parse ==== ", userInfo);
    return userInfo;
  } else {
    console.log("user didnot Exist ==== ", userInfo, "redirect to SignIn Page");
    window.location.href = "../auth/signin.html";
    // return userInfo =  false;
  }
}
function logout() {
  const currentOrigin = window.location.origin;
  console.log("Current origin:", currentOrigin);
  
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      console.log("localStorage.removeItem ===== ", key);
      localStorage.removeItem(key);
    }
  }

console.log("Local storage data for the origin has been removed.");

  // localStorage.removeItem("userAcc");
  // localStorage.removeItem
  console.log("Logout successfully! redirected to signin");
  window.location.href = "../auth/signin.html";
}

export { isAuth, logout };

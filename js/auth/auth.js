let userInfo = localStorage.getItem("userAcc");
let AllBlog = localStorage.getItem("AllBlog");

userInfo === null ? userInfo === null : userInfo = JSON.parse(userInfo);
AllBlog === null ? AllBlog === null : AllBlog = AllBlog;
function isAuth() {
  if (userInfo !== null ) {
    console.log("user Exist ==== ", userInfo);
    console.log("after Parse ==== ", userInfo);
    return userInfo;
  } else if(AllBlog === "All_User"){
    console.log("All Users can read Blog ==== ", AllBlog, "redirect to SignIn Page");
    return AllBlog;
    // window.location.href = "../auth/signin.html";
    // return userInfo =  false;
  }else {
    console.log("user didnot Exist ==== ", userInfo, "redirect to SignIn Page");
    window.location.href = "../auth/signin.html";
    // return userInfo =  false;
  }
}
function logout( url = "../blogview.html") {
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
  
  // let current_url = window.location;
  // console.log("current_url window=== ", current_url);
  // current_url = current_url + 'pages/blogview.html';
  //       console.log("current_url === ", current_url);
  //       // window.location.replace(current_url);
  window.location.href = url;
}

export { isAuth, logout };

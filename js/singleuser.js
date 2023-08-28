import { isAuth, logout } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

document.getElementById("Top").style.display = "block";
window.addEventListener("load", () => {

  console.log("Single Blog Page")

  // Get Category Data for admin
  let getAllItemData = async (url) => {
    try {
      const snapshot = await get(ref(database, url));
      // Data snapshot contains the data at the specified location
      let itemsData = snapshot.val();
      console.log("Retrieved data:", itemsData);
      itemsData = Object.values(itemsData);
      return itemsData;
    } catch (error) {
      console.error("Error getting data:", error);
      alert(error);
      return false;
    }
  };

  let userId = localStorage.getItem("singleuser");
  let imageURL = userAcc.blogimg;
  console.log("userAcc ", userAcc);
  let username = `${userAcc.firstname} ${userAcc.lastname} `;
  console.log("userAcc Id", userId);

  // Use the Firebase Configuration functions
  const {
    database,
    ref,
    set,
    get,
    remove,
    storage,
    storageRef,
    uploadBytes,
    getDownloadURL,
  } = firebaseExports;

  
  const showElement = (elementId, display = "block") => {
    document.getElementById(elementId).style.display = display;
  };

  const addClickListener = (elementId, destination) => {
    const element = document.getElementById(elementId);
    element.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = destination;
    });
  };

  addClickListener('all-blog' , '../blogview.html')
  // Check if the page has been loaded before
  const isFirstLoad = JSON.parse(localStorage.getItem("isUserFirstLoad"));
  //
  let capitalizeWords = (str) => {
    return str.replace(/\b\w/g, function (match) {
      return match.toUpperCase();
    });
  };

  let showItem = (
    container,
    ind, username,
    date,
    blogtitle,
    blogcontent, imageURL
  ) => {
    username = capitalizeWords(username);
    // let link = replaceSpacesWithHyphens(category);
    const itemHTML = `<div class="row" id='${blogtitle}'>
    <div class="title">
        <div class="blog-details">
            <div class="blogger-img">
                <img src="${imageURL}" alt="user" data-src="${imageURL}" class="lazy-image"/>
            </div>
            <div class="blog-title">
                <h3 id="blog-title">${blogtitle}</h3>
                <div class="user-details">
                    <p id="username">${username} - </p> 
                    <p id="date">${date}</p> 
                </div>
            </div>
        </div>
        <div class="blog-content">
            <p id="blog-content">
                ${blogcontent}</p>
        </div>
        <div class="blog-content">
            <a id="delete" href
            ="#" >Delete</a>
            <a id="edit" href ="#">Edit</a>
        </div>
    </div>
</div>`;

    container.insertAdjacentHTML("beforeend", itemHTML);

  };

    // ref(database, 'blogs/' + userId + `/${blogtitle}`)
    getAllItemData(`blogs/${userId}/`)
      .then((blogData) => {
        if (!blogData) {
          console.log("Data is null");
        } else {
          // Here you can continue with rendering your data or performing other tasks
          console.log("updated into Array ====:", blogData);

          userAcc.blogimg == null? imageURL = "../../img/profile.png" : imageURL = userAcc.blogimg
          const container = document.getElementById("blog-container");
          blogData.forEach((ele, ind) => {

            console.log("username, ele.date,ele.blogtitle,ele.blogcontent, === ", username, 
          ele.blogdate,ele.blogtitle,ele.blogcontent,);
            // ind, username, 
            //   date,
            //   blogtitle,
            //   blogcontent,imageURL = ""
            showItem(
              container,
              ind, username,
              ele.blogdate,
              ele.blogtitle,
              ele.blogcontent,
              imageURL
            );

            // const lazyImages = document.querySelectorAll(".lazy-image");
            //       const loadImagePromises = [];
            //       lazyImages.forEach((img) => {
            //         const promise = new Promise((resolve) => {
            //           img.addEventListener("load", () => {
            //             resolve();
            //           });
            //           img.src = img.getAttribute("data-src");
            //         });
            //         loadImagePromises.push(promise);
            //       });
            //       Promise.all(loadImagePromises)
            //         .then(() => {
            //           console.log("All lazy-loaded images are loaded.");
            //         })
            //         .catch((error) => {
            //           console.error("An error occurred:", error);
            //         });

          })


        }
        // Process the retrieved data
      })

      .catch((error) => {
        console.error("Error fetching Items Data:", error);
      });
  });

  var logoutbtn = document.getElementById("logout");

  logoutbtn.addEventListener("click", function () {

    console.log("Logout");
    setTimeout(() => {
      logout();
    }, 1000);
  });


  if (userAcc && userAcc.acc_type === "blogger") {
  
    const addClickListener = (elementId, destination) => {
      const element = document.getElementById(elementId);
      element.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem('AllBlog');
        window.location.href = destination;
      });
    };
    addClickListener('profile' , './dashboard/profile.html');
   
    // Check if the page has been loaded before
    const isFirstLoad = JSON.parse(localStorage.getItem("isUserFirstLoad"));
  
    document.getElementById("adminname").innerText = userAcc.firstname + " " + userAcc.lastname;
  
    
  } else {
    console.log("Any User Can View Blogs");
    document.getElementById("adminname").innerText = "Guest";
    document.getElementById('profile').style.display = "none";
    document.getElementById('dashboard').style.display = "none";
    document.getElementById('logout').style.display = "none";
  } 
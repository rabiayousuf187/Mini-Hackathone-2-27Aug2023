import { isAuth, logout } from "./auth/auth.js";
import firebaseExports from "./config/firebase-config.js";
let userAcc = isAuth();

// localStorage.setItem()
console.log("userAcc get via is Auth()", userAcc);

document.getElementById("Top").style.display = "block";

const currentHour = new Date().getHours();
let greeting;

if (currentHour >= 5 && currentHour < 12) {
  greeting = "Good Morning";
} else if (currentHour >= 12 && currentHour < 18) {
  greeting = "Good Afternoon!";
} else if (currentHour >= 18 && currentHour < 22) {
  greeting = "Good Evening";
} else {
  greeting = "Good Night";
}
document.getElementById('greet').textContent = greeting + " Reader!"

const addClickListener = (elementId, destination) => {
  const element = document.getElementById(elementId);
  element.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem('AllBlog');
    window.location.href = destination;
  });
}
window.addEventListener("load", () => {
  

  console.log("BLogs View Page")

//   let userId = userAcc.id;
//   let imageURL = userAcc.blogimg;
  console.log("userAcc ", userAcc);
  let username = `${userAcc.firstname} ${userAcc.lastname} `;
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


  //
  let capitalizeWords = (str) => {
    return str.replace(/\b\w/g, function (match) {
      return match.toUpperCase();
    });
  };
 
   // Get Category Data for admin
   let getAllItemData = async (url) => {
    try {
      const snapshot = await get(ref(database, url));
      // Data snapshot contains the data at the specified location
      let itemsData = snapshot.val();
      console.log("Retrieved data:", itemsData);
      // itemsData = Object.values(itemsData);
      return itemsData;
    } catch (error) {
      console.error("Error getting data:", error);
      alert(error);
      return false;
    }
  };

  
  // container,
  // userId, username,email,
  // ele.blogId,
  // ele.blogdate,
  // ele.blogtitle,
  // ele.blogcontent,
  // imageURL

  let showItem = (
    container,
    userId, username, email,
    blogId,
    date,
    blogtitle,
    blogcontent, imageURL
  ) => {
    username = capitalizeWords(username);
    // let link = replaceSpacesWithHyphens(category);
    const itemHTML = `<div class="row" id='${blogId}'>
    <div class="title">
    <div class="blog-details">
              <p id="email" style = "display:none;">${email}</p>
              <div class="blogger-img">
                  <img src="../img/profile.png" alt="user" data-src="${imageURL}" class="lazy-image"/>
              </div>
              <div class="blog-title">
                <h3 id="blog-title">${blogtitle}</h3>
                <div class="user-details">
                    <p id="username">${username}</p> 
                    <p id="date">- ${date}</p> 
                </div>
              </div>
        </div>
        <div class="blog-content">
          <p id="blog-content" class="blog-content-text">
          ${blogcontent}</p>
          <a id="read-more-btn" class="read-more-btn">More</a>
        </div>
        <div class="blog-content">
          <a id="${userId}" href="#" style="color: #830bcee6;
          font-size: medium;font-weight: 500;" >See all from this user</a>
        </div>
    </div>
</div>`;

    container.insertAdjacentHTML("beforeend", itemHTML);

  };

    
  document.getElementById('blog-container').addEventListener("click", function (event) {
    let link;
    console.log(
      "Button pressed",
      event,
      event.target.querySelector("i"),
      event.target.tagName
    );
    if (event.target.tagName === "A" && event.target.getAttribute('id') === "read-more-btn" && event.target.classList.contains("read-more-btn")) {

        const contentParagraph = event.target.parentNode.querySelector('.blog-content-text');
        const moreButton = event.target;
    
        if (contentParagraph.classList.contains('expanded')) {
          contentParagraph.classList.remove('expanded');
          moreButton.textContent = 'More';
        } else {
          contentParagraph.classList.add('expanded');
          moreButton.textContent = 'Less';
        }
    
        event.stopPropagation();
      
    }
    else if (event.target.tagName === "A" && event.target.textContent === 'See all from this user') {
    // else if (event.target.tagName === "A" && event.target.getAttribute('id') === userId) {
      console.log("Icon selected");
      
      let img = event.target.parentNode.parentNode.querySelector('img').getAttribute('src');
      let name = event.target.parentNode.parentNode.querySelector('#username').textContent;
      let email = event.target.parentNode.parentNode.querySelector('#email').textContent;

      console.log("TArgey IMg ===== ", email);
      console.log("TArgey IMg ===== ", img);
      link = event.target.getAttribute('id');
      console.log("single user BLog Show === ",link);

      let singleuser ={
        id: link,
        img: img,
        name: name,
        email: email
      }
      localStorage.setItem("singleuser" , JSON.stringify(singleuser));
      window.location.href = "./singleuser.html";
      event.stopPropagation();
    } else {
      console.log("not a target element");
      event.stopPropagation();
    }
    // event.stopPropagation();

    // addCart(selectedCategory, link);
  })

    getAllItemData(`blogs/`)
      .then((blogData) => {
        if (!blogData) {
          console.log("Data is null");
        } else {
        getAllItemData(`users/`)
        .then((userData) => {
            if (!userData) {
              console.log("userData is null");
            } else {
                // Here you can continue with rendering your data or performing other tasks
          console.log("Blog data into Array ====:", blogData);
          console.log("updated into Array ====:", userData);

            
            const container = document.getElementById("blog-container");
          //   const data = {
          //     ABC: {
          //         innerObj: {
          //             key: "red"
          //         }
          //     },
          //     DEE: {
          //         innerObj: {
          //             key: "red"
          //         }
          //     },
          //     ghy: {
          //         innerObj: {
          //             key: "red"
          //         }
          //     }
          // };
            for (const outerKey in userData) {
              if (blogData.hasOwnProperty(outerKey)) {
                  // Access the 'key' property within the 'innerObj'
                  let user = userData[outerKey];
                  let imageURL = userData[outerKey].blogimg;
                  let email = userData[outerKey].email;
                  let userId = outerKey;
                  let blog = blogData[outerKey];
                  console.log("outerKey === ", userId, user, blog);
            
                  imageURL == null? imageURL = "../img/profile.png" : imageURL = user.blogimg
                  console.log("User ID img == ", userId, imageURL)
                  username = `${user.firstname} ${user.lastname}`
            
                  // Render BLogsss
                  Object.values(blog).forEach((ele) => {
                    console.log("Blog INside == ", ele)
                    
                    showItem(
                      container,
                      userId, username,email,
                      ele.blogId,
                      ele.blogdate,
                      ele.blogtitle,
                      ele.blogcontent,
                      imageURL
                    );

                    
            const lazyImages = document.querySelectorAll(".lazy-image");
            const loadImagePromises = [];
            lazyImages.forEach((img) => {
              const promise = new Promise((resolve) => {
                img.addEventListener("load", () => {
                  resolve();
                });
                img.src = img.getAttribute("data-src");
              });
              loadImagePromises.push(promise);
            });
            Promise.all(loadImagePromises)
              .then(() => {
                console.log("All lazy-loaded images are loaded.");
              })
              .catch((error) => {
                console.error("An error occurred:", error);
              });
                  });
                }

              }
              
          }
            })
            
      .catch((error) => {
        console.error("Error fetching Items Data:", error);
      });
            
        }
        })
        .catch((error) => {
            console.error("Error fetching Blog Images:", error);
            alert("Error fetching Blog Images:", error);
          });

        

  let getSelectedItemData = async (url) => {
    try {
      let snapshot = await get(ref(database, url));
      // Data snapshot contains the data at the specified location
      let itemsData = snapshot.val();
      console.log("Retrieved data:", itemsData);
      // itemsData = Object.values(itemsData);
      return itemsData;
    } catch (error) {
      console.error("Error getting data:", error);
      return false;
    }
  };


  var logoutbtn = document.getElementById("logout");

  logoutbtn.addEventListener("click", function () {

    console.log("Logout");
    setTimeout(() => {
      logout();
    }, 1000);
  });



});
if (userAcc && userAcc.acc_type === "blogger") {
  
  document.querySelector('.all-blog').classList.add('justify-content-space-between"')
  addClickListener('profile' , './dashboard/profile.html')
  addClickListener('dashboard' , './dashboard/dashboard.html')

  document.getElementById('login').style.display = "none";
  // Check if the page has been loaded before
  const isFirstLoad = JSON.parse(localStorage.getItem("isUserFirstLoad"));

  document.getElementById("adminname").innerText = userAcc.firstname + " " + userAcc.lastname;
  
  var logoutbtn = document.getElementById("logout");

  logoutbtn.addEventListener("click", function () {

      console.log("Logout");
      setTimeout(() => {
          logout();
      }, 1000);
  });
} else {
  console.log("Any User Can View Blogs");
  addClickListener('login', './pages/auth/signin.html');
 document.getElementById("adminname").innerText = "Guest";
  document.getElementById('profile').style.display = "none";
  document.getElementById('dashboard').style.display = "none";
  document.getElementById('logout').style.display = "none";

  addClickListener('login', './auth/signin.html')
} 
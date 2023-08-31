import { isAuth, logout } from "./auth/auth.js";
import firebaseExports from "./config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

document.getElementById("Top").style.display = "block";

const addClickListener = (elementId, destination) => {
  const element = document.getElementById(elementId);
  element.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem('AllBlog');
    window.location.href = destination;
  });
};

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

  let singleuser = localStorage.getItem("singleuser");
  singleuser = JSON.parse(singleuser);

  let userId = singleuser.id;
  console.log("userAcc Id", userId);
  
  let username = singleuser.name;
  let imageURL = singleuser.img;
  let email = singleuser.email;
  imageURL == null ? imageURL = "../../img/profile.png" : imageURL = imageURL;
  console.log("userAcc ", userAcc);

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

document.getElementById('bloggername').innerText = username + " Blogs";
document.getElementById('email').innerText = email;
document.getElementById('email').href = `mailto:${email}`;
document.getElementById('profilename').innerText = username;
document.getElementById('bloggerImg').src = imageURL;

  addClickListener('all-blog', './blogview.html')
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
    blogId,
    date,
    blogtitle,
    blogcontent, imageURL
  ) => {
    username = capitalizeWords(username);
    // let link = replaceSpacesWithHyphens(category);
    const itemHTML = `<div class="row" id='${blogId}'>
    <div class="title">
        <div class="blog-details" >
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
            <p id="blog-content" class="blog-content-text">
                ${blogcontent}</p>
            <a id="read-more-btn" class="read-more-btn">More</a>
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
    else {
      console.log("not a target element");
      event.stopPropagation();
    }
    // event.stopPropagation();

    // addCart(selectedCategory, link);
  })

  // ref(database, 'blogs/' + userId + `/${blogtitle}`)
  getAllItemData(`blogs/${userId}/`)
    .then((blogData) => {
      if (!blogData) {
        console.log("Data is null");
      } else {
        // Here you can continue with rendering your data or performing other tasks
        console.log("updated into Array ====:", blogData);

        
        const container = document.getElementById("blog-container");
        blogData.forEach((ele, ind) => {

          console.log("username, ele.date,ele.blogtitle,ele.blogcontent, === ", username,
            ele.blogdate, ele.blogtitle, ele.blogcontent,);
          // ind, username, 
          //   date,
          //   blogtitle,
          //   blogcontent,imageURL = ""
          showItem(
            container,
            ind, username,
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
        })


      }
      // Process the retrieved data
    })

    .catch((error) => {
      console.error("Error fetching Items Data:", error);
    });
});



if (userAcc && userAcc.acc_type === "blogger") {


  addClickListener('profile', './dashboard/profile.html');
  addClickListener('dashboard', './dashboard/dashboard.html');

  // Check if the page has been loaded before
  const isFirstLoad = JSON.parse(localStorage.getItem("isUserFirstLoad"));

  document.getElementById("adminname").innerText = userAcc.firstname + " " + userAcc.lastname;
  console.log("document.getElementById('all-blog') === ", document.getElementById('all-blog'))
  document.getElementById('all-blog').parentNode.classList.remove('justify-content-center')
  document.getElementById('all-blog').parentNode.classList.add('justify-content-around')

  document.getElementById('login').style.display = "none";
  
  var logoutbtn = document.getElementById("logout");

  logoutbtn.addEventListener("click", function () {

      console.log("Logout");
      setTimeout(() => {
          logout();
      }, 1000);
  });
} else {
  console.log("Any User Can View Blogs");
  document.getElementById('all-blog').parentNode.classList.remove('justify-content-around')
  document.getElementById('all-blog').parentNode.classList.add('justify-content-center')

  addClickListener('login', './auth/signin.html')
  document.getElementById("adminname").innerText = "Guest";
  document.getElementById('profile').style.display = "none";
  document.getElementById('dashboard').style.display = "none";
  document.getElementById('logout').style.display = "none";
} 
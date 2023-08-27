import { isAuth, logout } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "blogger") {

  console.log("Dashboard Page")
  document.getElementById("Top").style.display = "block";
  document.getElementById("adminname").innerText = userAcc.firstname + " " + userAcc.lastname;

  let userId = userAcc.id;
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
  addClickListener('profile' , './profile.html')
  // Check if the page has been loaded before
  const isFirstLoad = JSON.parse(localStorage.getItem("isUserFirstLoad"));
  //
  let capitalizeWords = (str) => {
    return str.replace(/\b\w/g, function (match) {
      return match.toUpperCase();
    });
  };
  let deleteBlog = (userId, id) =>{
    return new Promise((resolve, reject) => {
      const userRef = ref(database, 'blogs/' + userId + `/${id}`);

      remove(userRef)
        .then(() => {
          console.log("Blog Removed to Firebase Database.");
          alert("Blog Removed to Firebase Database.");
          location.reload();
          resolve(); // Resolve the promise to indicate success
        })
        .catch((error) => {
          console.error("Error in  Removeing :", error);
          reject(error); // Reject the promise with the error
        });
    });
  }
  // let deleteBlog = (id) =>{
  //   .remove()
  //   .then(() => {
  //       console.log(`User with ID ${userIdToDelete} deleted successfully.`);
  //   })
  //   .catch((error) => {
  //       console.error(`Error deleting user: ${error}`);
  //   });
  // }
  let showItem = (
    container,
    ind, username,
    date,
    blogtitle,
    blogcontent, imageURL = "../../img/profile.png"
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

    container.addEventListener("click", function (event) {
      let link;
      console.log(
        "Button pressed",
        event,
        event.target.querySelector("i"),
        event.target.tagName
      );
      if (
        event.target.tagName === "A" &&  event.target.getAttribute('id') == 'delete'
      ) {
        console.log("Icon selected");
        link = event.target.parentNode.parentNode.parentNode.getAttribute('id');
        console.log("Delete link === ",link);

        deleteBlog(userId,link)
      } else if (
        event.target.tagName === "A" &&  event.target.getAttribute('id') == 'edit'
      ) {
        console.log("Icon selected");
        link = event.target.parentNode.parentNode.parentNode.getAttribute('id');
        console.log("Edit link === ",link);
        alert("Could not Edit Yet")
        // editeBlog(userId,link)
      }else {
        console.log("not a target element");
      }

      // addCart(selectedCategory, link);
    });
  };

  window.addEventListener("load", () => {
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

  const signupForm = document.getElementById("signup-form");


  // Function to display error message for an input field
  function showError(inputElement, errorMessage) {
    const errorElement = document.getElementById(inputElement.id + "Error");
    errorElement.textContent = errorMessage;

    // Add the .error class to the input element
    errorElement.classList.add("error");
    console.log(
      " inputElement.classList.add('error') = ",
      errorElement,
      errorElement.classList.add("error")
    );
  }

  // Function to clear error message for an input field
  function clearError(inputElement) {
    const errorElement = document.getElementById(inputElement.id + "Error");
    errorElement.textContent = "";

    // Remove the .error class from the input element
    errorElement.classList.remove("error");
    console.log(
      "inputElement.classList.remove('error'); = ",
      errorElement.classList.remove("error")
    );
  }


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

  // Function to validate the form on submission
  function validateForm(event) {
    event.preventDefault();

    const blogtitle = document.getElementById("blogtitle").value;
    const blogcontent = document.getElementById("blogcontent").value;

    let acc_type, userAcc;
    // let acc_type = document.querySelector('input[name="acc_type"]:checked');

    console.log("blogtitle = ", blogtitle);
    console.log("blogcontent = ", blogcontent);

    if (blogtitle.trim() === "") {
      showError(
        document.getElementById("blogtitle"),
        "blogtitle is required."
      );
    } else {
      clearError(document.getElementById("blogtitle"));
    }
    if (blogcontent.trim() === "") {
      showError(
        document.getElementById("blogcontent"),
        "blogcontent is required."
      );
    } else {
      clearError(document.getElementById("blogcontent"));
    }

    console.log(
      "!document.querySelector.error ==== ",
      document.querySelector("#signup-form")
    );
    console.log(
      "!document.querySelector.error ==== ",
      !document.querySelector(".error")
    );
    if (!document.querySelector(".error")) {
      if (
        !blogtitle ||
        !blogcontent
      ) {
        alert("Refill Form for all Feilds\nSome Feilds are undefined.");
        console.log("Refill Form for all Feilds\nSome Feilds are undefined.");
      } else {
        // Submit the form or do any other required action here
        console.log("Form submitted successfully!");
        // Call the function to create a user with Firebase Authentication
        var currentDate = new Date();
        var dateString = currentDate.toISOString().substr(0, 10); // Format as YYYY-MM-DD

        console.log("Blog Date Append  == ", dateString)
        console.log("User Id ==== ", userId);
        writeUserData(userId, blogtitle, blogcontent, dateString)
          .then(() => {
            alert("Blog is Successfully Published");
            window.location.href = "../dashboard/dashboard.html";
            //
          })
          .catch((error) => {
            console.error("Error Publishing Blog:", error);
          });

      }
    }
  }

  // Attach form validation function to the form's submit event
  signupForm.addEventListener("submit", validateForm);

  let writeUserData = (userId, blogtitle, blogcontent, date) => {
    return new Promise((resolve, reject) => {
      const userRef = ref(database, 'blogs/' + userId + `/${blogtitle}`);

      set(userRef, {
        userId: userId,
        blogtitle: blogtitle,
        blogcontent: blogcontent,
        blogdate: date
      })
        .then(() => {
          console.log("Blog saved to Firebase Database.");
          resolve(); // Resolve the promise to indicate success
        })
        .catch((error) => {
          console.error("Errori in Blog saving :", error);
          reject(error); // Reject the promise with the error
        });
    });
  }

} else if (userAcc !== null) {
  console.log("User is already logged In, did not required Login again");
  if (userAcc.acc_type === "blogger") {
    alert(
      "User logged in Successfully!\nYou are redirected to Dashboard"
    );
    console.log("User Data ACCType", userAcc);
    window.location.href = "./dashboard.html";
  } else {
    window.location.href = "../blogview.html";
    alert(
      "You are Guest User,\n You can read Blogs"
    );
    // alert("Invalid Credential!");
  }
} else {
  window.location.href = "../blogview.html";
  alert(
    "You are Guest User,\n You can read Blogs"
  );
}
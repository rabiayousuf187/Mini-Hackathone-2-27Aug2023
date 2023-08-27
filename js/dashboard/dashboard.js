import { isAuth, logout } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "blogger") {
  
  console.log("Dashboard Page")
  document.getElementById("Top").style.display = "block";
  document.getElementById("adminname").innerText = userAcc.firstname + " "+ userAcc.lastname;
  
  let userId = userAcc.id;
  let username = `${userAcc.firstname} ${userAcc.lastname} `;
  console.log("userAcc Id", userId);
  // Use the Firebase Configuration functions
  const {
    database,
    ref,
    set,
    get,
    storage,
    storageRef,
    uploadBytes,
    getDownloadURL,
  } = firebaseExports;
  const showElement = (elementId, display = "block") => {
    document.getElementById(elementId).style.display = display;
  };

  // Check if the page has been loaded before
  const isFirstLoad = JSON.parse(localStorage.getItem("isUserFirstLoad"));
  //

  let showItem = (
    container,
    ind,
    category,
    name,
    weight,
    price,
    imageURL,
    description,
    disabled
  ) => {
    category = capitalizeWords(category);
    let link = replaceSpacesWithHyphens(category);
    const itemHTML = `<div class="row">
    <div class="title">
        <div class="blog-details">
            <div class="blogger-img">
                <img src="../../img/placeholder.png"/>
            </div>
            <div class="blog-title">
                <h3 id="blog-title">Title 01kjdflkjf</h3>
                <div class="user-details">
                    <p id="username">Uer Name - </p> 
                    <p id="date">Uer Name - </p> 
                </div>
            </div>
        </div>
        <div class="blog-content">
            <p id="blog-content">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo, porro ea, sint omnis et dolore est quam quaerat, aut commodi beatae. Asperiores assumenda earum illum facilis totam harum magni saepe. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi qui harum aspernatur alias dolores quas vel praesentium sed saepe ad eaque unde voluptatibus officia possimus id, a inventore amet beatae!
            </p>
        </div>
    </div>
</div>`;

    container.insertAdjacentHTML("beforeend", itemHTML);

    // container.addEventListener("click", function (event) {
    //   let link;
    //   console.log(
    //     "Button pressed",
    //     event,
    //     event.target.querySelector("i"),
    //     event.target.tagName
    //   );
    //   if (
    //     event.target.tagName === "BUTTON" &&
    //     event.target.getAttribute("disabled") === false
    //   ) {
    //     link = event.target.getAttribute("id");
    //     console.log(
    //       "Show Items of ====",
    //       link,
    //       event.target.getAttribute("disabled")
    //     );
    //     console.log("Button selected");
    //   } else if (
    //     event.target.tagName === "I" &&
    //     event.target.closest("BUTTON").getAttribute("disabled") === false
    //   ) {
    //     console.log("Icon selected");
    //     link = event.target.closest("BUTTON").getAttribute("id");
    //   } else {
    //     console.log("not a target element");
    //   }

    //   addCart(selectedCategory, link);
    // });
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
          itemsData.forEach((ele, ind) => {
          showItem = (
            container,
            ind, username, 
            ele.date,
            ele.blogtitle,
            ele.blogcontent,
          )
          }
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
      
      console.log("Blog Date Append  == ",dateString)
      console.log("User Id ==== ", userId);
          writeUserData(userId, blogtitle,blogcontent, dateString)
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

  let writeUserData = (userId, blogtitle,blogcontent, date) => {
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
  }  else {
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
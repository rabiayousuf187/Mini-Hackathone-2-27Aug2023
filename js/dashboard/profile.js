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

  let userPrevData;
  // Check if the page has been loaded before
  const isFirstLoad = JSON.parse(localStorage.getItem("isUserFirstLoad"));
  //
  window.addEventListener("load", () => {
    // ref(database, 'blogs/' + userId + `/${blogtitle}`)
    getAllItemData(`users/${userId}/`)
      .then((userData) => {
        if (!userData) {
          console.log("Data is null");
        } else {
            userPrevData = userData;
          // Here you can continue with rendering your data or performing other tasks
          console.log("updated into Array ====:", userPrevData);

          localStorage.setItem(
                "userAcc",
                JSON.stringify(userData)
              );
        }
        // Process the retrieved data
      })
      .catch((error) => {
        console.error("Error fetching UserData:", error);
      });
  });
  let capitalizeWords = (str) => {
    return str.replace(/\b\w/g, function (match) {
      return match.toUpperCase();
    });
  };


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

  const uploadimg = document.getElementById("uploadimg");
  const uploadname = document.getElementById("uploadname");
  const updatepass = document.getElementById("updatepass");


  // Function to display error message for an input field
  let showError = (inputElement, errorMessage) => {
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
  let clearError = (inputElement) => {
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
    //   itemsData = Object.values(itemsData);
      return itemsData;
    } catch (error) {
      console.error("Error getting data:", error);
      alert(error);
      return false;
    }
  };

  let saveImg = (file, userId) => {
    return new Promise((resolve, reject) => {
      const imageRef = storageRef(
        storage,
        `images/users/${userId}/${file.name}`
      );

      uploadBytes(imageRef, file)
        .then((snapshot) => {
          console.log("Image uploaded successfully");

          // Get the download URL
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("File available at", downloadURL);
          resolve(downloadURL); // Resolve the promise with the download URL
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          reject(error); // Reject the promise with the error
        });
    });
  };
  // Function to validate the form on submission
  // Function to validate the form on submission
  let validateForm = (event) => {
    event.preventDefault();

    const firstname = document.getElementById("firstname").value;
    let fileimg = document.getElementById("fileimg").files[0];
    const lastname = document.getElementById("lastname").value;
    const password = document.getElementById("password").value;
    const repassword = document.getElementById("repassword").value;
    let acc_type  = "blogger", userAcc;
    // let acc_type = document.querySelector('input[name="acc_type"]:checked');

    console.log("firstname = ", firstname);
    console.log("lastname = ", lastname);
    console.log("password = ", password);
    console.log("repassword = ", repassword);

        // File Img Valid
        if (fileimg) {
            // Validate image type
            if (!fileimg.type.startsWith("image/")) {
              console.log("Please select a valid image fileimg.");
              // alert("Please select a valid image fileimg.");
              return;
            }
      
            // Validate image size (in bytes)
            const maxSize = 5 * 1024 * 1024; // 5 MB
            if (fileimg.size > maxSize) {
              console.log(
                "Selected image is too large. Please choose a smaller image."
              );
              // alert("Selected image is too large. Please choose a smaller image.");
              return;
            }
      
            // Now you can proceed with uploading the image or other actions
            console.log("Image is valid:", fileimg.name, fileimg.type, fileimg.size);
            // Your upload logic here
            clearError(document.getElementById("fileimg"));
          } else {
            // alert("Please select an image file.");
            console.log("Please select an image file.");
            showError(document.getElementById("fileimg"), "Image File is required.");
          }
      
    // Validate firstname
    if (firstname.trim() === "") {
      showError(document.getElementById("firstname"), "firstname is required.");
    } else if (!nameRegex.test(firstname.trim())) {
      console.log("Invalid: Contains only letters and spaces.");
      showError(document.getElementById("firstname"), "Invalid: Contains only letters and spaces.");
    } else {
      console.log("Valid: Contains only letters and spaces.");
      clearError(document.getElementById("firstname"));
    } 
       // Validate firstname
    if (lastname.trim() === "") {
      showError(document.getElementById("lastname"), "lastname is required.");
    } else if (!nameRegex.test(lastname.trim())) {
      console.log("Invalid: Contains only letters and spaces.");
      showError(document.getElementById("lastname"), "Invalid: Contains only letters and spaces.");
    } else {
      console.log("Valid: Contains only letters and spaces.");
      clearError(document.getElementById("lastname"));
    }
     if (repassword.trim() === "" ) {
      showError(document.getElementById("repassword"), "repassword is required.");
    } else if (!passwordRegex.test(repassword.trim())) {
      console.log("Invalid: Password");
      showError(document.getElementById("repassword"), "Invalid: rePassword.");
    }else if ( password != repassword) {
      console.log("RePassword is not match");
      console.log("RePassword ==", repassword);
      console.log("Password ==", password);
      showError(document.getElementById("repassword"), "Invalid: rePassword.");
    } else {
      console.log("Valid:  Password");
      clearError(document.getElementById("repassword"));
    }
 

    // Validate password
    if (password.trim() === "") {
      showError(document.getElementById("password"), "Password is required.");
    } else if (!passwordRegex.test(password)) {
      showError(
        document.getElementById("password"),
        "Password must be at least 8 characters long and contain at least one letter and one number."
      );
    } else {
      clearError(document.getElementById("password"));
    }

 
    // if (username.includes("admin")) {
    //   console.log("Substring found!");
    //   acc_type = "admin";
    // } else {
    //   acc_type = "user";
    // }

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
        !fileimg ||
        !firstname ||
        !lastname ||
        !password ||
        !repassword
      ) {
        alert("Refill Form for all Feilds\nSome Feilds are undefined.");
        console.log("Refill Form for all Feilds\nSome Feilds are undefined.");
      } else {
      // Submit the form or do any other required action here
      console.log("Form submitted successfully!");
      // Call the function to create a user with Firebase Authentication
      saveImg(fileimg, itemname, selectedCategory)
      .then((downloadURL) => {
        console.log("GET downloadURL === , ", downloadURL);
        if (downloadURL) {
          console.log(
            "Data before write === ",
            downloadURL,
                     );
          console.log("User Role", acc_type);
          console.log("User Created", user);
          writeUserData(userId, downloadURL, firstname, lastname, password, acc_type)
            .then(() => {
              userAcc = {
                userId: user.uid,
                firstname: firstname,
                lastname: lastname,
                acc_type: acc_type,
                blogimg: downloadURL,

              };
              localStorage.setItem("userAcc", JSON.stringify(userAcc));
              document.getElementById("itemname").value = "";
              document.getElementById("itemcategory").value =
                "Select Category";
              document.getElementById("itemcontent").value = "";
              document.getElementById("unitname").value = "";
              document.getElementById("unitprice").value = "";
              document.getElementById("fileimg").value = null; // Clear file input

              window.location.href = `./dashboard.html`;
              
            })
            .catch((error) => {
              console.error("Error writing user data:", error);
            });
            
        } else {
          console.log("No DownloadURL RX.");
        }
      })
      .catch((error) => {
        // Handle any errors that may occur during the data retrieval
        console.error("Error:", error);
      });
          
        
      }
    }
  }


  // Attach form validation function to the form's submit event
  signupForm.addEventListener("submit", validateForm);

  let writeUserData = (userId, blogimg, firstname, lastname, password, acc_type) => {
    return new Promise((resolve, reject) => {
        const userRef = ref(database, 'users/' + userId);

        set(userRef, {
            userId: userId,
            blogimg: blogimg,
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            acc_type: acc_type
        })
        .then(() => {
          console.log("Blog User Data Updated to Firebase Database.");
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
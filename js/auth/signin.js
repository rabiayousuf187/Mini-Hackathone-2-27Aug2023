// import { isAuth } from "./auth.js";
import firebaseExports from "../config/firebase-config.js";
console.log(localStorage.getItem("userAcc"));
let userAcc = localStorage.getItem("userAcc");

let localStExpCase = () => {
  localStorage.removeItem("userAcc");
};

userAcc === null || userAcc === undefined
  ? localStExpCase()
  : (userAcc = JSON.parse(userAcc));

if (userAcc === null || userAcc === undefined) {
  console.log("Signin Page");
  document.getElementById("Top").style.display = "block";

  // Use the Firebase Configuration functions
  const { auth, signInWithEmailAndPassword, database, ref, get } =
    firebaseExports;

  let userid;
  let userData;
  // let acc_type;
  let userAcc;
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  console.log("import firebaseConfig === ");

  const signinForm = document.getElementById("signin-form");

  // Regular expressions for validation
  // Email Regex: It should not start or end with whitespace.
  // It should have one "@" symbol in the middle.
  // It should have at least one character before and after the "@" symbol.
  // It should have at least one character after the last "." symbol.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  async function getDataByUserId(userId) {
    try {
      const snapshot = await get(ref(database, "users/" + userId));
      // Data snapshot contains the data at the specified location
      userData = snapshot.val();
      return userData;
    } catch (error) {
      console.error("Error getting data:", error);
      return false;
    }
  }

  // Get Category Data for admin
  let getAllItemData = async () => {
    try {
      const snapshot = await get(ref(database, `categories/`));
      // Data snapshot contains the data at the specified location
      let itemsData = snapshot.val();
      console.log("Retrieved data:", itemsData);
      itemsData = Object.values(itemsData);
      return itemsData;
    } catch (error) {
      console.error("Error getting data:", error);
      return false;
    }
  };

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

  // Function to validate the form on submission
  function validateForm(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // acc_type = document.querySelector('input[name="acc_type"]:checked');

    console.log("email = ", email);
    console.log("password = ", password);

    // Validate emailconsole.log("Email Value on change ==", )
    if (email.trim() === "") {
      showError(document.getElementById("email"), "Email is required.");
    } else if (!emailRegex.test(email.trim())) {
      showError(document.getElementById("email"), "Invalid email format.");
    } else {
      clearError(document.getElementById("email"));
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

    console.log(
      "!document.querySelector.error ==== ",
      document.querySelector("#signup-form")
    );
    if (!document.querySelector(".error")) {
      // Submit the form or do any other required action here
      console.log("Form submitted successfully!");
      // Call the function to create a user with Firebase Authentication
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("User logged in Successfully!", user);
          userid = user.uid;
          // localStorage.setItem("userid",userid);
          getDataByUserId(userid)
            .then((userData) => {
              console.log("GET userData === , ", userData);
              if (userData) {
                userAcc = {
                  id: userid,
                  fullname: userData.fullname,
                  acc_type: userData.acc_type,
                };
                // Data exists for the user ID
                console.log("User Data", userData);
                console.log("User Data ACCType", userData.acc_type);
                getAllItemData().then((category) => {
                  console.log("Retrieved data:", category);
                  localStorage.setItem(
                    "category",
                    JSON.stringify(Object.values(category))
                  );
                  
                });
                if (userData.acc_type === "user") {
                  alert(
                    "User logged in Successfully!\nYou are redirected to User Purchase Corner"
                  );
                  console.log("User Data ACCType", userAcc);
                  localStorage.setItem("userAcc", JSON.stringify(userAcc));
                  localStorage.setItem("isUserFirstLoad", "true");
                  console.log(
                    "Category Data successfully Stored in local Storage"
                  );
                  window.location.href = "../purchase/purchase.html";
                } else if (userData.acc_type === "admin") {
                  console.log("User Data ACCType", userAcc);
                  localStorage.setItem("userAcc", JSON.stringify(userAcc));
                  localStorage.setItem("isAdminFirstLoad", "true");
                  console.log(
                    "Category Data successfully Stored in local Storage"
                  );
                  window.location.href = "../admin/admin.html";
                  alert(
                    "User logged in Successfully!\nYou are redirected to Admin Corner"
                  );
                } else {
                  alert("Invalid Credential!");
                }
              } else {
                alert("Invalid Credential!");
              }
            })
            .catch((error) => {
              // Handle any errors that may occur during the data retrieval
              console.error("Error:", error);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage, errorCode);
        });
    }
  }

  // Attach form validation function to the form's submit event
  signinForm.addEventListener("submit", validateForm);

  const registerLink = document.getElementById("registerLink");

  registerLink.addEventListener("click", () => {
    // Replace 'target_page.html' with the path of the page you want to open
    window.location.href = "./signup.html";
  });
} else if (userAcc !== null) {
  console.log("User is already logged In, did not required Login again");
  if (userAcc.acc_type === "user") {
    alert(
      "User logged in Successfully!\nYou are redirected to User Purchase Corner"
    );
    console.log("User Data ACCType", userAcc);
    window.location.href = "../purchase/purchase.html";
  } else if (userAcc.acc_type === "admin") {
    console.log("User Data ACCType", userAcc);
    window.location.href = "../admin/admin.html";
    alert(
      "User is already logged In, did not required Login again\nYou are redirected to Admin Corner"
    );
  } else {
    alert("Invalid Credential!");
  }
} else {
  console.log("Unauth User Access!");
  alert("Unauth User Access!");
}

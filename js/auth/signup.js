import firebaseExports from "../config/firebase-config.js";
let userAcc = localStorage.getItem("userAcc");

let localStExpCase = () => {
  localStorage.removeItem("userAcc");
};

userAcc === null || userAcc === undefined
  ? localStExpCase()
  : (userAcc = JSON.parse(userAcc));

if (userAcc === null || userAcc === undefined) {
  console.log("Signup JS integrated");

  document.getElementById("Top").style.display = "block";
  // Use the Firebase Configuration functions
  const { auth, get, createUserWithEmailAndPassword, database, ref, set } =
    firebaseExports;

  const signupForm = document.getElementById("signup-form");

  // Regular expressions for validation
  // Email Regex: It should not start or end with whitespace.
  // It should have one "@" symbol in the middle.
  // It should have at least one character before and after the "@" symbol.
  // It should have at least one character after the last "." symbol.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  // const contactRegex = /^\d{11}$/;
  const nameRegex = /^[A-Za-z\s]+$/;

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
        alert(error);
        return false;
      }
    };

  // Function to validate the form on submission
  function validateForm(event) {
    event.preventDefault();

    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const repassword = document.getElementById("repassword").value;
    let acc_type  = "blogger", userAcc;
    // let acc_type = document.querySelector('input[name="acc_type"]:checked');

    console.log("firstname = ", firstname);
    console.log("lastname = ", lastname);
    console.log("email = ", email);
    console.log("password = ", password);
    console.log("repassword = ", repassword);

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
        !firstname ||
        !lastname ||
        !email ||
        !password ||
        !repassword
      ) {
        alert("Refill Form for all Feilds\nSome Feilds are undefined.");
        console.log("Refill Form for all Feilds\nSome Feilds are undefined.");
      } else {
      // Submit the form or do any other required action here
      console.log("Form submitted successfully!");
      // Call the function to create a user with Firebase Authentication
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("User Role", acc_type);
          console.log("User Created", user);
          writeUserData(user.uid, firstname,lastname, email, password,  acc_type)
            .then(() => {
              userAcc = {
                userId: user.uid,
                firstname: firstname,
                lastname: lastname,
                acc_type: acc_type,
              };
              localStorage.setItem("userAcc", JSON.stringify(userAcc));

              // getAllItemData().then((category) => {
              //   console.log("Retrieved data:", category);
              //   localStorage.setItem(
              //     "category",
              //     JSON.stringify(Object.values(category))
              //   );
                
              // });
              if (acc_type === "blogger") {
                localStorage.setItem("isUserFirstLoad", "true");
                alert("You are redirected to User DashBoard Corner");
                window.location.href = "../dashboard/dashboard.html";
              // } else if (acc_type === "admin") {
              //   console.log("User Data ACCType", acc_type);
              //   localStorage.setItem("isAdminFirstLoad", "true");
              //   alert("You are redirected to Admin Corner");
              //   window.location.href = "../admin/admin.html";
              // } else {
                // alert("Invalid Credential!");
              }
            })
            .catch((error) => {
              console.error("Error writing user data:", error);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(error);
          console.log(error, error.message, error.code);
        });
      }
    }
  }

  // Attach form validation function to the form's submit event
  signupForm.addEventListener("submit", validateForm);

  let writeUserData = (userId, firstname, lastname, email, password, acc_type) => {
    return new Promise((resolve, reject) => {
        const userRef = ref(database, 'users/' + userId);

        set(userRef, {
            userId: userId,
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            acc_type: acc_type
        })
        .then(() => {
            console.log("Data saved to Firebase Database.");
            resolve(); // Resolve the promise to indicate success
        })
        .catch((error) => {
            console.error("Error saving data:", error);
            reject(error); // Reject the promise with the error
        });
    });
}

  const loginLinkbtn = document.getElementById("loginLink");

  loginLinkbtn.addEventListener("click", () => {
    // Replace 'target_page.html' with the path of the page you want to open
    window.location.href = "./signin.html";
  });

}else if (userAcc !== null) {
  console.log("User is already logged In, did not required Login again");
  if (userAcc.acc_type === "blogger") {
    alert(
      "User logged in Successfully!\nYou are redirected to Dashboard"
    );
    console.log("User Data ACCType", userAcc);
    window.location.href = "../dashboard/dashboard.html";
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
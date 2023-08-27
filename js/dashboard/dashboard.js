import { isAuth, logout } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "blogger") {

  console.log("Dashboard Page")
  document.getElementById("Top").style.display = "block";
    document.getElementById("adminname").innerText = userAcc.firstname + lastname;
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
  window.addEventListener("load", () => {
    // let getCartData = getAllItemData(`cart/${userAcc.id}/`);

    // getAllItemData(`items/fruit/`)
    //   .then((itemsData) => {
    //     if (!itemsData) {
    //       console.log("Data is null");
    //     } else {
    //       // Here you can continue with rendering your data or performing other tasks
    //       console.log("updated into Array ====:", itemsData);
    //       selectedCategory = "fruit";
    //       const container = document.getElementById("show-item-inner");
    //       getSelectedItemData(`cart/${userAcc.id}/`)
    //         .then((cartData) => {
    //           console.log(`GET CART DATA ==`, cartData);
    //           disableItem = Object.keys(cartData);

    //           console.log("CART KEY ==== ", disableItem);

    //           console.log("disableItem ==== ", disableItem);
    //           itemsData.forEach((ele, ind) => {
    //             const matchExists = disableItem.some(
    //               (item) => item.toLowerCase() === ele.itemName.toLowerCase()
    //             );

    //             if (matchExists) {
    //               console.log(`${ele.itemName} found in the itemData.`);
    //               // Call the function to add a fruit item
    //               // name, weight, price, imageURL
    //               showItem(
    //                 container,
    //                 ind,
    //                 ele.itemCategory,
    //                 ele.itemName,
    //                 ele.unitName,
    //                 ele.unitPrice,
    //                 ele.imageUrl,
    //                 ele.itemContent,
    //                 true
    //               );
    //             } else {
    //               showItem(
    //                 container,
    //                 ind,
    //                 ele.itemCategory,
    //                 ele.itemName,
    //                 ele.unitName,
    //                 ele.unitPrice,
    //                 ele.imageUrl,
    //                 ele.itemContent,
    //                 false
    //               );
    //               console.log(`${ele.itemName} not found in the array.`);
    //             }
    //             // console.log("Each Item ==== :", ele);
    //             console.log(
    //               "Each Item ==== :",
    //               ele.itemCategory,
    //               ele.itemName,
    //               ele.unitName,
    //               ele.unitPrice,
    //               ele.imageUrl
    //             );

    //             // const found = array.includes(searchString);

    //             const lazyImages = document.querySelectorAll(".lazy-image");
    //             const loadImagePromises = [];
    //             lazyImages.forEach((img) => {
    //               const promise = new Promise((resolve) => {
    //                 img.addEventListener("load", () => {
    //                   resolve();
    //                 });
    //                 img.src = img.getAttribute("data-src");
    //               });
    //               loadImagePromises.push(promise);
    //             });
    //             Promise.all(loadImagePromises)
    //               .then(() => {
    //                 console.log("All lazy-loaded images are loaded.");
    //               })
    //               .catch((error) => {
    //                 console.error("An error occurred:", error);
    //               });
    //           });

    //           const inactive = document.querySelectorAll(".cat-row");

    //           inactive.forEach((div) => {
    //             console.log("check DIv === ", div);
    //             if (div.hasAttribute("disabled")) {
    //               div.classList.add("disable");
    //               console.log("disable DIv === ", div);
    //             }
    //           });
    //         })
    //         .catch((error) => {
    //           console.error("Error Getting Cart Items Data:", error);
    //         });
    //     }
    //     // Process the retrieved data
    //   })

    //   .catch((error) => {
    //     console.error("Error fetching Items Data:", error);
    //   });
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
  // let current_page = document.querySelector('#home');
  // console.log("current_page color change", current_page);
  // current_page.querySelector("img").style.filter =
  //   "invert(62%) sepia(112%) saturate(349%) hue-rotate(61deg) brightness(56%) contrast(168%)";
  // current_page.querySelector("p").style.color = "#61B846";

  // let cart = document.getElementById("cart");
  // cart.addEventListener("click", function (event) {
  //   event.preventDefault(); // Prevent the default link behavior
  //   window.location.href = "./shop-cart.html";
  // });

  // let acc_setting = document.getElementById("acc-setting");
  // acc_setting.addEventListener("click", function (event) {
  //   event.preventDefault(); // Prevent the default link behavior
  //   window.location.href = "./account-setting.html";
  // });
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
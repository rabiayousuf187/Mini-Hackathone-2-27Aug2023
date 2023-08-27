import { isAuth, logout } from "../auth/auth.js";
import firebaseExports from "../config/firebase-config.js";
let userAcc = isAuth();
console.log("userAcc get via is Auth()", userAcc);

if (userAcc && userAcc.acc_type === "blogger") {

  // Function to add or remove a class based on media query
  let toggleClassBasedOnMediaQuery = (mediaQuery, element, className) => {
    console.log("mediaQuery === ", mediaQuery)
    const mq = window.matchMedia(mediaQuery);

    // Initial check
    if (mq.matches) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }

    // Listen for changes to the media query
    mq.addListener( (e) => {
    if (e.matches) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  });
  }

  // Example usage
  toggleClassBasedOnMediaQuery('(max-width: 565px)', document.querySelector('#prod-cat-slider'), 'uk-child-width-1-3'); // Change the media query and class name accordingly
  toggleClassBasedOnMediaQuery('(max-width: 2048px)', document.querySelector('#prod-cat-slider'), 'uk-child-width-1-4'); // Change the media query and class name accordingly

  console.log("Admin Account Setting Page");
  let userData,
    selectedCategory,
    disableItem,
    quantity = 0;

  let count_item = localStorage.getItem("quantity");
  count_item =
    count_item === null
      ? count_item === null
      : (count_item = JSON.parse(count_item));
  if (count_item === null) {
    document.getElementById("count-item").style.display = "none";
    quantity = 0;
  } else {
    document.getElementById("count-item").style.display = "block";
  }

  let count = () => {
    if (quantity > 0) {
      quantity++;
      console.log("count_item++ === ", quantity);
      document.getElementById("count-item").innerHTML = quantity;
      localStorage("count_item", JSON.stringify(quantity));
    }
  };
  document.getElementById("Top").style.display = "block";
  //   document.getElementById("adminname").innerText = userAcc.fullname;
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

    getAllItemData(`items/fruit/`)
      .then((itemsData) => {
        if (!itemsData) {
          console.log("Data is null");
        } else {
          // Here you can continue with rendering your data or performing other tasks
          console.log("updated into Array ====:", itemsData);
          selectedCategory = "fruit";
          const container = document.getElementById("show-item-inner");
          getSelectedItemData(`cart/${userAcc.id}/`)
            .then((cartData) => {
              console.log(`GET CART DATA ==`, cartData);
              disableItem = Object.keys(cartData);

              console.log("CART KEY ==== ", disableItem);

              console.log("disableItem ==== ", disableItem);
              itemsData.forEach((ele, ind) => {
                const matchExists = disableItem.some(
                  (item) => item.toLowerCase() === ele.itemName.toLowerCase()
                );

                if (matchExists) {
                  console.log(`${ele.itemName} found in the itemData.`);
                  // Call the function to add a fruit item
                  // name, weight, price, imageURL
                  showItem(
                    container,
                    ind,
                    ele.itemCategory,
                    ele.itemName,
                    ele.unitName,
                    ele.unitPrice,
                    ele.imageUrl,
                    ele.itemContent,
                    true
                  );
                } else {
                  showItem(
                    container,
                    ind,
                    ele.itemCategory,
                    ele.itemName,
                    ele.unitName,
                    ele.unitPrice,
                    ele.imageUrl,
                    ele.itemContent,
                    false
                  );
                  console.log(`${ele.itemName} not found in the array.`);
                }
                // console.log("Each Item ==== :", ele);
                console.log(
                  "Each Item ==== :",
                  ele.itemCategory,
                  ele.itemName,
                  ele.unitName,
                  ele.unitPrice,
                  ele.imageUrl
                );

                // const found = array.includes(searchString);

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

              const inactive = document.querySelectorAll(".cat-row");

              inactive.forEach((div) => {
                console.log("check DIv === ", div);
                if (div.hasAttribute("disabled")) {
                  div.classList.add("disable");
                  console.log("disable DIv === ", div);
                }
              });
            })
            .catch((error) => {
              console.error("Error Getting Cart Items Data:", error);
            });
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

  let getAllItemData = async (url) => {
    try {
      let snapshot = await get(ref(database, url));
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

  let writeItemData = (
    userId,
    itemName,
    itemCategory,
    itemContent,
    unitName,
    unitPrice,
    imageUrl,
    url
  ) => {
    return new Promise((resolve, reject) => {
      // Create a reference to the Firebase Realtime Database
      // Push data to the database
      set(ref(database, url), {
        itemName: itemName,
        itemCategory: itemCategory,
        itemContent: itemContent,
        unitName: unitName,
        unitPrice: unitPrice,
        imageUrl: imageUrl, // Store the image URL here
      })
        .then(() => {
          // alert("Item ", itemName, "added to cart")
          console.log("Item Added to  Cart Database. with Img");
          resolve(); // Resolve the promise to indicate success
        })
        .catch((error) => {
          console.error("Error saving data:", error);
          reject(error); // Reject the promise with the error
        });
    });
  };

  let addCart = (category, link) => {
    console.log(`Selected Category ${category}, Item ${link} saved into cart`);

    getSelectedItemData(`items/${category}/${link}/`)
      .then((itemsData) => {
        if (!itemsData) {
          console.log("Data is null");
        } else {
          // Here you can continue with rendering your data or performing other tasks

          const {
            itemName,
            itemCategory,
            itemContent,
            unitName,
            unitPrice,
            imageUrl,
          } = itemsData;

          console.log(
            "get selected Item Data ====:",
            itemName,
            itemCategory,
            itemContent,
            unitName,
            unitPrice,
            imageUrl
          );
          // console.log("get selected Item Data ====:", itemsData);

          writeItemData(
            userAcc.id,
            itemName,
            itemCategory,
            itemContent,
            unitName,
            unitPrice,
            imageUrl,
            `cart/${userAcc.id}/${itemName}/`
          )
            .then(() => {
              count();
              document
                .getElementById(`cat-${category}-${link}`)
                .classList.add("disable");
              document
                .getElementById(`cat-${category}-${link}`)
                .setAttribute("disabled", true);
            })
            .catch((error) => {
              console.error("Error Adding Item data:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error getting Item data:", error);
      });
  };
  let replaceSpacesWithHyphens = (text) => {
    // Replace spaces with hyphens using regular expression
    text = text.trim().toLowerCase();
    return text.replace(/\s+/g, "-");
  };
  let capitalizeWords = (str) => {
    return str.replace(/\b\w/g, function (match) {
      return match.toUpperCase();
    });
  };

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
    const itemHTML = `
    <div id="cat-${link}-${name}" class="cat-row ${disableItem === true ? "disable" : ""
      }"  disabled = ${disabled}>
                            <div class="col-12 cat-item">
                                <div class="sub-cat-title">
                                    <img src="../../img/icons/placeholder.png" alt="${category}" data-src="${imageURL}" class="lazy-image"/>
                                    <div id="sub-cat-details-${ind}" class="sub-cat-details">
                                        <p class="sub-cat-name" style="font-size: x-large;
                                        font-weight: 600;">${name}</p>
                                        <p class="sub-cat-name">${description}</p>
                                    </div>
                                    <div class="item-weight-price">
                                      <div class="amount">
                                        <p id="sub-cat-price-${ind}" class="sub-cat-price">Rs.<span id='price'>${price}</span></p>
                                        
                                        <p id="sub-cat-weight-${ind}" class="sub-cat-price">- Per <span id='price'>${weight}</span></p>
                                        </div>
                                        <button class="col-2 btn btn-get-started cat-inp" id="${name}" disabled = ${disabled}><i class="bi bi-plus-lg"></i></button>
                                    </div>
                                    </div>
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
        event.target.tagName === "BUTTON" &&
        event.target.getAttribute("disabled") === false
      ) {
        link = event.target.getAttribute("id");
        console.log(
          "Show Items of ====",
          link,
          event.target.getAttribute("disabled")
        );
        console.log("Button selected");
      } else if (
        event.target.tagName === "I" &&
        event.target.closest("BUTTON").getAttribute("disabled") === false
      ) {
        console.log("Icon selected");
        link = event.target.closest("BUTTON").getAttribute("id");
      } else {
        console.log("not a target element");
      }

      addCart(selectedCategory, link);
    });
  };

  function handleButtonClick(category) {
    console.log("Switch category ====", category); // This will log the value of the clicked category
    // if (is)
    getAllItemData(`items/${category}/`)
      .then((itemsData) => {
        if (!itemsData) {
          console.log("Data is null");
        } else {
          getSelectedItemData(`cart/${userAcc.id}/`)
            .then((cartData) => {
              // Here you can continue with rendering your data or performing other tasks
              console.log("updated into Array ====:", itemsData);
              selectedCategory = "category";
              const container = document.getElementById("show-item-inner");
              disableItem = Object.keys(cartData);

              console.log("CART KEY ==== ", disableItem);

              console.log("disableItem ==== ", disableItem);
              itemsData.forEach((ele, ind) => {
                const matchExists = disableItem.some(
                  (item) => item.toLowerCase() === ele.itemName.toLowerCase()
                );

                if (matchExists) {
                  console.log(`${ele.itemName} found in the itemData.`);
                  // Call the function to add a fruit item
                  // name, weight, price, imageURL
                  showItem(
                    container,
                    ind,
                    ele.itemCategory,
                    ele.itemName,
                    ele.unitName,
                    ele.unitPrice,
                    ele.imageUrl,
                    ele.itemContent,
                    true
                  );
                } else {
                  showItem(
                    container,
                    ind,
                    ele.itemCategory,
                    ele.itemName,
                    ele.unitName,
                    ele.unitPrice,
                    ele.imageUrl,
                    ele.itemContent,
                    false
                  );
                  console.log(`${ele.itemName} not found in the array.`);
                }
                // console.log("Each Item ==== :", ele);
                console.log(
                  "Each Item ==== :",
                  ele.itemCategory,
                  ele.itemName,
                  ele.unitName,
                  ele.unitPrice,
                  ele.imageUrl
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
            })
            .catch((error) => {
              console.error("Error Get Cart Items Data:", error);
            });
        }

        // Process the retrieved data
      })

      .catch((error) => {
        console.error("Error fetching Items Data:", error);
      });
  }

  const container = document.getElementById("prod-cat-slider");
  let addElement = (ind, category, imageURL) => {
    let link = replaceSpacesWithHyphens(category);
    category = capitalizeWords(category);
    const itemHTML = `
        <li ><button role="button" href="#" id=${link} style="border:none;">
            <div class="uk-panel uk-card-default col-div" >
            <div class="img-div">
                <img id=${link} class="lazy-image" src="../../img/icon/placeholder.png" alt="${category}" data-src="${imageURL}" width="400" height="600" alt="">
                
                </div>
                <div class="uk-card-body">
                    <h3 class="uk-card-title">${category}</h3>
                </div>
            </div>
            </button>
        </li>`;

    container.insertAdjacentHTML("afterbegin", itemHTML);
  };
  container.addEventListener("click", function (event) {
    console.log(
      "Button pressed",
      event,
      event.target.tagName,
      event.target.getAttribute("id")
    );
    if (event.target.tagName === "IMG") {
      const link = event.target.getAttribute("id");
      selectedCategory = link;
      console.log("Show Items of ====", link);
      handleButtonClick(link);
    }
  });
  const itemsData = JSON.parse(localStorage.getItem("category"));
  itemsData.forEach((ele, ind) => {
    console.log("Each Item ==== :", ele);
    console.log("Each Item ==== :", ele.categoryName, ele.imageUrl);

    // Call the function to add a fruit item
    // name, weight, price, imageURL
    addElement(ind, ele.categoryName, ele.imageUrl);

    // if(!isFirstLoad) {
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
        setTimeout(() => {
          console.log("Page Completely Loaded");
        }, 3000);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  });

  let current_page = document.querySelector('#home');
  console.log("current_page color change", current_page);
  current_page.querySelector("img").style.filter =
    "invert(62%) sepia(112%) saturate(349%) hue-rotate(61deg) brightness(56%) contrast(168%)";
  current_page.querySelector("p").style.color = "#61B846";

  let cart = document.getElementById("cart");
  cart.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = "./shop-cart.html";
  });

  let acc_setting = document.getElementById("acc-setting");
  acc_setting.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior
    window.location.href = "./account-setting.html";
  });
} else if (
  (userAcc && userAcc.acc_type === "user") ||
  userAcc === null ||
  userAcc === undefined
) {
  console.log("User is Auth but role is not Admin");
  window.location.href = "../auth/signin.html";
} else {
  console.log("Unauth User Access!");
  window.location.href = "../auth/signin.html";
}

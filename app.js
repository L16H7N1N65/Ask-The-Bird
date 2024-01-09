let appLaunched = false;
let menuListVisible = false;

function toggleMenu() {
  const menuList = document.querySelector(".menu-list");
  menuList.style.display = menuListVisible ? "none" : "flex";
  menuListVisible = !menuListVisible;
}

function toggleMute() {
  console.log('coucou');
  
  let video = document.getElementById("backgroundVideo");

  console.log(video.muted);

  video.muted = !video.muted;
  let muteBtn = document.querySelector(".menu-list a[title='Mute']");
  console.log(muteBtn);
  muteBtn.innerHTML = video.muted ? "Unmute" : "Mute";
}

function launchApp() {
  console.log("App launched!");
  appLaunched = true;

  // localStorage.setItem("bgColor", "white");
  // console.log(localStorage);

  // Redirect to the result page
  window.location.href = "result_page.html";
}

// Validate EAN-13 code
function isValidEAN(ean) {
  return /^\d{13}$/.test(ean);
}

// Move isBrandUnsafe function outside of getProductInfo
function isBrandUnsafe(brand) {
  return unsafeBrands.includes(brand.toLowerCase());
}

// Fetch and display product information
function getProductInfo() {
  // Get elements from the DOM
  let eanInput = document.getElementById("eanInput");
  let productInfoContainer = document.getElementById("productInfo");

  // Trim and get the EAN code from the input field
  let ean = eanInput.value.trim();
  // Validate the EAN code
  if (!isValidEAN(ean)) {
    alert("The EAN-13 code is invalid. Please enter 13 digits.");
    return;
  }
  // Construct the API URL
  let apiUrl = "https://fr.openfoodfacts.org/api/v0/product/" + ean;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (appLaunched) {
        // Only show "Enter your code" message if the app is launched
        document.getElementById("productInfo").classList.remove("hidden");
      }
      displayProductInfo(data);
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Function to display product information
function displayProductInfo(data) {
  let productInfoContainer = document.getElementById("productInfo");

  // Create HTML content to display product information
  // Add country and red flag for another project
  // also might be interesting to search for specifics allergens, for example

  let html =
    "<h2>" +
    data.product.product_name +
    "</h2>" +
    "<p><strong>Marque:</strong> " +
    data.product.brands +
    "</p>" +
    '<img src="' +
    data.product.image_url +
    '" alt="Product Image">' +
    "<p><strong>Catégorie:</strong> " +
    data.product.categories +
    "</p>" +
    "<p><strong>Ingrédients:</strong> " +
    data.product.ingredients_text +
    "</p>" +
    "<p><strong>Allergènes:</strong> " +
    data.product.allergens_tags +
    "</p>" +
    "<p><strong>Pays d'origine:</strong> " +
    (data.product.countries_tags || "N/A") +
    "</p>" +
    "<p><strong>Information de packaging:</strong> " +
    data.product.packaging +
    "</p>";

  // Set the HTML content to the product info container
  productInfoContainer.innerHTML = html;

  // Check if the product is unsafe and display the boycott result
  const isUnsafeBrand = isBrandUnsafe(data.product.brands);
  displayBoycottResult(isUnsafeBrand, data.product.brands);
}

function launchBoycott() {
  console.log("Boycott launched!");
  appLaunched = true;

  // Redirect to the boycott page
  window.location.href = "boycott.html";
}

// Personnel project to be finished
// Array of unsafe brands
const unsafeBrands = [
  "coca-cola",
  "starbucks",
  "carhartt",
  "caribbean airlines",
  "caribou coffee",
  "carl's jr.",
  "carlyle",
  "carolina hurricanes",
  "carolina panthers",
  "carrefour",
];

function searchByBrand() {
  // Get the brand input value
  const brandInput = document.getElementById("brandInput");
  const brandQuery = brandInput.value.trim().toLowerCase();

  // Perform the search only if a brand query is provided
  if (brandQuery) {
    // Check if the entered brand is not safe
    const isUnsafeBrand = isBrandUnsafe(brandQuery);
    // Display the result in the boycott popup
    displayBoycottResult(isUnsafeBrand, brandQuery);
  } else {
    // Handle the case where no brand query is provided
    console.log("Please enter a brand name to search.");
  }
}

function closeBoycottPopup() {
  // Close the boycott popup
  const boycottPopup = document.getElementById("boycottPopup");
  boycottPopup.style.display = "none";
}

function displayBoycottResult(isUnsafeBrand, brandName) {
  // Show the boycott popup
  const boycottPopup = document.getElementById("boycottPopup");

  if (boycottPopup) {
    console.log("Boycott popup found.");

    boycottPopup.style.display = "block";

    // Set the background color based on whether the product is safe or not
    boycottPopup.style.backgroundColor = isUnsafeBrand ? "rgba(255, 0, 0, 0.9)" : "rgba(0, 255, 0, 0.9)";

    // Get the popup body content
    const popupBodyContent = document.getElementById("popupBodyContent");

    if (popupBodyContent) {
      console.log("Popup body content found.");

      if (isUnsafeBrand) {
        // Product is not good
        popupBodyContent.innerHTML = `
            <p>This product is not considered safe.</p>
            <p>هذا المنتج لا يعتبر آمناً.</p>
            <p>Brand: ${brandName}</p>`;
      } else {
        // Product is good
        popupBodyContent.innerHTML = `
            <p>This product is good for now.</p>
            <p>هذا المنتج جيد حاليًا.</p>
            <p>Brand: ${brandName}</p>`;
      }
    } else {
      console.error("Popup body content element not found in the DOM.");
    }
  } else {
    console.error("Boycott popup element not found in the DOM.");
  }
}

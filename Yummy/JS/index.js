// ----------------------------------------------------
// JQUERY
// ------------------------------------------------------
// side-Nav
// --------
$(document).ready(() => {
  searchByName("").then(() => {
    $(".loading-screen").fadeOut(500);
    $("body").css("overflow", "visible");
  });
});
function closeNav() {
  let navWidth = $(".side-navBar .nav-content ").outerWidth();

  $(".side-navBar").animate({ left: -navWidth }, 500);
  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");

  $(".nav-links li").animate({ top: 400 }, 500);
}
closeNav();

function openNav() {
  $(".side-navBar").animate({ left: 0 }, 500);

  $(".open-close-icon").removeClass("fa-align-justify");
  $(".open-close-icon").addClass("fa-x");

  $(".nav-links li").eq(0).animate({ top: 0 }, 500);
  $(".nav-links li").eq(1).animate({ top: 0 }, 600);
  $(".nav-links li").eq(2).animate({ top: 0 }, 700);
  $(".nav-links li").eq(3).animate({ top: 0 }, 800);
  $(".nav-links li").eq(4).animate({ top: 0 }, 900);
}
$(".side-navBar .nav-control .control-icon").click(() => {
  if ($(".side-navBar").css("left") == "0px") {
    //opened
    closeNav();
  } else {
    openNav();
  }
});
// -------------------------------------------------

let dataBody = document.getElementById("dataBody");
let searchBody = document.getElementById("searchBody");
let nameAlert, emailAlert, phoneAlert, ageAlert, passwordAlert, repasswordAlert;
let allData = [];
let submitBtn;

// -----------------------------------------
// Search by NAME meals
// https://www.themealdb.com/api/json/v1/1/search.php?s=
// -----------------------------------------------------
async function searchByName(name) {
  closeNav();
  dataBody.innerHTML = "";
  $(".main-loading-screen").fadeIn(300);
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;
  const apiResponse = await fetch(url);
  const apiJson = await apiResponse.json();
  allData = apiJson.meals;
  // console.log(allData);
  displayMeals();
  $(".main-loading-screen").fadeOut(300);
}
searchByName(" ");

async function searchByFLetter(letter) {
  dataBody.innerHTML = "";
  $(".main-loading-screen").fadeIn(300);
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`;
  let fetchApi = await fetch(url);
  let apiResponse = await fetchApi.json();
  allData = apiResponse.meals;
  displayMeals();
  $(".main-loading-screen").fadeOut(300);
}

function displaySearch() {
  dataBody.innerHTML = "";
  let content = `

            <div class="col-md-5 ">
            <input
              type="text"
              class="form-control"
              placeholder="Search By Name"
              onkeyup="searchByName(this.value)"
            />
          </div>
          <div class="col-md-5 ">
            <input
              type="text"
              class="form-control"
              placeholder="Search By First Letter"
              onkeyup="searchByFLetter(this.value)"
              maxlength="1"
            />
          </div>
  
  `;
  searchBody.innerHTML = content;
}

function displayMealDetails(meal) {
  let ingredient = ``;
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`] && meal[`strMeasure${i}`]) {
      // ingredient.push(meal[`strIngredient${i}`]);
      ingredient += `
                  <li class="alert alert-info m-2 p-1">
                  ${meal[`strMeasure${i}`]}
                   ${meal[`strIngredient${i}`]}
                   </li>

      `;
    }
  }

  // console.log(ingredient);

  let tags = ``;
  let tag = meal.strTags?.split(",");
  if (!tag) {
    //not null or undefind
    tag = [];
  }
  for (let i = 0; i < tag.length; i++) {
    tags += ` <li class="alert alert-danger m-2 p-1">
    ${tag[i]}
    
     </li>`;

    // console.log(tags[i]);
  }
  let content = `
           <div class="col-md-4">
          <img
            src="${meal.strMealThumb}"
            alt=""
            class="w-100 rounded-2 mb-2"
          />
          <h4 class="text-light">${meal.strMeal}</h4>
        </div>
        <div class="col-md-8 text-light">
          <h3>Instructions</h3>
          <p>
            ${meal.strInstructions}
          </p>
          <h3><span class="fw-bolder">Area :</span> ${meal.strArea}</h3>
          <h3><span class="fw-bolder">Category :</span> ${meal.strCategory}</h3>


          <h3>Recipes :</h3>
          <ul class="recipes d-flex flex-wrap m-3">
             ${ingredient}         
          </ul>


          <h3>Tags :</h3>
          <ul class="d-flex flex-wrap m-3" >
          ${tags}
          </ul >


          <a href="${meal.strSource}" class="btn btn-success">Source</a>
          <a href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>

    `;
  dataBody.innerHTML = content;
}

// ------------------------
// fetch and display all meal categories and category meals
// -----------------------

async function fetchCategories() {
  dataBody.innerHTML = "";

  $(".main-loading-screen").fadeIn(300);
  searchBody.innerHTML = "";

  const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
  let apiResponse = await fetch(url);
  let apiJson = await apiResponse.json();
  allData = apiJson.categories;
  // console.log(allData);
  displayCategories();
  closeNav();
  $(".main-loading-screen").fadeOut(500);
}
function displayCategories() {
  let content = ``;
  for (let i = 0; i < allData.length; i++) {
    let categoryCaption = allData[i].strCategoryDescription;
    let SplicedCaption = categoryCaption.split(" ").splice(0, 20).join(" ");
    content += `
          <div class="col-md-3">
            <div onclick='fetchCategoryMeals("${allData[i].strCategory}")' class="category position-relative overflow-hidden rounded-2">
              <img
                src="${allData[i].strCategoryThumb}"
                alt="Category"
                class="w-100"
              />
              <div class="categoryLayer text-center position-absolute py-2">
                <h4>${allData[i].strCategory}</h4>
                <p>
                  ${SplicedCaption}
                </p>
              </div>
            </div>
          </div>

        `;
  }
  dataBody.innerHTML = content;
}
async function fetchCategoryMeals(category) {
  dataBody.innerHTML = "";

  $(".main-loading-screen").fadeIn(300);
  searchBody.innerHTML = "";

  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
  let fetchApi = await fetch(url);
  let apiResponse = await fetchApi.json();
  allData = apiResponse.meals;
  // console.log(allData);
  displayMeals();
  closeNav();
  $(".main-loading-screen").fadeOut(500);
}
// -----------------------------
//fetch and display all areas
// ----------------------------
async function fetchAreas() {
  dataBody.innerHTML = "";

  $(".main-loading-screen").fadeIn(300);
  searchBody.innerHTML = "";

  const url = "https://www.themealdb.com/api/json/v1/1/list.php?a=list";
  let apiResponse = await fetch(url);
  let apiJson = await apiResponse.json();
  allData = apiJson.meals;
  // console.log(allData);
  displayAreas();
  closeNav();
  $(".main-loading-screen").fadeOut(500);
}
function displayAreas() {
  content = ``;
  for (let i = 0; i < allData.length; i++) {
    content += `
          <div class="col-md-3">
            <div onclick="fetchAreaMeals('${allData[i].strArea}')" class="area text-center rounded-2 ">
              <i class="fa-solid fa-house-laptop fa-4x"></i>
              <h4>${allData[i].strArea}</h4>
            </div>
          </div>`;
  }
  dataBody.innerHTML = content;
}
async function fetchAreaMeals(area) {
  dataBody.innerHTML = "";

  $(".main-loading-screen").fadeIn(300);
  searchBody.innerHTML = "";

  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
  let fetchApi = await fetch(url);
  let apiResponse = await fetchApi.json();
  allData = apiResponse.meals;
  // console.log(allData);
  displayMeals();
  closeNav();
  $(".main-loading-screen").fadeOut(500);
}

// -------------------------------
// fetch and display ingredients
// ----------------------------

async function fetchIngredients() {
  dataBody.innerHTML = "";

  $(".main-loading-screen").fadeIn(300);
  searchBody.innerHTML = "";

  const url = "https://www.themealdb.com/api/json/v1/1/list.php?i=list";

  let apiResponse = await fetch(url);
  let apiJson = await apiResponse.json();
  allData = apiJson.meals;
  // console.log(allData);
  displayIngredients();
  closeNav();
  $(".main-loading-screen").fadeOut(500);
}
function displayIngredients() {
  content = ``;
  for (let i = 0; i < allData.length; i++) {
    content += `
          <div class="col-md-3">
            <div onclick="fetchIngredientMeals('${allData[i].strIngredient}')" class="ingredient text-center rounded-2 ">
              <i class="fa-solid fa-drumstick-bite fa-4x"></i>
              <h4>${allData[i].strIngredient}</h4>
            </div>
          </div>`;
  }
  dataBody.innerHTML = content;
}
async function fetchIngredientMeals(ingredient) {
  dataBody.innerHTML = "";

  $(".main-loading-screen").fadeIn(300);
  searchBody.innerHTML = "";

  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
  let fetchApi = await fetch(url);
  let apiResponse = await fetchApi.json();
  allData = apiResponse.meals;
  // console.log(allData);
  displayMeals();
  closeNav();
  $(".main-loading-screen").fadeOut(500);
}

// ----------------------------------------------
// Display Meals & Fetch and display meals details
// -------------------------------------------------
function displayMeals() {
  let content = ``;
  for (let i = 0; i < allData.length; i++) {
    content += `

        <div class="col-md-3">
          <div onclick="mealDetails('${allData[i].idMeal}')"  class="meal position-relative overflow-hidden rounded-2 ">
            <img
              src="${allData[i].strMealThumb}"
              alt="meal "
              class="w-100  "
            />
            <div class="meal-layer position-absolute">
              <h4 class="mealName" >${allData[i].strMeal}</h4>
            </div>
          </div>
        </div>
        `;
  }
  dataBody.innerHTML = content;
}
async function fetchMealsDetails(mealID) {
  dataBody.innerHTML = "";

  $(".main-loading-screen").fadeIn(300);
  searchBody.innerHTML = "";

  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`;
  let fetchApi = await fetch(url);
  let apiResponse = await fetchApi.json();
  allData = apiResponse.meals;
  // console.log(allData);
  displayMealDetails(allData);
  closeNav();
  $(".main-loading-screen").fadeOut(500);
}
async function mealDetails(mealID) {
  let fetchDetails = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  let apiResponse = await fetchDetails.json();
  allData = apiResponse.meals[0];
  displayMealDetails(allData);
}

// --------------------------------------------------------
//  Display Contact us form and handling its validation
// --------------------------------------------------------
let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

// Display Contact Us
function displayContactUs() {
  dataBody.innerHTML = "";

  $(".main-loading-screen").fadeIn(300);
  searchBody.innerHTML = "";

  let content = `
    <div class="col-md-5 contactUs">
            <input
              type="text"
              class="form-control"
              placeholder="Enter Your Name"
              id="nameInput"
              onkeyup="validation()"
            />
             <div id="nameAlert" class="alert alert-danger d-none w-100 ">Special characters and numbers not allowed </div>

          </div>
          <div class="col-md-5 contactUs">
            <input
              type="email"
              class="form-control"
              placeholder="Enter Your Email"
              id="emailInput"
              onkeyup="validation()"

            />
              <div id="emailAlert" class="alert alert-danger d-none w-100 ">Email not valid *exemple@yyy.zzz </div>

          </div>
          <div class="col-md-5 contactUs">
            <input
              type="number"
              class="form-control"
              placeholder="Enter Your Phone"
              id="phoneInput"
              onkeyup="validation()"
            />
             <div id="phoneAlert" class="alert alert-danger d-none w-100 ">Enter valid Phone Number </div>

          </div>
          <div class="col-md-5 contactUs">
            <input
              type="number"
              class="form-control"
              placeholder="Enter Your Age"
              id="ageInput"
              onkeyup="validation()"
            />
             <div id="ageAlert" class="alert alert-danger d-none w-100 ">Enter valid age </div>

          </div>
          <div class="col-md-5 contactUs">
            <input
              type="password"
              class="form-control"
              placeholder="Enter Your Password"
              id="passwordInput"
              onkeyup="validation()"
            />
             <div id="passwordAlert" class="alert alert-danger d-none w-100 ">Enter valid password *Minimum eight characters, at least one letter and one number: </div>

          </div>
          <div class="col-md-5 contactUs">
            <input
              type="password"
              class="form-control"
              placeholder="RePassword"
              id="repasswordInput"
              onkeyup="validation()"
            />
            <div id="repasswordAlert" class="alert alert-danger d-none w-100 ">Not Match</div>

          </div>
          <div class="col-md-10 d-flex justify-content-center align">
            <button id="submitBtn" disabled class="btn bg-transparent text-danger border-danger">
              Submit
            </button>
          </div>
  
  
  
  `;
  dataBody.innerHTML = content;
  submitBtn = document.getElementById("submitBtn");
  document.getElementById("nameInput").addEventListener("focus", () => {
    nameInputTouched = true;
  });
  document.getElementById("emailInput").addEventListener("focus", () => {
    emailInputTouched = true;
  });
  document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneInputTouched = true;
  });
  document.getElementById("ageInput").addEventListener("focus", () => {
    ageInputTouched = true;
  });
  document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordInputTouched = true;
  });
  document.getElementById("repasswordInput").addEventListener("focus", () => {
    repasswordInputTouched = true;
  });

  $(".main-loading-screen").fadeOut(500);
}

// validation
function validation() {
  if (nameInputTouched) {
    if (nameValidation()) {
      document
        .getElementById("nameAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("nameAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (emailInputTouched) {
    if (emailValidation()) {
      document
        .getElementById("emailAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("emailAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (phoneInputTouched) {
    if (phoneValidation()) {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (ageInputTouched) {
    if (ageValidation()) {
      document
        .getElementById("ageAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("ageAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (passwordInputTouched) {
    if (passwordValidation()) {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (repasswordInputTouched) {
    if (repasswordValidation()) {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled");
  }
}
function nameValidation() {
  let regex = /^[a-zA-Z ]+$/;
  return regex.test(document.getElementById("nameInput").value);
}

function emailValidation() {
  let regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(document.getElementById("emailInput").value);
}

function phoneValidation() {
  let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return regex.test(document.getElementById("phoneInput").value);
}

function ageValidation() {
  let regex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
  return regex.test(document.getElementById("ageInput").value);
}

function passwordValidation() {
  let regex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
  return regex.test(document.getElementById("passwordInput").value);
}

function repasswordValidation() {
  return (
    document.getElementById("repasswordInput").value ==
    document.getElementById("passwordInput").value
  );
}

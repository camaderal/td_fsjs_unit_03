/**
 * Error messages 
 */
const ERROR_NAME_REQUIRED = "※ Name is required.";
const ERROR_MAIL_REQUIRED = "※ E-mail is required.";
const ERROR_MAIL_INVALID = "※ E-mail is invalid.";
const ERROR_ACTIVITY_REQUIRED = "※ Needs to register for at least one activity."
const ERROR_CC_NUM_REQUIRED = "※ Card number is required.";
const ERROR_ZIP_REQUIRED = "※ Zip Code is required.";
const ERROR_CVV_REQUIRED = "※ CVV is required.";
const ERROR_CC_NUM_INVALID = "※ Card number is invalid. Only accepts 13-16 digits.";
const ERROR_ZIP_INVALID = "※ Zip Code is invalid. Only accepts 5 digits.";
const ERROR_CVV_INVALID = "※ CVV is invalid. Only accepts 3 digits.";

/**
 * Declare form elements
 */

// 'Basic Info'
const nameInput = document.getElementById("name");
const mailInput = document.getElementById("mail");
const titleSelect = document.getElementById("title");
const otherTitleInput = document.getElementById("other-title");

// 'T-shirt Info'
const colorJsPunsDiv = document.getElementById("colors-js-puns");
const designSelect = document.getElementById("design");
const designSelectOptions = designSelect.options;
const colorSelect = document.getElementById("color");
const colorSelectOptions = colorSelect.options;
const designColorOptionMap = [];
designColorOptionMap[designSelectOptions[1].value] = Array.from(colorSelectOptions).slice(0, 3);
designColorOptionMap[designSelectOptions[2].value] = Array.from(colorSelectOptions).slice(3);

// 'Register for Activities'
const activitiesFieldset = document.querySelector(".activities");
const activityCheckboxes = document.querySelectorAll(".activities input[type='checkbox']");

// 'Payment Info'
const paymentSelect = document.getElementById("payment");
const creditCardDiv = document.getElementById("credit-card");
const ccNumInput = document.getElementById("cc-num");
const zipInput = document.getElementById("zip");
const cvvInput = document.getElementById("cvv");

const paypalDiv = document.getElementById("paypal");
const bitcoinDiv = document.getElementById("bitcoin");

/**
 * Create form elements dynamically
 */

 // Error label for 'Name'
 const nameError = createElement("label", [{property:"id", value: "nameError"}, {property:"className", value: "errorLabel"}]);
nameInput.parentElement.insertBefore(nameError, nameInput);
nameError.style.display = "none";


// Error label for 'Email'
const mailError = createElement("label", [{property:"id", value: "mailError"}, {property:"className", value: "errorLabel"}]);
mailInput.parentElement.insertBefore(mailError, mailInput);
mailError.style.display = "none";

// Error label for 'Register for Activities'
const activitiesError = createElement("label", [{property:"id", value: "activitiesError"}, {property:"className", value: "errorLabel"}]);
activitiesFieldset.insertBefore(activitiesError, activitiesFieldset.firstElementChild);
activitiesFieldset.insertBefore(activitiesFieldset.firstElementChild, activitiesError);
activitiesError.style.display = "none";

// Total cost elements
const activityCostDiv = createElement("div", [{property:"id", value: "activityCost"}]);
const activityCostLabel = createElement("label", [{property:"textContent", value: "Total: $0"}]); 
activityCostDiv.appendChild(activityCostLabel);
activitiesFieldset.appendChild(activityCostDiv);

// Error label for 'Credit card details'
const creditCardError = createElement("label", [{property:"id", value: "creditCardError"}, {property:"className", value: "errorLabel"}]);
creditCardDiv.insertBefore(creditCardError, creditCardDiv.firstElementChild);
creditCardError.style.display = "none";

/**
 * Add Functionality
 */


 // 'Job Role' section

 //Set focus on the first text field
nameInput.autofocus = true;
nameInput.focus();

// add listeners for validation
nameInput.addEventListener("keyup", (e)=>{validateName()});
mailInput.addEventListener("blur", (e)=>{validateEmail()});

// 'Job Role' section

// Show textfield "other-title" when the "Other" option is selected from the "Job Role" drop down menu.
titleSelect.addEventListener("change", (e)=>{
    if(e.target.value == "other"){
        otherTitleInput.style.display="";
    }else{
        otherTitleInput.style.display="none";
        otherTitleInput.value="";
    }
});

// Other Title Input initially set to display == "none"
otherTitleInput.style.display = "none";

// 'T-Shirt Info' section

// Hide the "Color" label and select menu until a T-Shirt design is selected from the "Design" menu.
colorJsPunsDiv.style.display = "none";
designSelect.addEventListener("change", (e)=>{
    let targetValue = e.target.value;
    let colorOptions = designColorOptionMap[targetValue];
    if(colorOptions){
        colorJsPunsDiv.style.display = "";
        colorSelect.innerHTML = "";
        for(let i=0; i<colorOptions.length; i++){
            colorSelect.appendChild(colorOptions[i]);
        }
        colorSelect.value = colorOptions[0].value;
    }else{
        colorJsPunsDiv.style.display = "none";
    }
});

// 'Register for Activities' section
for(let i=0; i<activityCheckboxes.length; i++){
    activityCheckboxes[i].addEventListener("change", (e) => {

        // Enable/Disable checkboxes whose date and time is the same as the target
        const targetDayAndTime = e.target.dataset.dayAndTime;
        if(e.target.checked){

            // Select all checkboxes that: (1) not checked, (2) time equal to target's date and time.
            const conflictCheckboxes = document.querySelectorAll(".activities input[type='checkbox']:not(:checked)[data-day-and-time='"+targetDayAndTime+"']");
            for(let i=0; i<conflictCheckboxes.length; i++){
                if(conflictCheckboxes[i] != e.target){
                    conflictCheckboxes[i].disabled = true;
                }
            }
        }else{
            // Select all checkboxes that: (1) disabled, (2) time equal to target's date and time.
            const conflictCheckboxes = document.querySelectorAll(".activities input[type='checkbox']:disabled[data-day-and-time='"+targetDayAndTime+"']");
            for(let i=0; i<conflictCheckboxes.length; i++){
                conflictCheckboxes[i].disabled = false;
            }
        }

        // Compute the total cost of the selected activities
        let total = 0;
        const checkedActivities = document.querySelectorAll(".activities input[type='checkbox']:checked");
        for(let j=0; j<checkedActivities.length; j++){
            total += parseFloat(checkedActivities[j].dataset.cost.replace("$", ""));
        }
        activityCostLabel.textContent = `Total: \$${total}`;

        validateActivities();
    });
}

//"Payment Info" section

// Display payment sections based on the payment option chosen in the select menu
const loadPaymentDisplay = () =>{
    const paymentSelectValue = paymentSelect.value;
    if(paymentSelectValue === "paypal"){
        creditCardDiv.style.display = "none";
        paypalDiv.style.display = "";
        bitcoinDiv.style.display = "none";
    }else if(paymentSelectValue === "bitcoin" ){
        creditCardDiv.style.display = "none";
        paypalDiv.style.display = "none";
        bitcoinDiv.style.display = "";
    }else{
        creditCardDiv.style.display = "";
        paypalDiv.style.display = "none";
        bitcoinDiv.style.display = "none";
    }

    // Reset errors and values when dropdow menu is changed
    hideError(["cc-num","zip","cvv"], "creditCardError");
    ccNumInput.value = "";
    zipInput.value = "";
    cvvInput.value = "";
}
paymentSelect.addEventListener("change", loadPaymentDisplay);
paymentSelect.removeChild(paymentSelect.firstElementChild);
paymentSelect.value="credit card";
ccNumInput.maxLength = 16;
zipInput.maxLength = 5;
cvvInput.maxLength = 3;
loadPaymentDisplay();
 
 /**
  * Form validation
  */
document.querySelector("form").addEventListener("submit", (e)=>{
    let hasNoErrors = validateName();
    hasNoErrors = validateEmail() && hasNoErrors;
    hasNoErrors = validateActivities() && hasNoErrors;
    hasNoErrors = validateCreditCardInfo() && hasNoErrors;

    if(!hasNoErrors){
        e.preventDefault();
    }
});

/**
 * Validates "Name"
 * 
 * - Name field can't be blank.
 * @return {boolean} true: validation succesful/ false: validation failed
 */
function validateName(){
    hideError(["name"], "nameError");
    if(nameInput.value.trim() == ""){
        showError(["name"], "nameError", ERROR_NAME_REQUIRED);
        return false;
    }
    return true;
}

/**
 * Validates "Email"
 * 
 * - Email field must be a validly formatted e-mail address
 * @return {boolean} true: validation succesful/ false: validation failed
 */
function validateEmail(){
    const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    const mailValue = mailInput.value.trim();
    hideError(["mail"], "mailError");

    if(mailValue == "" ){
        showError(["mail"], "mailError", ERROR_MAIL_REQUIRED);
        return false;
    }

    if(!mailRegex.test(mailValue)){
        showError(["mail"], "mailError", ERROR_MAIL_INVALID);
        return false;
    }
    return true;
}

/**
 * Validates "Activities"
 * 
 * - User must select at least one checkbox under the "Register for Activities" section of the form.
 * @return {boolean} true: validation succesful/ false: validation failed
 */
function validateActivities(){
    hideError([], "activitiesError");
    if(document.querySelectorAll(".activities input[type='checkbox']:checked").length == 0){
        showError([], "activitiesError", ERROR_ACTIVITY_REQUIRED);
        return false;
    }
    return true;
}

/**
 * Validates "Credit Card Details"
 * 
 * - Card number
 *   - must not be empty
 *   - must be composed of 13-16 digits
 * - Zip Code
 *   - must not be empty
 *   - must be composed of 5 digits
 * - CVV
 *   - must not be empty
 *   - must be composed of 3 digits
 * @return {boolean} true: validation succesful/ false: validation failed
 */
function validateCreditCardInfo(){
    const ccFields = ["cc-num","zip","cvv"];
    hideError(ccFields, "creditCardError");
    let hasNoErrors = true;
    if(paymentSelect.value === "credit card"){
        if(ccNumInput.value.trim() == ""){
            showError(["cc-num"], "creditCardError", ERROR_CC_NUM_REQUIRED);
            hasNoErrors = false;
        }else if(!/^[0-9]{13,16}$/.test(ccNumInput.value)){
            showError(["cc-num"], "creditCardError", ERROR_CC_NUM_INVALID);
            hasNoErrors = false;
        }

        if(zipInput.value.trim() == ""){
            showError(["zip"], "creditCardError", ERROR_ZIP_REQUIRED);
            hasNoErrors = false;
        }else if(!/^[0-9]{5}$/.test(zipInput.value)) {
            showError(["zip"], "creditCardError", ERROR_ZIP_INVALID);
            hasNoErrors = false;
        }

        if(cvvInput.value.trim() == ""){
            showError(["cvv"], "creditCardError", ERROR_CVV_REQUIRED);
            hasNoErrors = false;
        }else if(!/^[0-9]{3}$/.test(cvvInput.value)) {
            showError(["cvv"], "creditCardError", ERROR_CVV_INVALID);
            hasNoErrors = false;
        }
    }
    return hasNoErrors;
}

/**
 * Creates a new element
 * Sets specified attributes
 * 
 * @param {String} type 
 * @param {Array of Objects (property,value)} attributes 
 * @returns element
 */
function createElement(type, attributes){
    const element = document.createElement(type);
    if(attributes && attributes.length != 0){
       for(let i=0; i < attributes.length; i++){
          element[attributes[i].property] = attributes[i].value;
       }
    }
    return element;
 }

 /**
 * Displays error message
 * 
 * @param {Array of String} fields: ids of fields that have invalid input
 * @param {String} errorLabelId: id of error label where error message will be displayed
 * @param {String} message: error message to be displayed
 */
 function showError(fields, errorLabelId, message){
    
    for(let i=0; i< fields.length; i++){
        const field = document.getElementById(fields[i]);
        field.classList.add("error"); 
    }

    const errorLabel = document.getElementById(errorLabelId);
    errorLabel.innerHTML += message + "<br>";
    errorLabel.style.display = "";
 }

 /**
 * Hides error message
 * 
 * @param {Array of String} fields: ids of fields whose error class will be removed
 * @param {String} errorLabelId: id of error label which will be hidden
 */
 function hideError(fields, errorLabelId){
    
    for(let i=0; i< fields.length; i++){
        const field = document.getElementById(fields[i]);
        field.classList.remove("error"); 
    }

    const errorLabel = document.getElementById(errorLabelId);
    errorLabel.innerHTML= "";
    errorLabel.style.display = "none";
}
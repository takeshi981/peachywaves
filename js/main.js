 const pwShowHide = document.querySelectorAll(".pw_hide"),
       username = document.querySelector("#login_username"),
       buttonLogin = document.querySelector("#login_button"),
       pass = document.querySelector("#login_password");

 pwShowHide.forEach((icon) => {
     icon.addEventListener("click", () => {
         let getPwInput = icon.parentElement.parentElement.querySelector("#login_password");
         if (getPwInput.type === "password") {
             getPwInput.type = "text";
             icon.classList.replace("eye_closed_icon", "eye_light_icon")
         } else {
             getPwInput.type = "password";
             icon.classList.replace("eye_light_icon", "eye_closed_icon");
         }
     });
 });

 let current_user = 0;
let default_session = lightdm.default_session;

 username.value = lightdm.users[current_user].username;

 const selectbox = document.querySelector(".selectbox");
 const selectboxDisplay = document.querySelector(".selectbox__displayWord");




 selectboxDisplay.addEventListener("click", (e) => {
     e.stopPropagation();
     selectbox.classList.toggle("selectbox--active");
 });

 function shakeBox() {
     selectbox.classList.add("selectbox--shake");
     setTimeout(() => {
         selectbox.classList.remove("selectbox--shake");
     }, 300);
 }

 document.onreadystatechange = () => {
     if (document.readyState == "complete") {
          const optionList = document.querySelectorAll(".option-container__option");

  optionList.forEach((option, index) => {
     option.addEventListener("click", (e) => {
         e.stopPropagation(); // Stops the click event from propagating to parent elements

         let label = option.querySelector("label"); // Finds the label within the clicked option
         if (label) { // Checks if the label exists
             selectboxDisplay.innerHTML = label.innerHTML; // Updates the selectboxDisplay with the label's content
             selectbox.setAttribute("data-option", label.getAttribute("data-value")); // Sets a data attribute on selectbox
             selectbox.classList.remove("selectbox--active", "selectbox--unselect"); // Removes specific classes from selectbox

             // Assuming default_session is meant to store the label for later use
             default_session = label.innerHTML;
             
             // Alerts the text content of the label

         } else {
             console.error('Label not found within the option.');
         }
     });
 });

     }
 }

     window.addEventListener("click", () => {
         selectbox.classList.remove("selectbox--active");
     });



function populate_dropdown(){

    lightdm.sessions.forEach(function(session, index){




        let session_name = lightdm.sessions[index].key;
        var object = document.querySelector(".option-container");
        let html = `<div class="option-container__option">
        <input type="radio" class="option__radio" id="`+session_name+`" name="category">
        <label class="option__label" for="`+session_name+`" data-value="`+session_name+`">`+session_name+`</label>
        </div>`;
        object.insertAdjacentHTML("beforeend", html);


    });
}
 buttonLogin.addEventListener("click", function(evt){
     respond();
     evt.preventDefault();

 });

 function update_time() {
     let time = document.querySelector("#current_time");
     let date = new Date();

     let hh = date.getHours();
     let mm = date.getMinutes();
     let ss = date.getSeconds();
     let suffix= "AM";
     if (hh > 12) {
         hh = hh - 12;
         suffix = "PM";
     }
     if (hh < 10) { hh = "0"+hh; }
     if (mm < 10) { mm = "0"+mm; }
     if (ss < 10) { ss = "0"+ss; }
     time.innerHTML = hh+":"+mm + " " + suffix;
 }

 function initialize_timer() {
     update_time();
     setInterval(update_time, 1000);
 }

 function handleEnter(e){
     if (e.keyCode === 13){
         respond();
         e.preventDefault();
     }
 }

 function start_authentication(user){

     lightdm.authenticate(user);

 }

 function respond(){
     let password = pass.value || null;
     if(password !== null) {
         lightdm.respond(password);
         authenticationDone();
     } else {
         lightdm.cancel_authentication();

     }
 }

 function authenticationDone(){
     lightdm.authentication_complete.connect(() => {
         if (lightdm.is_authenticated) {

             authentication_complete();

         }
         else {

             authentication_failed();

         }

     });
 }

 async function authentication_complete()
 {

     lightdm.start_session(default_session);


 }

 async function authentication_failed(){

     lightdm.cancel_authentication();

     start_authentication(username.value);

 }

 start_authentication(username.value);
 initialize_timer();
 populate_dropdown();

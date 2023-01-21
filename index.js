const form = document.querySelector("form");
const email = document.querySelector("#email");
const body = document.querySelector("#body");
const submit = document.querySelector("#submit");

const mailStatus = document.querySelector(".mail-status");

form.addEventListener("submit", event => {
    event.preventDefault();

    submitForm();
});

function validateEmail(email) {
  var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

body.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        submitForm();
    }
});

function submitForm() {
    const formData = new FormData(form);

    const email = formData.get("email");
    const body = formData.get("body");

    if (validateEmail(email) && body.trim() !== '') {
        console.log("validated");
        fetch("index2.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            mailStatus.classList.add("show-status");
            mailStatus.textContent = "Mail has been sent";
            form.reset();
        });
    }
}
const $form = document.querySelector("form");
const $email = document.querySelector("#email");
const $name = document.querySelector("#name");
const $body = document.querySelector("#body");
const $submit = document.querySelector("#submit");
const $subjects = document.querySelector("select");
const $mailStatus = document.querySelector(".mail-status");

async function getMails() {
    const response = await fetch("./subjects.json");
    const data = await response.json();

    return data;
}

async function getSubjects() { 
    let subjects = [];

    const mails = await getMails();

    mails.forEach(mail => {
        const { subject } = mail;
        subjects.push(subject);
    });

    return subjects;
}

async function getBody(subject) {
    const mails = await getMails();

    const mail = mails.find(mail => {
        if (mail.subject === subject) {
            return mail.body;
        }    
    });

    return mail?.body;
}

(async function fillSubjects() {
    const subjects = await getSubjects();
    subjects.forEach(subject => {
        const $option = document.createElement("option");
        $subjects.appendChild($option);
        $option.setAttribute("value", subject);
        $option.textContent = subject;
        $subjects.appendChild($option);
    });
})();

// track subject
$subjects.addEventListener("change", async event => {
    const subject = event.target.value;
    let body = await getBody(subject);

    body = dynamicMail(body, "Receiver", $name.value);
    body = dynamicMail(body, "Sender", "Jhon");
    body = dynamicMail(body, "Subject", subject);
    body = dynamicMail(body, "Date", new Date().toDateString());
    body = dynamicMail(body, "Time", `${new Date().getHours()}:${new Date().getMinutes()}`);
    body = dynamicMail(body, "Location", "Bee House Coffe shop");

    $body.value = body || "";

});

function dynamicMail(body, placeholder, data) {
    return body?.split(`[${placeholder}]`).join(data);
}

$form.addEventListener("submit", event => {
    submitForm(event);
});

$body.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        submitForm(event);
    }
});

function validateEmail(email) {
    const gmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@gmail\.com$/;
    return gmailRegex.test(email);
}


async function submitForm(event) {
    event.preventDefault();
    const formData = new FormData($form);

    const email = formData.get("email");
    const body = formData.get("body");

    if (validateEmail(email) && body.trim() !== '') {
        const response = await fetch("index.php", {
            method: "POST",
            body: formData
        })
        
        const data = await response.text();
            
        $mailStatus.classList.add("show-status");

        if (data) {
            $mailStatus.textContent = "Mail has been sent";
            $form.reset();
        } else {
            $mailStatus.textContent = "Mail has not been sent";
        }  
    }
}
const logInForm = document.getElementById("login-form");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
let emailHelp = document.getElementById("emailHelp");

logInForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const body = {
        email: emailInput.value,
        password: passwordInput.value,
    };

    logInRequest(body);
});

async function logInRequest(body) {
    body = JSON.stringify(body);
    const method = "post";
    const url = "https://v2.api.noroff.dev/auth/login";
    const headers = { "Content-Type": "application/json" };

    const response = await fetch(url, {
        headers: headers,
        method: method,
        body: body,
    })
        .then((response) => response.json())
        .then(async (data) => {
            const { accessToken: token, ...profile } = data.data;
            localStorage.setItem("token", JSON.stringify(token));
            localStorage.setItem("profile", JSON.stringify(profile));

            window.location.href = "/profile/?name=" + profile.name;
        })
        .catch((reject) => {
            emailHelp.style.color = "green";
            emailHelp.style.fontSize = "large";
            emailHelp.innerHTML = "Wrong email or password...";
        });
}

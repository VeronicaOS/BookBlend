const logInForm = document.getElementById("login-form");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");

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
    });

    console.log(response);

    const data = await response.json();
    console.log(data);

    if (response.ok) {
        const { accsessToken: token, ...profile } = data.data;
        console.log(token);
        console.log(profile);
        localStorage.setItem("token", token);
        localStorage.setItem("profile", JSON.stringify(profile));

        window.location.href = "/profile";
    }
}

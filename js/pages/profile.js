import { API_KEY, load, BASE_URL } from "../api/constants.js";

const user = load("profile");

let params = new URLSearchParams(window.location.search);
let name = params.get("name");

if (!name) {
    window.location.href = "/profile/?name=" + user.name;
}

const endpoint = "/social/profiles/" + name;

const url = BASE_URL + endpoint;

const method = "get";

const headers = {
    Authorization: `Bearer ${load("token")}`,
    "X-Noroff-API-Key": API_KEY,
};

const response = await fetch(url, {
    headers: headers,
    method: method,
});

const data = await response.json();

const profileData = data.data;

document.getElementById("profile-name").textContent = profileData.name;

const profileAvatar = document.getElementById("profile-avatar");
profileAvatar.src = profileData.avatar.url;
profileAvatar.alt = profileData.avatar.alt;

async function getPosts() {
    const endpoint = "/social/profiles/" + name + "/posts/?_author=true";

    const url = BASE_URL + endpoint;

    const method = "get";

    const headers = {
        Authorization: `Bearer ${load("token")}`,
        "X-Noroff-API-Key": API_KEY,
    };

    const response = await fetch(url, {
        headers: headers,
        method: method,
    });

    const data = await response.json();

    return data.data;
}

function createPost(post) {
    const postDate = post.updated.slice(0, 10);
    const currentDate = new Date(postDate);
    const currentDay = currentDate.getDate();
    const curDay = currentDay < 10 ? "0" + currentDay : currentDay;
    const currentMonth = currentDate.toLocaleString(`default`, {
        month: "long",
    });
    const currentYear = currentDate.getFullYear();
    const curDate = `${curDay}. ${currentMonth} ${currentYear}`;
    const template = `<div class="row">
    <div class="col-lg-3 col-md-2 col-1"></div>
    <div class="card mb-4 p-0 col-lg-6 col-md-8 col-10">
        <div class="row g-0 bg-secondary">
            <div class="col-2">
                <img
                    src=${post.author.avatar.url}
                    class="w-75 m-3 rounded-circle img-fluid"
                    alt=${post.author.avatar.alt}
                />
            </div>
            <div class="col-10">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">
                    ${post.body}
                    </p>
                    <a
                        href="/post/?id=${post.id}"
                        class="card-text text-primary"
                    >
                        View
                    </a>
                    <p class="card-text">
                        <small class="text-muted"
                            >Posted ${curDate}</small
                        >
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="col-lg-3 col-md-2 col-1"></div>
    </div>`;
    return template;
}

const posts = await getPosts();
const postsContainer = document.getElementById("post-container");
posts.forEach((post) => {
    postsContainer.innerHTML += createPost(post);
});

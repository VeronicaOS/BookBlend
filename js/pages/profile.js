import { API_KEY, load, BASE_URL } from "../api/constants.mjs";

const user = load("profile");

console.log(user);

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

console.log(response);

const data = await response.json();
console.log(data);

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

    console.log(response);

    const data = await response.json();

    console.log(data);
    return data.data;
}

function createPost(post) {
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
                        Read more
                    </a>
                    <p class="card-text">
                        <small class="text-muted"
                            >Posted ${post.created}</small
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

console.log(posts);

import { API_KEY, load, BASE_URL } from "../api/constants.mjs";

async function getPosts() {
    const endpoint = "/social/profiles/";

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

console.log(getPosts);

function createPost(post) {
    const template = `<div class="col-md-2 col-1"></div>
    <div class="card mb-4 p-0 col-md-8 col-10">
        <div class="row g-0 bg-secondary p-md-4">
            <div class="col-2">
            <img
            src=${post.avatar.url}
            class="w-50 m-3"
            alt=${post.avatar.alt}
        />
                <p class="text-center">${post.name}</p>
            </div>
            <div class="col-10">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.body}</p>
                    <div>
                        <a
                            href="#"
                            class="card-text text-primary"
                        >
                            Read more
                        </a>
                        <div class="d-flex gap-4 mt-2">
                            <p class="m-0">15 likes</p>
                            <p class="m-0">2 comments</p>
                        </div>
                    </div>
                    <p class="card-text">
                        <small class="text-muted"
                            >Posted ${post.created}</small
                        >
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-2 col-1"></div>`;
    return template;
}

const posts = await getPosts();
const postsContainer = document.getElementById("post-container");
posts.forEach((post) => {
    postsContainer.innerHTML += createPost(post);
});

console.log(posts);

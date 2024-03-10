import { API_KEY, load, BASE_URL } from "../api/constants.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const searchTerm = urlParams.get("search");

async function getPosts() {
    const endpoint = "/social/posts/?_author=true";

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

    if (searchTerm) {
        return data.data.filter(
            (item) =>
                item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.body?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    } else {
        return data.data;
    }
}

function renderPost(post) {
    const postDate = post.updated.slice(0, 10);
    const currentDate = new Date(postDate);
    const currentDay = currentDate.getDate();
    const curDay = currentDay < 10 ? "0" + currentDay : currentDay;
    const currentMonth = currentDate.toLocaleString(`default`, {
        month: "long",
    });
    const currentYear = currentDate.getFullYear();
    const curDate = `${curDay}. ${currentMonth} ${currentYear}`;
    let media = "";
    if (post.media) {
        media = `<img class="img-fluid" src=${post.media.url} alt=${post.media.alt}/>`;
    }
    const template = `<div class="card mb-4 p-0">
        <div class="row g-0 bg-secondary p-md-4">
            <div class="col-2 d-flex flex-column align-items-center">
            <img
            src=${post.author?.avatar.url}
            class="w-50 m-3 rounded-circle img-fluid"
            alt=${post.author?.avatar.alt}
            />
                <p class="text-center">${post.author?.name}</p>
            </div>
            <div class="col-10">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    ${media}
                    <p class="card-text">${post.body}</p>
                    <div>
                        <a
                            href="/post/?id=${post.id}"
                            class="card-text text-primary"
                        >
                            View
                        </a>
                        <div class="d-flex gap-4 mt-2">
                            <p class="m-0">${post._count.reactions} likes</p>
                            <p class="m-0">${post._count.comments} comments</p>
                        </div>
                    </div>
                    <p class="card-text">
                        <small class="text-muted"
                            >Posted ${curDate}</small
                        >
                    </p>
                </div>
            </div>
        </div>
    </div>`;
    return template;
}

const posts = await getPosts();

const postsContainer = document.getElementById("post-container");
posts.forEach((post) => {
    postsContainer.innerHTML += renderPost(post);
});

const sorting = document.getElementById("sort-by");
sorting.addEventListener("change", function (event) {
    const value = event.target.value;
    postsContainer.innerHTML = "";
    let sortedPosts;
    if (value === "newest") {
        sortedPosts = posts.sort(function (a, b) {
            return new Date(b.created) - new Date(a.created);
        });
    } else if (value === "oldest") {
        sortedPosts = posts.sort(function (a, b) {
            return new Date(a.created) - new Date(b.created);
        });
    } else if (value === "popularity") {
        sortedPosts = posts.sort(function (a, b) {
            return b._count.reactions - a._count.reactions;
        });
    }
    sortedPosts.forEach((post) => {
        postsContainer.innerHTML += renderPost(post);
    });
});

async function createPost(title, body) {
    const endpoint = "/social/posts";
    const url = BASE_URL + endpoint;
    const method = "post";
    const headers = {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${load("token")}`,
        "X-Noroff-API-Key": API_KEY,
    };

    const request = await fetch(url, {
        headers: headers,
        method: method,
        body: JSON.stringify({
            title: title,
            body: body,
        }),
    })
        .then((response) => response.json())
        .then(async (json) => {
            const posts = await getPosts();
            const postsContainer = document.getElementById("post-container");
            postsContainer.innerHTML = "";
            posts.forEach((post) => {
                postsContainer.innerHTML += renderPost(post);
            });
        });
}

const publish = document.getElementById("publish-btn");
publish.addEventListener("click", function (event) {
    const title = document.getElementById("postTitle");
    const body = document.getElementById("postBody");
    createPost(title.value, body.value);
});

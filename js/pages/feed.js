import { API_KEY, load, BASE_URL } from "../api/constants.mjs";

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

    console.log(response);

    const data = await response.json();

    console.log(data);
    return data.data;
}

console.log(getPosts);

function createPost(post) {
    let media = "";
    if (post.media) {
        media = `<img class="img-fluid" src=${post.media.url} alt=${post.media.alt}/>`;
    }
    const template = `<div class="col-md-2 col-1"></div>
    <div class="card mb-4 p-0 col-md-8 col-10">
        <div class="row g-0 bg-secondary p-md-4">
            <div class="col-2">
            <img
            src=${post.author.avatar.url}
            class="w-50 m-3"
            alt=${post.author.avatar.alt}
        />
                <p class="text-center">${post.author.name}</p>
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
                            Read more
                        </a>
                        <div class="d-flex gap-4 mt-2">
                            <p class="m-0">${post._count.reactions} likes</p>
                            <p class="m-0">${post._count.comments} comments</p>
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

const sorting = document.getElementById("sort-by");
sorting.addEventListener("change", function (event) {
    const value = event.target.value;
    console.log(value);
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
        postsContainer.innerHTML += createPost(post);
    });
});

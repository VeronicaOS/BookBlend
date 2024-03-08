import { API_KEY, load, BASE_URL } from "../api/constants.mjs";

const user = load("profile");
console.log(user);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postId = urlParams.get("id");

async function getPost() {
    const endpoint = `/social/posts/${postId}?_author=true`;

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

    console.log(data.data);
    return data.data;
}

getPost();

function renderPost(post) {
    let media = "";
    if (post.media) {
        media = `<img class="img-fluid" src=${post.media.url} alt=${post.media.alt}/>`;
    }
    let updateBtn = "";
    let deleteBtn = "";
    if (post.author.email == user.email) {
        updateBtn = `<a
        href="/postEdit/?id=${post.id}"
        class="btn btn-primary mt-2"
    >
        Edit
    </a>`;
        deleteBtn = `<button type="button" class="btn btn-customwhite mt-2" id="delete-btn">
    Delete
</button>`;
    }
    const template = `
    <div class="card bg-secondary mb-4 p-0">
        <div class="row g-0  p-2 p-md-4 pr-0">
            <div class="col-2">
            <img
            src=${post.author.avatar.url}
            class="w-50 m-3"
            alt=${post.author.avatar.alt}
        />
                <p class="text-center">${post.author.name}</p>
            </div>
            <div class="col-10 h-100">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    ${media}
                    <p class="card-text">${post.body}</p>
                    <div>
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
                    ${updateBtn}
                    ${deleteBtn}
                </div>
            </div>
        </div>
    </div>`;
    return template;
}

const post = await getPost();
const viewPost = document.getElementById("view-post");
viewPost.innerHTML = renderPost(post);

console.log(post);

// Delete

async function deletePost(postId) {
    const endpoint = `/social/posts/${postId}`;
    const url = BASE_URL + endpoint;
    const method = "delete";
    const headers = {
        Authorization: `Bearer ${load("token")}`,
        "X-Noroff-API-Key": API_KEY,
    };

    const request = await fetch(url, {
        headers: headers,
        method: method,
    });
    window.location.href = `/feed`;
}

const remove = document.getElementById("delete-btn");
remove.addEventListener("click", function (event) {
    deletePost(post.id);
});

import { API_KEY, load, BASE_URL } from "../api/constants.mjs";

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

function renderUpdatePost(post) {
    const template = `<form class="mt-5 p-4 rounded-2 bg-primary">
    <div class="form-group">
        <label for="postUpdateTitle"
            >Which book have you read?</label
        >
        <input
            type="subject"
            class="form-control mb-3 mt-1"
            id="postUpdateTitle"
            placeholder="title"
            value=${post.title}
        />
    </div>
    <div class="form-group">
        <label for="postUpdateBody"
            >What are your thoughts?</label
        >
        <textarea
            class="form-control mb-3 mt-1"
            id="postUpdateBody"
            rows="3"
        >
        ${post.body}</textarea>
    </div>
    <button
        type="button"
        class="btn btn-customwhite mt-2"
        id="save-btn"
    >
        Save
    </button>
</form>`;
    return template;
}

const post = await getPost();
const updatePost = document.getElementById("update-post");
updatePost.innerHTML = renderUpdatePost(post);

console.log(post);

// update

async function editPost(postId, title, body) {
    const endpoint = `/social/posts/${postId}`;
    const url = BASE_URL + endpoint;
    const method = "put";
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
            console.log(json);
            window.location.href = `/post/?id=${post.id}`;
        });
}

const save = document.getElementById("save-btn");
save.addEventListener("click", function (event) {
    const title = document.getElementById("postUpdateTitle");
    const body = document.getElementById("postUpdateBody");
    console.log(title.value, body.value);
    editPost(post.id, title.value, body.value);
});


import { API_KEY, load, BASE_URL } from "../api/constants.js";

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

    const data = await response.json();

    return data.data;
}
getPost();

function renderUpdatePost(post) {
    const template = `<form class="p-4 rounded-2 bg-primary">
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

// update

/**
 * Asynchronously edits a specific post on the social platform API.
 *
 * @async
 * @function
 * @param {string} postId - The unique identifier of the post to be edited.
 * @param {string} title - The updated title for the post.
 * @param {string} body - The updated body content for the post.
 * @returns {Promise<void>} A Promise that resolves when the post is successfully edited.
 *
 * @description This asynchronous function sends a PUT request to the social platform API
 * to edit a specific post identified by the given postId. It updates the post's title and body
 * with the provided values. After a successful edit, it redirects the user to the edited post's page.
 *
 * @example
 * ```js
 * // Usage example:
 * const postId = "1116";
 * const updatedTitle = "test";
 * const updatedBody = "testing 3 2 1";
 * const request = sends you back to the post page with title and body
 * //expect the post to be updated when you return to the post page.
 * ```
 */

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
            window.location.href = `/post/?id=${post.id}`;
        });
}

const save = document.getElementById("save-btn");
save.addEventListener("click", function (event) {
    const title = document.getElementById("postUpdateTitle");
    const body = document.getElementById("postUpdateBody");
    editPost(post.id, title.value, body.value);
});

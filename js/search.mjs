import { API_KEY, load, BASE_URL } from "../api/constants.mjs";

const searchBar = document.getElementById("search");

export async function searchPosts() {
    const endpoint = `/social/posts/search?q=`;

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

searchPostsPost();

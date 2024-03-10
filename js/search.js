const searchBar = document.getElementById("search");

searchBar.addEventListener("search", () => {
    if (searchBar.value.length > 0) {
        window.location.href = `/feed/?search=${searchBar.value}`;
    }
});

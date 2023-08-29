console.log("JS script integrated");

function openpage() {
    let current_url = window.location;
    console.log("current_url main === ", current_url);
    setTimeout(() => {
        current_url = current_url + 'pages/blogview.html';
        console.log("current_url === ", current_url);
        window.location.replace(current_url);

    }, 2000);
}
console.log("JS script integrated");

function openpage() {
    console.log("window.location ====", window.location);
    setTimeout(() => {
        window.location.href = '/pages/auth/signup.html';

    }, 1000);
}
document.addEventListener("DOMContentLoaded", () => {

    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    // Redirect if not logged in
    if (!name || !email) {
        window.location.href = "/login.html";
        return;
    }

    document.getElementById("fullName").textContent = name;
    document.getElementById("email").textContent = email;

    // Generate profile initial
    const initialElement = document.getElementById("userInitial");
    if (initialElement && name) {
        const initial = name.trim().charAt(0).toUpperCase();
        initialElement.textContent = initial;
    }

});

function toggleMenu() {
    const menu = document.getElementById("profileMenu");
    menu.classList.toggle("active");
}

function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
        const output = document.getElementById("userDP");
        const initial = document.getElementById("userInitial");

        output.src = reader.result;
        output.style.display = "block";

        if (initial) initial.style.display = "none";
    };

    reader.readAsDataURL(file);
}

// Close menu if clicked outside
window.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-right")) {
        const menu = document.getElementById("profileMenu");
        if (menu) menu.classList.remove("active");
    }
});

// // const loginUser = require('./Controllers/loginController.js');

// // const {email, fullName}  = ;
// document.addEventListener("DOMContentLoaded", async () => {
//     const token = localStorage.getItem("token");
//     const response = await fetch("/protected", {
//         method: "GET",
//         headers: {
//             "Authorization": `Bearer ${token}`
        
//         }
//     });
//     const data = await response.json();
//     document.getElementById("fullName").textContent = data.user.name;
//     document.getElementById("email").textContent = data.user.email;
// });

// function toggleMenu() {
//             const menu = document.getElementById('profileMenu');
//             menu.classList.toggle('active');
//         }

//         function previewImage(event) {
//             const reader = new FileReader();
//             reader.onload = function() {
//                 const output = document.getElementById('userDP');
//                 const initial = document.getElementById('userInitial');
//                 output.src = reader.result;
//                 output.style.display = 'block';
//                 initial.style.display = 'none';
//             };
//             reader.readAsDataURL(event.target.files[0]);
//             // Logic to send this image to MongoDB via Multer would go here
//         }

//         // Close menu if clicked outside
//         window.onclick = function(e) {
//             if (!e.target.closest('.nav-right')) {
//                 document.getElementById('profileMenu').classList.remove('active');
//             }
            
//         }
//         // Displaying actual name and email







        
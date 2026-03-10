const form = document.getElementById("loginForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const passwordValue = document.getElementById("password").value;

  if (!email || !passwordValue) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: passwordValue
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    // Save login data
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.user.name);
    localStorage.setItem("email", data.user.email);

    // Redirect
    window.location.href = "/landing_after_login.html";

  } catch (error) {
    alert("Server not running or connection error");
  }
});


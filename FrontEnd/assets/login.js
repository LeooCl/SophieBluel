document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessageElement = document.getElementById("error-message");

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                if (errorData && errorData.message) {
                    throw new Error("Email ou mot de passe incorrect!");
                } else {
                    throw new Error("Erreur inconnue!");
                }
            });
        }
        return response.json();
    })
    .then(data => {
        console.log(data);

        if (data.userId && data.token) {
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            
            window.location.href = "index.html";
        } else {
            
            errorMessageElement.textContent = "E-mail ou mot de passe incorrect.";
        }
    })
    .catch(error => {
        console.error("Erreur:", error);
        errorMessageElement.textContent = error.message || "Une erreur s'est produite. Veuillez réessayer plus tard.";
    });
});
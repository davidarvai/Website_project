// Űrlap elküldése eseményfigyelő
document.getElementById('loginFormElement').addEventListener('submit', function (e) {
    e.preventDefault(); // Az alapértelmezett űrlap elküldésének megakadályozása

    // Űrlap mezők értékeinek lekérése
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Bejelentkezési adatok küldése a szerverre JSON formátumban
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.text())
    .then(message => {
        // Bejelentkezési üzenet megjelenítése
        const loginMessage = document.getElementById('loginMessage');
        loginMessage.textContent = message;
        if (message === 'Logged in successfully.') {
            // Sikeres bejelentkezés esetén megjelenő elemek
            loginMessage.style.display = 'block';
            const loginForm = document.getElementById('loginForm');
            loginForm.style.display = 'none';
            const homeButton = document.getElementById('homeButton');
            homeButton.style.display = 'block';
            homeButton.style.margin = '20px auto';
            const logoutButton = document.createElement('button'); // Kijelentkezés gomb létrehozása
            logoutButton.textContent = 'Kijelentkezés'; // Gomb felirata
            logoutButton.id = 'logoutButton'; // Gomb azonosítója
            logoutButton.addEventListener('click', logout); // Kattintás esemény hozzáadása
            document.body.appendChild(logoutButton); // Gomb hozzáadása a dokumentumhoz
            logoutButton.style.display = 'none'; // Gomb alapértelmezett rejtése
        } else {
            // Sikertelen bejelentkezés esetén elrejtett elemek
            const homeButton = document.getElementById('homeButton');
            homeButton.style.display = 'none';
            const logoutButton = document.getElementById('logoutButton');
            if (logoutButton) {
                logoutButton.style.display = 'none';
            }
        }
    })
    .catch(error => console.error('Error:', error));
});

// Kijelentkezés függvény
function logout() {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(message => {
        // Üzenet megjelenítése
        const loginMessage = document.getElementById('loginMessage');
        loginMessage.textContent = message;
        loginMessage.style.display = 'block';
        // Form megjelenítése
        const loginForm = document.getElementById('loginForm');
        loginForm.style.display = 'flex';
        // Kijelentkezés gomb elrejtése
        const logoutButton = document.getElementById('logoutButton');
        logoutButton.style.display = 'none';
        // Vissza a főoldalra gomb elrejtése
        const homeButton = document.getElementById('homeButton');
        homeButton.style.display = 'none';
    })
    .catch(error => console.error('Error:', error));
}

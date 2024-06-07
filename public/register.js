document.addEventListener('DOMContentLoaded', function() { // Eseménykezelő hozzáadása, amely akkor fut le, amikor az összes DOM elem betöltődött
    document.getElementById('registerForm').addEventListener('submit', function(event) { // Az űrlap beküldésének eseménykezelője
        event.preventDefault(); // Megakadályozza az alapértelmezett űrlap beküldését

        const formData = new FormData(this); // Létrehoz egy új űrlapadat objektumot a regisztrációs adatokkal
        const data = { // Létrehoz egy objektumot a regisztrációs adatok tárolására
            username: formData.get('username'), // Felhasználónév
            email: formData.get('email'), // Email
            password: formData.get('password'), // Jelszó
            role: formData.get('role') // Szerepkör
        };

        fetch('/register', { // Küld egy POST kérést a "/register" útvonalra
            method: 'POST', // A kérés típusa
            headers: {
                'Content-Type': 'application/json' // Beállítja a kérés fejlécét JSON formátumra
            },
            body: JSON.stringify(data) // Átalakítja az űrlapadatokat JSON formátummá és elküldi
        })
        .then(response => { // A válasz feldolgozása
            if (!response.ok) { // Ellenőrzi, hogy a válasz sikeres volt-e
                throw new Error('Network response was not ok ' + response.statusText); // Dob egy hibát, ha a válasz nem volt sikeres
            }
            return response.text(); // Visszatér a válasszal, ha az sikeres
        })
        .then(result => { // A válasz feldolgozása
            // Mind JSON, mind sima szöveges válasz kezelése
            let message;
            try {
                const jsonResponse = JSON.parse(result); // JSON válasz parsolása
                message = jsonResponse.message; // A JSON válaszüzenet kiolvasása
            } catch (e) {
                message = result; // Ha nem sikerült a JSON parsolása, a szöveges választ használja üzenetként
            }
            if (message === 'User registered.') { // Ellenőrzi, hogy a regisztráció sikeres volt-e
                document.getElementById('registerForm').style.display = 'none'; // Az űrlap elrejtése
                document.getElementById('successMessage').style.display = 'block'; // A sikeres regisztrációs üzenet megjelenítése
            }
        })
        .catch(error => { // Hibakezelés
            console.error('Error:', error); // Kiírja a hibát a konzolra
        });
    });
});

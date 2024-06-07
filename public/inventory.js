// Várja, hogy a DOM teljesen betöltődjön
document.addEventListener('DOMContentLoaded', function() {
    checkAdmin(); // Ellenőrzi, hogy az admin felhasználó be van-e jelentkezve

    // Hozzáadja az eseményfigyelőt az 'Új termék hozzáadása' űrlaphoz
    document.getElementById('addProductForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Megakadályozza az űrlap alapértelmezett elküldését
        const name = document.getElementById('productName').value; // Lekéri a termék nevét
        const description = document.getElementById('productDescription').value; // Lekéri a termék leírását
        const price = document.getElementById('productPrice').value; // Lekéri a termék árát

        // Küld egy POST kérést az új termék hozzáadására
        fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, price }) // Az űrlap adatait JSON formátumban küldi
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText); // Hiba kezelése, ha a válasz nem megfelelő
            }
            return response.json(); // Válasz JSON formátumba konvertálása
        })
        .then(data => {
            location.reload(); // Az oldal újratöltése a sikeres termék hozzáadás után
        })
        .catch(error => console.error('Error adding product:', error)); // Hibaüzenet a konzolban, ha a hozzáadás sikertelen
    });

    // Hozzáadja az eseményfigyelőt az 'Új szolgáltatás hozzáadása' űrlaphoz
    document.getElementById('addServiceForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Megakadályozza az űrlap alapértelmezett elküldését
        const name = document.getElementById('serviceName').value; // Lekéri a szolgáltatás nevét
        const description = document.getElementById('serviceDescription').value; // Lekéri a szolgáltatás leírását
        const price = document.getElementById('servicePrice').value; // Lekéri a szolgáltatás árát

        // Küld egy POST kérést az új szolgáltatás hozzáadására
        fetch('/api/services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, price }) // Az űrlap adatait JSON formátumban küldi
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText); // Hiba kezelése, ha a válasz nem megfelelő
            }
            return response.json(); // Válasz JSON formátumba konvertálása
        })
        .then(data => {
            location.reload(); // Az oldal újratöltése a sikeres szolgáltatás hozzáadás után
        })
        .catch(error => console.error('Error adding service:', error)); // Hibaüzenet a konzolban, ha a hozzáadás sikertelen
    });
});

// Ellenőrzi, hogy az admin felhasználó be van-e jelentkezve
function checkAdmin() {
    fetch('/admin', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(message => {
        if (message === 'Access denied.') {
            document.getElementById('errorMessage').innerText = 'Nincs jogosultságod az oldalhoz!'; // Hibaüzenet megjelenítése
            document.getElementById('errorMessage').style.display = 'block'; // Hibaüzenet láthatóvá tétele
        } else {
            document.getElementById('adminContent').style.display = 'block'; // Admin tartalom láthatóvá tétele
            fetchProducts(); // Termékek betöltése
            fetchServices(); // Szolgáltatások betöltése
        }
    })
    .catch(error => console.error('Error:', error)); // Hibaüzenet a konzolban, ha az ellenőrzés sikertelen
}

// Termékek betöltése
function fetchProducts() {
    fetch('/api/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText); // Hiba kezelése, ha a válasz nem megfelelő
            }
            return response.json(); // Válasz JSON formátumba konvertálása
        })
        .then(products => {
            const productTableBody = document.querySelector('#productTable tbody'); // Termékek táblázatának törzse
            products.forEach(product => {
                const tr = document.createElement('tr'); // Új sor létrehozása a táblázatban
                tr.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td>${product.price}</td>
                    <td>
                        <button onclick="deleteProduct(${product.id})">Törlés</button>
                        <button onclick="editProduct(${product.id}, '${product.name}', '${product.description}', ${product.price})">Módosítás</button>
                    </td>
                `;
                productTableBody.appendChild(tr); // Sor hozzáadása a táblázathoz
            });
        })
        .catch(error => console.error('Error fetching products:', error)); // Hibaüzenet a konzolban, ha a termékek betöltése sikertelen
}

// Szolgáltatások betöltése
function fetchServices() {
    fetch('/api/services')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText); // Hiba kezelése, ha a válasz nem megfelelő
            }
            return response.json(); // Válasz JSON formátumba konvertálása
        })
        .then(services => {
            const serviceTableBody = document.querySelector('#serviceTable tbody'); // Szolgáltatások táblázatának törzse
            services.forEach(service => {
                const tr = document.createElement('tr'); // Új sor létrehozása a táblázatban
                tr.innerHTML = `
                    <td>${service.name}</td>
                    <td>${service.description}</td>
                    <td>${service.price}</td>
                    <td>
                        <button onclick="deleteService(${service.id})">Törlés</button>
                        <button onclick="editService(${service.id}, '${service.name}', '${service.description}', ${service.price})">Módosítás</button>
                    </td>
                `;
                serviceTableBody.appendChild(tr); // Sor hozzáadása a táblázathoz
            });
        })
        .catch(error => console.error('Error fetching services:', error)); // Hibaüzenet a konzolban, ha a szolgáltatások betöltése sikertelen
}

// Termék törlése
function deleteProduct(id) {
    fetch(`/api/products/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText); // Hiba kezelése, ha a válasz nem megfelelő
        }
        return response.json(); // Válasz JSON formátumba konvertálása
    })
    .then(data => {
        location.reload(); // Az oldal újratöltése a sikeres törlés után
    })
    .catch(error => console.error('Error deleting product:', error)); // Hibaüzenet a konzolban, ha a törlés sikertelen
}

// Szolgáltatás törlése
function deleteService(id) {
    fetch(`/api/services/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText); // Hiba kezelése, ha a válasz nem megfelelő
        }
        return response.json(); // Válasz JSON formátumba konvertálása
    })
    .then(data => {
        location.reload(); // Az oldal újratöltése a sikeres törlés után
    })
    .catch(error => console.error('Error deleting service:', error)); // Hibaüzenet a konzolban, ha a törlés sikertelen
}

// Termék szerkesztése
function editProduct(id, name, description, price) {
    const newName = prompt("Új név:", name); // Új név bekérése
    const newDescription = prompt("Új leírás:", description); // Új leírás bekérése
    const newPrice = prompt("Új ár:", price); // Új ár bekérése

    // Küld egy PUT kérést a termék módosítására
    fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName, description: newDescription, price: newPrice }) // A módosított adatokat JSON formátumban küldi
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText); // Hiba kezelése, ha a válasz nem megfelelő
        }
        return response.json(); // Válasz JSON formátumba konvertálása
    })
    .then(data => {
        location.reload(); // Az oldal újratöltése a sikeres módosítás után
    })
    .catch(error => console.error('Error editing product:', error)); // Hibaüzenet a konzolban, ha a módosítás sikertelen
}

// Szolgáltatás szerkesztése
function editService(id, name, description, price) {
    const newName = prompt("Új név:", name); // Új név bekérése
    const newDescription = prompt("Új leírás:", description); // Új leírás bekérése
    const newPrice = prompt("Új ár:", price); // Új ár bekérése

    // Küld egy PUT kérést a szolgáltatás módosítására
    fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName, description: newDescription, price: newPrice }) // A módosított adatokat JSON formátumban küldi
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText); // Hiba kezelése, ha a válasz nem megfelelő
        }
        return response.json(); // Válasz JSON formátumba konvertálása
    })
    .then(data => {
        location.reload(); // Az oldal újratöltése a sikeres módosítás után
    })
    .catch(error => console.error('Error editing service:', error)); // Hibaüzenet a konzolban, ha a módosítás sikertelen
}

console.log("products.js loaded"); // Megjeleníti a "products.js loaded" üzenetet a konzolon

fetch('/api/products')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(products => {
        console.log(products); // Megjeleníti a letöltött termékek objektumait a konzolon
        const tbody = document.querySelector('#productTable tbody');
        if (!tbody) {
            throw new Error('productTable tbody element not found');
        }
        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
            `;
            tbody.appendChild(tr);
        });

        // Kereső funkció hozzáadása a termékek betöltése után
        addProductSearchFunctionality();
    })
    .catch(error => console.error('Error fetching products:', error));

function addProductSearchFunctionality() {
    const productSearchInput = document.getElementById('productSearchInput');
    const productRows = document.querySelectorAll('#productTable tbody tr');

    productSearchInput.addEventListener('input', function() {
        const searchTerm = productSearchInput.value.toLowerCase().trim();

        productRows.forEach(row => {
            const name = row.getElementsByTagName('td')[0].innerText.toLowerCase();
            if (name.includes(searchTerm)) {
                row.style.display = ''; // Megjeleníti a sorokat, amelyekben a keresett szöveg megtalálható
            } else {
                row.style.display = 'none'; // Elrejti azokat a sorokat, amelyekben a keresett szöveg nem található meg
            }
        });
    });
}

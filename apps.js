// Szükséges modulok importálása
const express = require('express'); // Express framework az alkalmazás szerver létrehozásához
const mysql = require('mysql'); // MySQL adatbázis kezelése
const bcrypt = require('bcryptjs'); // Jelszó hasheléshez és ellenőrzéshez
const jwt = require('jsonwebtoken'); // JWT tokenek kezelése
const bodyParser = require('body-parser'); // Kérések body-jának feldolgozása
const cookieParser = require('cookie-parser'); // Cookie-k feldolgozása
const session = require('express-session'); // Session kezelés
const path = require('path'); // Fájlrendszer útvonalak kezelése
const fs = require('fs'); // Fájlrendszer kezelése

// Express alkalmazás létrehozása
const app = express();

// Body parser middleware konfigurálása
app.use(bodyParser.json({ limit: '10mb' })); // Megnövelt limit nagy fájlokhoz
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie parser middleware hozzáadása
app.use(cookieParser());

// Session kezelés beállítása
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));

// Publikus könyvtár kiszolgálása
app.use(express.static(path.join(__dirname, 'public')));

// Middleware a helyes MIME típus beállításához a JavaScript fájlokhoz
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'text/javascript');
        }
    }
}));

// MySQL adatbázis kapcsolat létrehozása
const db = mysql.createConnection({
    host: 'localhost', // Adatbázis szerver címe
    user: 'root', // Adatbázis felhasználó
    password: '1324@David', // Adatbázis jelszó
    database: 'myproject' // Adatbázis neve
});

// Kapcsolódás az adatbázishoz
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected.');
});

// Regisztráció végpont
app.post('/register', (req, res) => {
    const { username, email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10); // Jelszó hashelése

    // Felhasználó hozzáadása az adatbázishoz
    db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, role], (err, result) => {
        if (err) throw err;
        res.json({ message: 'User registered.' });
    });
});

// Bejelentkezés végpont
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Felhasználó lekérdezése az adatbázisból
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(401).send('Authentication failed.');
        }

        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password); // Jelszó ellenőrzése
        if (!isPasswordValid) {
            return res.status(401).send('Authentication failed.');
        }

        // JWT token generálása
        const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true }); // Token mentése cookie-ba
        res.send('Logged in successfully.');
    });
});

// Kijelentkezés végpont
app.post('/logout', (req, res) => {
    res.clearCookie('token'); // Token törlése a cookie-ból
    res.send('Logged out successfully.');
});

// Middleware a bejelentkezés ellenőrzéséhez
const isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Access denied. Please log in.');
    }

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token.');
        }
        req.user = user; // Felhasználói adatok hozzáadása a kéréshez
        next(); // Tovább a következő middleware-hez vagy végponthoz
    });
};

// GET végpont a termékek lekérdezésére
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

// Middleware a felhasználó hitelesítéséhez
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Access denied.');
    }

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token.');
        }
        req.user = user; // Felhasználói adatok hozzáadása a kéréshez
        next(); // Tovább a következő middleware-hez vagy végponthoz
    });
};

// Middleware a szerepkör ellenőrzéséhez
const authorizeRole = (role) => {
    return (req, res, next) => {
        // Csak bejelentkezett felhasználók esetén ellenőrizzük a szerepkört
        if (req.user && req.user.role === role) {
            next(); // Tovább a következő middleware-hez vagy végponthoz
        } else {
            return res.status(403).send('Access denied.');
        }
    };
};

// Az inventory.html oldal elérésének engedélyezése csak adminok számára
app.get('/inventory.html', authorizeRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inventory.html')); // inventory.html oldal kiszolgálása
});

// Új termék hozzáadása
app.post('/api/products', (req, res) => {
    const { name, description, price } = req.body;
    const query = 'INSERT INTO products (name, description, price) VALUES (?, ?, ?)';
    db.query(query, [name, description, price], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.status(201).json({ message: 'Product added successfully', productId: results.insertId });
    });
});

// Új szolgáltatás hozzáadása
app.post('/api/services', (req, res) => {
    const { name, description, price } = req.body;
    const query = 'INSERT INTO services (name, description, price) VALUES (?, ?, ?)';
    db.query(query, [name, description, price], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.status(201).json({ message: 'Service added successfully', serviceId: results.insertId });
    });
});

// Fájl feltöltése
app.post('/api/upload', (req, res) => {
    const { fileName, fileContent } = req.body;
    const base64Data = fileContent.replace(/^data:image\/\w+;base64,/, ""); // Base64 adat leválasztása
    const filePath = path.join('C:\\Users\\arvai\\OneDrive\\Asztali gép\\Webtech\\project-root\\Kepe_Pdfek', fileName); // A fájl mentése a megadott mappába

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            res.status(500).json({ error: 'Error saving file' });
            return;
        }
        res.status(200).json({ message: 'File saved successfully', filePath });
    });
});

// GET végpont a termékek lekérdezésére (újra definiálva)
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

// GET végpont a szolgáltatások lekérdezésére
app.get('/api/services', (req, res) => {
    const query = 'SELECT * FROM services';
    db.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

// Termék törlése
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

// Szolgáltatás törlése
app.delete('/api/services/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM services WHERE id = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ message: 'Service deleted successfully' });
    });
});

// Termék frissítése
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const query = 'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?';
    db.query(query, [name, description, price, id], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ message: 'Product updated successfully' });
    });
});

// Szolgáltatás frissítése
app.put('/api/services/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const query = 'UPDATE services SET name = ?, description = ?, price = ? WHERE id = ?';
    db.query(query, [name, description, price, id], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ message: 'Service updated successfully' });
    });
});

// Profil végpont - bejelentkezett felhasználó adatai
app.get('/profile', authenticateJWT, (req, res) => {
    db.query('SELECT username FROM users WHERE id = ?', [req.user.id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// Elérési jog ellenőrzése middleware (admin)
function checkAdmin(req, res, next) {
    const user = req.user; // Feltételezzük, hogy az aktuális felhasználói adatok a req.user-ben vannak
    if (!user || !user.isAdmin) {
        return res.status(403).send('Access denied.');
    }
    next(); // Tovább a következő middleware-hez vagy végponthoz
}

// Oldal kiszolgálása (admin)
app.get('/inventory', checkAdmin, (req, res) => {
    res.sendFile(__dirname + '/inventory.html'); // inventory.html oldal kiszolgálása
});

// Példa végpontok
app.get('/user', authenticateJWT, (req, res) => {
    res.send('Welcome, user!');
});

app.get('/admin', authenticateJWT, authorizeRole('admin'), (req, res) => {
    res.send('Welcome, admin!');
});

// 404-es hiba kezelés
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// 500-as hiba kezelés
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Szerver indítása
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

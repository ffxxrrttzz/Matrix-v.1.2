const pages = [
    'about', 'checkout',
    'competitor-analysis', 'contact', 'content-marketing', 'creative-approach',
    'error', 'faq', 'guaranteed-success',
    'keyword-research', 'price', 'product-cart', 'product-details', 'product',
    'seo-counsultancy', 'service-details', 'service', 'team-details', 'team',
    'testimonial', 'branding', 'сorporate', 'online-stores', 'landing-site', 'mobile-applications',
    'search-engine-promotion', 'contextual-advertising', 'media-advertising', 'advertising-on-social-networks',
    'website-audit', 'development-strategies', 'increasing-conversion',
    'reputation-management', 'ideas-and-concepts', 'animation-and-characters', 'web-design'
];

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:3000', 'https://gkvertikal.pro', 'https://www.gkvertikal.pro'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Правильно определяем пути
const rootDir = path.dirname(__dirname); // Поднимаемся на уровень выше matrix-server
const assetsPath = path.join(rootDir, 'assets');
const pagesDir = path.join(rootDir, 'pages'); // Добавляем путь к папке pages

// Serve static files from assets folder
app.use('/assets', express.static(assetsPath));

// Главная страница (index.html остается в корне)
app.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, 'index.html'));
});

pages.forEach(page => {
    // Маршрут без .html
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(pagesDir, `${page}.html`));
    });
});

// Обработчик контактной формы
app.post('/contact', (req, res) => {
    const { username, email, subject, message, agree } = req.body;

    console.log('📧 New contact form submission:');
    console.log('Name:', username);
    console.log('Email:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('Agreed to terms:', agree);

    res.json({
        success: true,
        message: 'Message received successfully!',
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        server: 'HTTPS Express',
        timestamp: new Date().toISOString()
    });
});

// Простой fallback без параметров
app.use((req, res) => {
    res.sendFile(path.join(rootDir, 'error.html'));
});

// Конфигурация домена (ЗАМЕНИТЕ НА ВАШ ДОМЕН)
const DOMAIN = 'gkvertikal.pro';

// Функция запуска HTTPS сервера
function startHttpsServer() {
    try {
        const certDir = `/etc/letsencrypt/live/${DOMAIN}`;
        const options = {
            key: fs.readFileSync(path.join(certDir, 'privkey.pem')),
            cert: fs.readFileSync(path.join(certDir, 'fullchain.pem'))
        };

        // HTTPS сервер на порту 443
        https.createServer(options, app).listen(443, () => {
            console.log(`🔒 HTTPS server running on port 443`);
            console.log(`🌐 Secure URL: https://${DOMAIN}/`);
            console.log(`📞 Contact page: https://${DOMAIN}/contact`);
            console.log(`❤️ Health check: https://${DOMAIN}/health`);
        });

    } catch (error) {
        console.error('❌ Error starting HTTPS server:', error.message);
        console.log('💡 Run this command first to get SSL certificates:');
        console.log('sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com --agree-tos -m you@yourdomain.com');
        process.exit(1);
    }
}

// HTTP редирект сервер на порту 80
function startHttpRedirectServer() {
    http.createServer((req, res) => {
        const host = req.headers.host?.replace(/:\d+$/, '') || DOMAIN;
        res.writeHead(301, { 
            Location: `https://${host}${req.url}` 
        });
        res.end();
    }).listen(80, () => {
        console.log('🔄 HTTP redirect server running on port 80');
    });
}

// Запуск серверов
console.log(`🚀 Starting HTTPS Express Server...`);
console.log(`📁 Root directory: ${rootDir}`);
console.log(`📁 Assets path: ${assetsPath}`);
console.log(`📁 Pages directory: ${pagesDir}`);

startHttpRedirectServer();
startHttpsServer();
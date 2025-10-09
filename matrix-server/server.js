const express = require('express');
const cors = require('cors');
const path = require('path');
// const fs = require('fs');
const app = express();
const http = require('http');
const https = require('https');
const PORT = 3000;
// const PORT = 443;

// Middleware
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:3000', 'https://gkvertikal.pro', 'https://www.gkvertikal.pro'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка EJS как шаблонизатора 
app.set('view engine', 'ejs'); // Теперь Express будет рендерить .ejs файлы
// Указываем папку, где хранятся шаблоны (теперь это 'views', а не 'pages')
app.set('views', [
    path.join(__dirname, '..'),           // корневая папка
    path.join(__dirname, '..', 'views'),  // папка views
    path.join(__dirname, '..', 'partials') // папка partials
]);


// Serve static files from assets folder
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// Список всех страниц
const pages = [
    'about', 'blog-details', 'blog-grid', 'blog', 'cart', 'checkout',
    'competitor-analysis', 'contact', 'content-marketing', 'creative-approach',
    'error', 'faq', 'guaranteed-success', 'index',
    'keyword-research', 'price', 'product-cart', 'product-details', 'product',
    'seo-counsultancy', 'service-details', 'service', 'team-details', 'team',
    'testimonial', 'branding', 'сorporate', 'online-stores', 'landing-site', 'mobile-applications', 
    'search-engine-promotion', 'contextual-advertising', 'media-advertising', 'advertising-on-social-networks', 
    'website-audit', 'development-strategies', 'increasing-conversion', 
    'reputation-management', 'ideas-and-concepts', 'animation-and-characters', 'web-design', 'corporate'
];


// Главная страница
app.get('/', (req, res) => {
    res.render('index');
});

// Страница ошибки (error.ejs находится в корне)
app.get('/error', (req, res) => {
    res.render('error');
});

// Динамические маршруты для всех страниц
pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        // Указываем путь относительно папки views
        res.render(path.join('views', page));
    });
});

// Обработчик контактной формы
app.post('/contact', (req, res) => {
        // Проверяем, что body парсится правильно
    if (!req.body || Object.keys(req.body).length === 0) {
        console.log('❌ Body is empty or not parsed');
        return res.status(400).json({
            success: false,
            message: 'Invalid request body'
        });
    }
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

// Улучшенный обработчик 404 ошибок
app.use((req, res) => {
    res.status(404).render('error', {
        errorCode: 404,
        errorMessage: 'Страница не найдена'
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Express server running on http://localhost:${PORT}`);
    console.log(`📁 Views directory: ${path.join(__dirname, 'views')}`);
    console.log(`📁 Assets path: ${path.join(__dirname, '..', 'assets')}`);
    console.log(`🌐 Home page: http://localhost:${PORT}/`);
    console.log(`📞 Contact page: http://localhost:${PORT}/contact`);
    console.log(`❌ 404 page: http://localhost:${PORT}/any-wrong-url`);
    console.log(`📄 Total pages: ${pages.length + 1} (including home page)`);
});

// // Конфигурация домена (ЗАМЕНИТЕ НА ВАШ ДОМЕН)
// const DOMAIN = 'gkvertikal.pro';

// // Функция запуска HTTPS сервера
// function startHttpsServer() {
//     try {
//         const certDir = `/etc/letsencrypt/live/${DOMAIN}`;
//         const options = {
//             key: fs.readFileSync(path.join(certDir, 'privkey.pem')),
//             cert: fs.readFileSync(path.join(certDir, 'fullchain.pem'))
//         };

//         // HTTPS сервер на порту 443
//         https.createServer(options, app).listen(443, () => {
//             console.log(`🔒 HTTPS server running on port 443`);
//             console.log(`🌐 Secure URL: https://${DOMAIN}/`);
//             console.log(`📞 Contact page: https://${DOMAIN}/contact`);
//             console.log(`❤️ Health check: https://${DOMAIN}/health`);
//             console.log(`📁 Views directory: ${path.join(__dirname, '..')}`);
//             console.log(`📁 Assets path: ${path.join(__dirname, '..', 'assets')}`);
//         });

//     } catch (error) {
//         console.error('❌ Error starting HTTPS server:', error.message);
//         console.log('💡 Run this command first to get SSL certificates:');
//         console.log('sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com --agree-tos -m you@yourdomain.com');
//         process.exit(1);
//     }
// }

// // HTTP редирект сервер на порту 80
// function startHttpRedirectServer() {
//     http.createServer((req, res) => {
//         const host = req.headers.host?.replace(/:\d+$/, '') || DOMAIN;
//         res.writeHead(301, { 
//             Location: `https://${host}${req.url}` 
//         });
//         res.end();
//     }).listen(80, () => {
//         console.log('🔄 HTTP redirect server running on port 80');
//     });
// }

// // Запуск серверов
// console.log(`🚀 Starting HTTPS Express Server...`);
// startHttpRedirectServer();
// startHttpsServer();

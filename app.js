const Koa = require('koa');
const render = require('koa-ejs');
const serve = require('koa-static');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const port = process.env.PORT || 3000;

const app = new Koa();
const router = new KoaRouter();

// Body Parser
app.use(bodyParser());

// Use static assets
app.use(serve(__dirname + '/assets/'));

// Router Middleware
app.use(router.routes()).use(router.allowedMethods());

// Initalize EJS Template Engine
render(app, {
    root: path.join(__dirname, 'pages'),
    layout: 'index',
    viewExt: 'html',
    cache: false,
    debug: false
});


// Routes
router.get('/', landingPage);
router.post('/thank-you', parseThankYou);
router.get('/thank-you', thankYou);

// Show Landing Page
async function landingPage(ctx) {
    await ctx.render('landing-page', {
        title: 'RSVP',
        className: 'container'
    });
}

// Show Thank You Page
async function thankYou(ctx) {

    let cookie = ctx.cookies.get('demo-requested');

    if (cookie) {
        cookie = JSON.parse(cookie);
        await ctx.render('thank-you', {
            title: 'Thank You',
            className: '',
            firstName: cookie.firstName,
            lastName: cookie.lastName,
            email: cookie.email,
            guests: cookie.guests
        });
    } else {
        ctx.redirect('/');
    }
}

// Add User Information
async function parseThankYou(ctx) {
    const body = ctx.request.body;

    // Store Cookie Session
    const cookieObj = {};

    for (let values in body) {
        cookieObj[values] = body[values];
    }

    // Expire cookie session in 7 minutes
    const sevenMinutes = 420000 + Date.now();

    ctx.cookies.set('demo-requested', JSON.stringify(cookieObj), {
        httpOnly: false,
        expires: new Date(sevenMinutes)
    });

    ctx.redirect('/thank-you');
}

app.listen(port, console.log(`Listening at port ${port}`));
# SparkCrux Website

A modern, responsive website for SparkCrux digital agency built with HTML, CSS, JavaScript, and a complete Node.js backend.

## Features

- **Dark theme** with electric orange (#FF5C00) accent color
- **Responsive design** that works on all devices
- **Smooth animations** and scroll effects
- **Interactive navbar** with transparent-to-blur scroll effect
- **Form handling** with validation and database storage
- **Rate limiting** and security protection
- **Admin dashboard** for viewing submissions
- **SEO optimized** with proper meta tags and sitemap
- **Security headers** and input sanitization
- **Mobile-friendly** hamburger menu

## Pages

- **Home** (`index.html`) - Hero, services overview, testimonials, CTA
- **About** (`pages/about.html`) - Company story, values, team
- **Services** (`pages/services.html`) - Detailed service descriptions
- **Pricing** (`pages/pricing.html`) - Pricing tiers and FAQ
- **Portfolio** (`pages/portfolio.html`) - Project showcase
- **Blog** (`pages/blog.html`) - Blog posts and newsletter
- **Contact** (`pages/contact.html`) - Contact forms and free audit

## Backend Features

- **Node.js/Express server** with SQLite database
- **Form submission handling** with validation and sanitization
- **Rate limiting** (3 submissions per IP per hour)
- **Security headers** and CSP protection
- **Admin dashboard** at `/admin` (password protected)
- **API endpoints** for contact and audit forms
- **Database storage** with automatic table creation

## Technologies Used

### Frontend
- **HTML5** semantic markup
- **CSS3** with CSS variables and Grid/Flexbox
- **Vanilla JavaScript** (no frameworks)
- **Google Fonts** (Inter + Space Grotesk)

### Backend
- **Node.js** with Express.js
- **SQLite** database (file-based, no setup needed)
- **Helmet.js** for security headers
- **Express-rate-limit** for rate limiting
- **Validator.js** for input validation
- **dotenv** for environment variables

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   - **Website**: http://localhost:3000
   - **Admin Dashboard**: http://localhost:3000/admin?password=sparkcrux2025

### Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Key environment variables:
- `PORT` - Server port (default: 3000)
- `ADMIN_PASSWORD` - Password for admin dashboard
- `DATABASE_PATH` - SQLite database file location
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per hour per IP

## API Endpoints

### POST /api/contact
Handles contact form submissions.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "website": "https://example.com",
  "service": "seo",
  "budget": "$1000-2000",
  "message": "I need help with SEO",
  "source": "google"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully"
}
```

### POST /api/audit
Handles free audit requests.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "website_url": "https://example.com",
  "audit_type": "seo"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Audit request submitted successfully"
}
```

## Database Schema

### contact_submissions
- `id` - Primary key (auto increment)
- `name` - Contact name (required)
- `email` - Email address (required)
- `website` - Website URL (optional)
- `service` - Service interest (required)
- `budget` - Budget range (optional)
- `message` - Message content (required)
- `source` - How they found us (optional)
- `ip_address` - Client IP for rate limiting
- `created_at` - Timestamp (auto)

### audit_requests
- `id` - Primary key (auto increment)
- `name` - Contact name (required)
- `email` - Email address (required)
- `website_url` - Website to audit (required)
- `audit_type` - Type of audit: 'seo', 'website', 'social' (required)
- `goal` - Audit goals (optional)
- `ip_address` - Client IP for rate limiting
- `created_at` - Timestamp (auto)

## Security Features

- **Content Security Policy** (CSP) headers
- **XSS protection** with input sanitization
- **Rate limiting** to prevent spam
- **SQL injection protection** with parameterized queries
- **HTTPS enforcement** ready
- **Secure headers** (X-Frame-Options, X-Content-Type-Options, etc.)

## Admin Dashboard

Access the admin dashboard at `/admin?password=YOUR_ADMIN_PASSWORD`.

Features:
- View all contact submissions
- View all audit requests
- Sortable by date (newest first)
- Simple, clean interface
- Password protected

## File Structure

```
wcrux/
├── index.html              # Home page
├── server.js               # Node.js backend server
├── package.json            # Node.js dependencies
├── .env.example            # Environment variables template
├── .env                    # Environment variables (gitignored)
├── .gitignore              # Git ignore file
├── sitemap.xml            # XML sitemap
├── robots.txt             # Robots.txt file
├── README.md              # This file
├── css/
│   ├── style.css          # Main styles
│   └── animations.css     # Animation styles
├── js/
│   └── main.js            # Main JavaScript
├── pages/
│   ├── about.html         # About page
│   ├── services.html      # Services page
│   ├── pricing.html       # Pricing page
│   ├── portfolio.html     # Portfolio page
│   ├── blog.html          # Blog page
│   └── contact.html       # Contact page
├── database/              # SQLite database (auto-created)
│   └── sparkcrux.db      # Database file
└── assets/
    ├── images/            # Image assets
    └── icons/             # Icon assets
```

## Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon for automatic server restart on file changes.

### Database Management
The SQLite database is automatically created when the server starts. No manual setup is needed.

To reset the database:
```bash
rm database/sparkcrux.db
npm start
```

## Deployment

### Environment Setup
1. Set production environment variables
2. Update `ADMIN_PASSWORD` to a secure value
3. Configure your domain in the sitemap

### Deploy to VPS
```bash
# Install dependencies
npm install --production

# Start with PM2 (recommended)
pm2 start server.js --name sparkcrux

# Or start directly
NODE_ENV=production npm start
```

### Deploy to Platform as a Service
- **Railway**: Connect GitHub repo, set environment variables
- **Render**: Connect GitHub repo, set environment variables
- **Heroku**: Add PostgreSQL (modify database code)

## Performance

- **Optimized CSS** with variables and efficient selectors
- **Minimal JavaScript** (no heavy frameworks)
- **Efficient animations** using CSS transforms
- **Database indexing** on timestamps
- **Rate limiting** to prevent abuse
- **Static file serving** via Express

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Monitoring and Logs

The server logs:
- Database operations
- Form submissions
- Rate limiting hits
- Error details

Check the console output when running the server for real-time logs.

## License

This project is proprietary to SparkCrux. All rights reserved.

## Support

For questions about this website or backend:
- Email: hello@sparkcrux.com
- Phone: +1 (555) 123-4567

## Next Steps

1. **Configure production environment variables**
2. **Set up proper domain and SSL**
3. **Add email notifications** for form submissions
4. **Implement proper admin authentication** (sessions/JWT)
5. **Add database backups** for production
6. **Set up monitoring** and error tracking

<<<<<<< HEAD
# VITALR Technologies - Cybersecurity & Homelab Education Platform

A modern, full-stack web application focused on cybersecurity and homelab education with hands-on learning experiences.

## Features

- **Dark Custom Theme**: Professional design with VITALR branding
- **Interactive Learning**: Code examples with copy functionality
- **Real-Time Search**: Find documentation and resources quickly
- **Mobile Responsive**: Works perfectly on all devices
- **Database-Driven**: PostgreSQL backend with persistent content
- **Community Features**: Stats, engagement metrics, and social links

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + Drizzle ORM
- **Database**: PostgreSQL (Neon serverless)
- **Deployment**: Ready for Vercel, Railway, or Render

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Create .env file with:
   DATABASE_URL=your_postgresql_connection_string
   ```

3. **Initialize database:**
   ```bash
   npm run db:push
   npx tsx server/seed.ts
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   ```
   http://localhost:5000
   ```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy automatically

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy with built-in PostgreSQL

## Project Structure

```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   └── lib/          # Utilities and client config
├── server/           # Node.js backend
│   ├── db.ts            # Database connection
│   ├── routes.ts        # API endpoints
│   ├── seed.ts          # Database seeding
│   └── storage.ts       # Data access layer
├── shared/           # Shared types and schemas
└── dist/             # Static build output
```

## Content Areas

- **Networking**: Enterprise networking, VLANs, routing
- **Cybersecurity**: Security frameworks, threat analysis
- **System Administration**: Linux, automation, infrastructure
- **Homelab**: Self-hosted services, containerization

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is built for educational purposes. Feel free to use and modify for your learning platform.

## Support

For questions or support, reach out through the community channels or create an issue.

---

Built with privacy and control in mind. 🛡️
=======
# Website
This is for cloud access on my website anywhere
>>>>>>> 9a2628e93fe0bd44cfe0ef9503c9c21eb868377f

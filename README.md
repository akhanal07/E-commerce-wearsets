# EchoPulse

A modern full-stack e-commerce application built with Next.js, and Stripe payment integration.

## Features

- Browse and purchase products
- Shopping cart functionality
- Secure checkout with Stripe
- Responsive design for all devices
- Server-side rendering with Next.js

## Technologies Used

- **Frontend**: Next.js, React
- **Styling**: CSS Modules
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Payments**: Stripe
- **Deployment**: Vercel (recommended)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see .env.example)
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file in the root directory and add the following:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```


## Acknowledgments

- Built with by Ayush

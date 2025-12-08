This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

A multilingual personal portfolio and CV built with Next.js 15, featuring project highlights, skills, contact forms, and booking functionality.

## Prerequisites

Before installing, make sure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn** / **pnpm** / **bun**

## Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd hilmar-cv/my-cv-site
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**:
   
   Create a `.env.local` file in the `my-cv-site` directory with the following variables:

   ```env
   # Microsoft Graph API (Required for contact form and booking functionality)
   MS_CLIENT_ID=your_microsoft_client_id
   MS_CLIENT_SECRET=your_microsoft_client_secret
   MS_TENANT_ID=your_microsoft_tenant_id
   SMTP_USER=your_email@domain.com

   # Site Configuration (Optional but recommended)
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   GOOGLE_SITE_VERIFICATION=your_google_verification_code

   # Analytics (Optional - for production)
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
   ```

   **Note**: 
   - The Microsoft Graph API credentials are required if you want the contact form and booking features to work
   - Analytics variables are optional and only used in production
   - If `NEXT_PUBLIC_SITE_URL` is not set, the site will use a default value

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**:
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the result.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server (after building)
- `npm run lint` - Run ESLint to check for code issues

## Project Structure

This project uses the Next.js App Router with:
- **Internationalization (i18n)** - Supports multiple languages (English/Dutch)
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Microsoft Graph API** - For email sending and calendar integration
- **SEO Optimization** - Comprehensive SEO implementation

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

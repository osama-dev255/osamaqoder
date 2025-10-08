# Railway POS System

A professional Point of Sale (POS) system built with React, TypeScript, Tailwind CSS, and shadcn/ui components. This application connects to a Google Sheets backend for data storage and management, with a modern UI featuring animations and a professional splash screen.

## Recent Enhancements

- ✨ **Splash Screen**: Added a professional animated splash screen
- 🎨 **Redesigned Login Page**: Modern glass-morphism design with enhanced UX
- 🌟 **UI Animations**: Smooth framer-motion animations throughout the application
- 🚀 **Improved User Experience**: Enhanced transitions and visual feedback
- 👥 **Enhanced User Management**: Comprehensive user management guide and improved authentication

## Features

- 🛒 **Complete POS Functionality**: Product management, sales processing, and inventory tracking
- 👤 **Authentication & Authorization**: Role-based access control (admin, manager, cashier)
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🖨️ **Receipt Printing**: Generate and print professional receipts
- 📊 **Data Visualization**: Charts and reports for business insights
- 📤 **Export Capabilities**: Export data to CSV, Excel, and JSON formats
- 📋 **Pagination**: Efficient data handling for large datasets
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS and shadcn/ui
- ✨ **Animated Experience**: Smooth animations powered by framer-motion
- 🚀 **Professional Branding**: Cohesive design language throughout the application

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Git

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Environment Variables

Create a `.env` file in the root directory with the following:
```env
VITE_BACKEND_URL=https://google-sheets-rest-api-production.up.railway.app
```

### Building for Production

To create a production build:
```bash
npm run build
```

The build files will be output to the `dist` directory.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── SplashScreen/     # Splash screen component
│   ├── ui/               # shadcn/ui components
│   └── ...               # Other components
├── config/               # Configuration files
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utility functions
├── pages/                # Page components
├── services/             # API service functions
├── types/                # TypeScript types
├── App.tsx               # Main application component
└── main.tsx              # Application entry point
```

## Technologies Used

- [React 18](https://reactjs.org/) with TypeScript
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) components
- [React Router](https://reactrouter.com/) for navigation
- [Axios](https://axios-http.com/) for HTTP requests
- [Recharts](https://recharts.org/) for data visualization
- [Lucide React](https://lucide.dev/) for icons
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Vite](https://vitejs.dev/) for build tooling

## Backend Integration

The frontend connects to a Google Sheets REST API backend hosted at:
`https://google-sheets-rest-api-production.up.railway.app`

### API Endpoints

- `GET /api/v1/sheets/metadata` - Get spreadsheet metadata
- `GET /api/v1/sheets/all` - Get all sheets data
- `GET /api/v1/sheets/{sheetName}` - Get specific sheet data
- `POST /api/v1/sheets/{sheetName}/append` - Append data to sheet
- `PUT /api/v1/sheets/{sheetName}/range/{range}` - Update sheet range
- `DELETE /api/v1/sheets/{sheetName}/clear` - Clear sheet data

## User Management

For detailed information about user management, including:
- Role-based permissions
- Adding and modifying users
- Security best practices
- Troubleshooting common issues

Please refer to the [User Management Guide](USER_MANAGEMENT_GUIDE.md).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run health` - Check backend health

## Deployment

### GitHub Pages

1. Update the `homepage` field in `package.json` to your GitHub Pages URL:
   ```json
   "homepage": "https://<your-username>.github.io/<repository-name>"
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run build
   npx gh-pages -d dist
   ```

### Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set the build command to: `npm run build`
4. Set the publish directory to: `dist`
5. Add the following environment variable in Netlify:
   - Key: `VITE_BACKEND_URL`
   - Value: `https://google-sheets-rest-api-production.up.railway.app`

## Recent Updates

### Splash Screen & Login Page Enhancements
- Added a professional animated splash screen with gradient effects
- Completely redesigned the login page with modern glass-morphism design
- Implemented smooth animations using framer-motion throughout the application
- Enhanced dashboard with staggered animations for improved user experience

### UI/UX Improvements
- Improved visual hierarchy and spacing
- Added better feedback for user interactions
- Enhanced form elements with improved styling
- Added professional loading states and transitions

## Learn More

To learn more about the technologies used in this project:

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Framer Motion Documentation](https://www.framer.com/docs/)
- [Vite Documentation](https://vitejs.dev/)

## Support

For issues and feature requests, please [create an issue](../../issues) on GitHub.
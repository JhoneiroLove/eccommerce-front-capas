# EcommerceCapas - React Frontend

A modern ecommerce frontend application built with React, TypeScript, and layered architecture principles.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite
- **Layered Architecture**: Clean separation of concerns with presentation, business, and data layers
- **State Management**: Zustand for global state management
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6 with type-safe routes
- **API Integration**: Axios with interceptors and error handling
- **Responsive Design**: Mobile-first approach with responsive components
- **Type Safety**: Full TypeScript implementation

## 📁 Project Structure

```
src/
├── presentation/          # UI Layer
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── layouts/          # Layout components
│   └── hooks/            # Custom React hooks
├── business/             # Business Logic Layer
│   ├── services/         # Business logic services
│   ├── stores/           # Global state management (Zustand)
│   └── usecases/         # Use cases/application services
├── data/                 # Data Access Layer
│   ├── api/              # API client configuration
│   ├── repositories/     # Data repositories
│   └── models/           # Data models
├── shared/               # Shared Resources
│   ├── utils/            # Utility functions
│   ├── constants/        # Application constants
│   └── components/       # Shared UI components
└── types/                # TypeScript type definitions
```

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-capas
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env` as needed.

## 🏃‍♂️ Running the Application

### Development
```bash
npm run dev
```
Opens the app at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🧪 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🏗️ Architecture Principles

### Layered Architecture

1. **Presentation Layer** (`src/presentation/`)
   - React components, pages, and layouts
   - UI-specific hooks and logic
   - Handles user interactions and displays data

2. **Business Layer** (`src/business/`)
   - Contains business logic and rules
   - Services for complex operations
   - State management stores
   - Use cases and application services

3. **Data Layer** (`src/data/`)
   - API communication
   - Data repositories with CRUD operations
   - Data models and transformations

4. **Shared Layer** (`src/shared/`)
   - Common utilities and helpers
   - Constants and configuration
   - Reusable components and functions

### Key Benefits

- **Separation of Concerns**: Each layer has a specific responsibility
- **Maintainability**: Changes in one layer don't affect others
- **Testability**: Each layer can be tested independently
- **Scalability**: Easy to add new features and modify existing ones
- **Reusability**: Shared components and utilities

## 🎨 Styling

The project uses Tailwind CSS with a custom design system:

- **Color Palette**: Primary blues with semantic colors
- **Components**: Pre-built component classes (`.btn-primary`, `.card`, etc.)
- **Responsive**: Mobile-first responsive design
- **Customization**: Extended Tailwind config with custom colors and utilities

## 🔧 State Management

Using Zustand for state management:

- **Cart Store**: Shopping cart state and operations
- **User Store**: User authentication and profile (to be implemented)
- **Product Store**: Product-related state (to be implemented)

## 🚀 Deployment

The application can be deployed to any static hosting service:

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting service

### Environment Variables

Make sure to set the following environment variables in your deployment:

- `VITE_API_BASE_URL`: Backend API URL
- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Application version

## 🤝 Contributing

1. Follow the established architecture patterns
2. Use TypeScript for all new code
3. Follow the existing code style and naming conventions
4. Test your changes before submitting

## 📝 License

This project is licensed under the MIT License.

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Product management (CRUD operations)
- [ ] Order management system
- [ ] Payment integration
- [ ] Search and filtering functionality
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Admin dashboard
- [ ] PWA capabilities
- [ ] Internationalization (i18n)
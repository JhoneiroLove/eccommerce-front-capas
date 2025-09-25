# EcommerceCapas Frontend

Una aplicación e-commerce frontend construida con React 18, TypeScript y Vite, siguiendo principios SOLID y arquitectura por capas. Se integra perfectamente con la API Spring Boot backend, implementando autenticación JWT, gestión de roles y upload de imágenes en Base64.

## Tecnologías

- **React 18**
- **TypeScript**
- **Vite** (Build tool y dev server)
- **Tailwind CSS** (Styling)
- **Zustand** (State management)
- **Axios** (HTTP client)
- **React Router DOM** (Routing)
- **Heroicons React** (Icons)

## Arquitectura por Capas

```
src/
├── business/           # Capa de Negocio
│   └── stores/        # Estado global con Zustand
├── data/              # Capa de Datos
│   ├── api/           # Cliente HTTP y configuración
│   └── repositories/ # Repositorios de datos
├── presentation/      # Capa de Presentación
│   ├── components/    # Componentes reutilizables
│   ├── pages/         # Páginas principales
│   └── layouts/       # Layouts de aplicación
├── shared/            # Utilidades Compartidas
│   ├── constants/     # Constantes globales
│   └── utils/         # Funciones utilitarias
└── types/            # Definiciones TypeScript
```

## Funcionalidades por Rol

### Customer Dashboard
- ✅ **Catálogo de productos**: Ver productos disponibles
- ✅ **Búsqueda avanzada**: Filtrar productos por nombre
- ✅ **Carrito de compras**: Agregar productos al carrito
- ✅ **Vista detallada**: Información del producto y vendedor
- ✅ **Stock en tiempo real**: Estado de disponibilidad

### Seller Dashboard
- ✅ **Dashboard analítico**: Métricas de productos y ventas
- ✅ **CRUD completo**: Crear, editar, eliminar productos
- ✅ **Upload de imágenes**: Conversión automática a Base64
- ✅ **Gestión de inventario**: Control de stock y precios
- ✅ **Vista optimizada**: Tabla responsive con acciones rápidas

### Admin Dashboard
- ✅ **Panel de control**: Estadísticas generales del sistema
- ✅ **Gestión de usuarios**: CRUD completo de usuarios
- ✅ **Gestión de productos**: Supervisar todos los productos
- ✅ **Métricas avanzadas**: Distribución por roles, valores de inventario
- ✅ **Control total**: Eliminar usuarios y productos del sistema

## Características Técnicas

### Autenticación y Seguridad
- **JWT Token**: Autenticación automática con interceptors
- **Role-based routing**: Rutas protegidas por roles
- **Persistent sessions**: Estado de autenticación persistente
- **Auto-logout**: Redirección automática en tokens expirados

### Gestión de Estado
- **Zustand stores**: Estado global reactivo y ligero
- **Auth store**: Manejo completo de autenticación
- **Product store**: CRUD de productos con cache inteligente
- **Cart store**: Carrito de compras persistente

### Upload de Imágenes
- **Conversión Base64**: Automática para la API
- **Validación de archivos**: Tipo y tamaño (max 2MB)
- **Preview en tiempo real**: Vista previa antes de subir
- **Redimensionamiento**: Optimización automática de imágenes
- **Eliminación**: Remover imágenes existentes

### UX/UI Optimizada
- **Responsive design**: Mobile-first con Tailwind CSS
- **Loading states**: Indicadores de carga en todas las operaciones
- **Error handling**: Mensajes de error informativos
- **Confirmaciones**: Diálogos para acciones destructivas
- **Estados vacíos**: Placeholders cuando no hay datos

## Setup del Proyecto

### Prerrequisitos

- **Node.js 18+**
- **npm o yarn**
- **Backend Spring Boot** corriendo en `localhost:8080`

### Instalación Rápida

#### 1. Clonar repositorio
```bash
git clone <url-del-repositorio>
cd frontend
```

#### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

#### 3. Configurar variables de entorno
```bash
# Crear archivo .env
cp .env.example .env
```

Contenido del `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_NODE_ENV=development
VITE_APP_NAME=EcommerceCapas
VITE_APP_VERSION=1.0.0
```

#### 4. Ejecutar aplicación
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en: `http://localhost:5173` (Vite) o `http://localhost:3000`

## Usuarios de Demo

### Para Testing Completo

| Usuario | Username | Password | Rol | Descripción |
|---------|---------------|----------|-----|-------------|
| **Admin** | `admin` | `admin123` | ADMIN | Control total del sistema |
| **Customer** | `ana.rodriguez` | `password123` | CUSTOMER | Vista de cliente/comprador |
| **Seller** | `carlos.seller` | `password123` | SELLER | Dashboard de vendedor |

## Integración con Backend

### API Client Configurado

El frontend se conecta automáticamente con tu API Spring Boot:

```typescript
// Configuración automática en springApiClient.ts
baseURL: 'http://localhost:8080/api'
```

### Endpoints Integrados

| Funcionalidad | Endpoint | Método | Rol Requerido |
|---------------|----------|--------|---------------|
| **Login** | `/users/login` | POST | Público |
| **Usuario actual** | `/users/me` | GET | Autenticado |
| **Listar productos** | `/products` | GET | Autenticado |
| **Crear producto** | `/products` | POST | SELLER/ADMIN |
| **Actualizar producto** | `/products/{id}` | PUT | SELLER/ADMIN |
| **Eliminar producto** | `/products/{id}` | DELETE | ADMIN |
| **Productos por vendedor** | `/products/seller/{id}` | GET | Autenticado |
| **Buscar productos** | `/products/search?name=xxx` | GET | Autenticado |

### Manejo Automático de Imágenes

```typescript
// El frontend maneja automáticamente la conversión Base64
const handleImageUpload = async (file: File) => {
  const base64 = await fileToBase64(file);
  const contentType = getImageContentType(file);
  
  // Se envía automáticamente en el formato esperado por Spring Boot
  const productData = {
    name: "Producto",
    description: "Descripción",
    price: 99.99,
    stock: 10,
    sellerId: 3,
    imageData: base64,        // Base64 string
    imageContentType: contentType  // "image/jpeg", etc.
  };
};
```

## Flujo de Uso Completo

### 1. Login y Redirección Automática
```bash
# Login como cualquier rol
POST /api/users/login
{
  "username": "carlos.seller@email.com",
  "password": "password123"
}

# Redirección automática según rol:
# - ADMIN → /admin
# - SELLER → /seller  
# - CUSTOMER → /customer
```

### 2. Gestión de Productos (Seller)
```bash
# El frontend maneja todo automáticamente:
1. Login como seller
2. Dashboard carga productos del vendedor
3. Crear producto con imagen
4. Upload automático en Base64
5. Vista actualizada en tiempo real
```

### 3. Compras (Customer)
```bash
# Flujo completo de compra:
1. Login como customer
2. Explorar catálogo
3. Buscar productos
4. Agregar al carrito
5. Ver detalles del vendedor
```

## Scripts Disponibles

### Desarrollo
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```

### Testing y Calidad
```bash
npm run type-check   # Verificación TypeScript
npm run format       # Formateo con Prettier (si está configurado)
```

## Configuración Avanzada

### Proxy para Desarrollo (Opcional)

Si tienes problemas de CORS, configura proxy en `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

### Personalización de Tailwind

Modifica `tailwind.config.js` para personalizar colores y temas:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          600: '#0284c7',
          700: '#0369a1',
        }
      }
    }
  }
}
```

## Arquitectura de Estado

### Auth Store (Zustand)
```typescript
// Estado global de autenticación
interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Acciones disponibles
- login(credentials)
- logout()
- getCurrentUser()
- clearError()
```

### Product Store (Zustand)
```typescript
// Estado global de productos
interface ProductState {
  products: ProductResponse[];
  currentProduct: ProductResponse | null;
  isLoading: boolean;
  error: string | null;
}

// Acciones CRUD completas
- fetchAllProducts()
- fetchProductsBySeller(sellerId)
- createProduct(data)
- updateProduct(id, data)
- deleteProduct(id)
- searchProducts(name)
```

### Cart Store (Zustand)
```typescript
// Carrito de compras persistente
interface CartState {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
}

// Gestión del carrito
- addItem(product, quantity)
- removeItem(itemId)
- updateQuantity(itemId, quantity)
- clearCart()
- getCartTotal()
```

## Características de Desarrollo

### TypeScript Estricto
- **Tipado completo**: Interfaces para todas las entidades
- **Type safety**: Prevención de errores en tiempo de compilación
- **IntelliSense**: Autocompletado y documentación inline
- **Refactoring seguro**: Cambios de código sin romper funcionalidad

### Hot Module Replacement
- **Vite HMR**: Cambios instantáneos sin recargar página
- **Estado preservado**: Mantiene el estado durante desarrollo
- **Fast refresh**: Recarga solo componentes modificados

### Code Splitting
- **Lazy loading**: Carga bajo demanda de componentes
- **Bundle optimization**: Archivos optimizados automáticamente
- **Tree shaking**: Eliminación de código no utilizado

## Solución de Problemas

### Error de Conexión Backend
```bash
# Verificar que Spring Boot esté corriendo
curl http://localhost:8080/api/users/login

# Si no responde, iniciar backend:
cd ../backend
mvn spring-boot:run
```

### Problemas de CORS
```typescript
// 1. Configurar proxy en vite.config.ts (mostrado arriba)
// 2. O verificar configuración CORS en SecurityConfig.java

// Verificar origin permitidos en el backend:
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "http://localhost:5173"
));
```

### Error de Autenticación
```bash
# Limpiar localStorage y probar de nuevo
localStorage.clear()

# Verificar tokens en DevTools:
# Application → Local Storage → auth-token
```

### Problemas de Build
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar versión de Node.js
node --version  # Debe ser 18+
```

## Estructura de Componentes

### Componentes Principales
```
src/presentation/
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx        # Formulario de login
│   ├── products/
│   │   └── ProductForm.tsx      # CRUD de productos
│   └── common/
│       ├── Header.tsx           # Navegación principal
│       └── Footer.tsx           # Pie de página
├── pages/
│   ├── AdminDashboard.tsx       # Panel administrativo
│   ├── SellerDashboard.tsx      # Panel de vendedor
│   └── CustomerDashboard.tsx    # Portal de cliente
└── layouts/
    └── MainLayout.tsx           # Layout principal
```

### Routing Protegido
```typescript
// Rutas protegidas por rol automáticamente
<ProtectedRoute allowedRoles={['ADMIN']}>
  <AdminDashboard />
</ProtectedRoute>

<ProtectedRoute allowedRoles={['SELLER']}>
  <SellerDashboard />
</ProtectedRoute>

<ProtectedRoute allowedRoles={['CUSTOMER']}>
  <CustomerDashboard />
</ProtectedRoute>
```

## Performance y Optimización

### Lazy Loading Implementado
```typescript
// Componentes se cargan bajo demanda
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
```

### Cache Inteligente
```typescript
// Product store evita llamadas repetidas
if (state.lastFetchedSellerId === sellerId && state.products.length > 0) {
  return; // Skip duplicate request
}
```

### Optimización de Imágenes
```typescript
// Redimensionamiento automático antes de enviar
const resizeImage = (file: File, maxWidth = 800, maxHeight = 600) => {
  // Reduce tamaño automáticamente
  // Mantiene aspect ratio
  // Optimiza para web
};
```

## Próximas Funcionalidades

### Planeadas para la Siguiente Versión
- [ ] **Sistema de categorías**: Filtrado avanzado de productos
- [ ] **Paginación**: Para listas grandes de productos
- [ ] **Wishlist**: Lista de deseos para customers
- [ ] **Reviews y ratings**: Sistema de calificaciones
- [ ] **Chat en tiempo real**: Comunicación seller-customer
- [ ] **Notificaciones push**: Alertas de stock y pedidos
- [ ] **Dashboard analytics**: Gráficos y métricas avanzadas
- [ ] **Multi-language**: Soporte i18n
- [ ] **Dark mode**: Tema oscuro
- [ ] **PWA**: Progressive Web App capabilities

### Mejoras Técnicas Planeadas
- [ ] **Tests unitarios**: Jest + Testing Library
- [ ] **Tests E2E**: Cypress o Playwright
- [ ] **Storybook**: Documentación de componentes
- [ ] **Husky**: Git hooks para calidad de código
- [ ] **Bundle analyzer**: Optimización de bundle size
- [ ] **Service Workers**: Cache offline
- [ ] **Docker**: Containerización para deploy

## Contribución

### Setup para Contribuir
```bash
# 1. Fork del repositorio
# 2. Crear rama feature
git checkout -b feature/nueva-funcionalidad

# 3. Hacer cambios con commits descriptivos
git commit -am 'feat: agregar búsqueda avanzada de productos'

# 4. Push y crear Pull Request
git push origin feature/nueva-funcionalidad
```

### Estándares de Código
- **TypeScript strict mode**: Habilitado
- **ESLint**: Configuración estricta
- **Prettier**: Formateo consistente (si está configurado)
- **Conventional commits**: Para mensajes de commit claros

## Licencia

MIT License - Ver archivo [LICENSE](LICENSE) para detalles

## Soporte

Para problemas técnicos o preguntas:

1. **Issues del repositorio**: Para bugs y feature requests
2. **Documentación**: README del backend para configuración de API
3. **Logs**: Revisar console del navegador para debugging

---

**Desarrollado con React 18 + TypeScript + Vite siguiendo arquitectura por capas, principios SOLID y mejores prácticas de desarrollo frontend moderno** ⚡

## Conexión con Backend

Este frontend está diseñado específicamente para trabajar con la **API Spring Boot EcommerceCapas**. Asegúrate de tener el backend corriendo antes de usar este frontend.

**Backend Repository**: [Ver README del Backend](../README.md) para instrucciones de instalación y configuración de la API Spring Boot.

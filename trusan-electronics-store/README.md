# Loris E-9

> **We value customer satisfaction**

Full-stack ecommerce platform for electronics with dynamic store branding.

## Local Development

1. Start the backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev -- --host 0.0.0.0
   ```
3. Open the frontend in your browser:
   - `http://localhost:3001`

> Note: If port `3000` is already in use, Vite may open the frontend on `http://localhost:3001`.

## Dynamic Configuration

The store name and branding are now dynamic! To change them, modify the environment variables in your `.env` file or update `backend/config/store-config.js`:

```bash
STORE_NAME=Loris E-9
STORE_EMAIL=lawrenceomoit66y@gmail.com
SUPPORT_WHATSAPP=0790206354
```

The backend API provides a `/api/config` endpoint that returns the current store configuration:

```bash
curl http://localhost:5000/api/config
```

## Contact & Support

- **WhatsApp**: 0790206354
- **WhatsApp Channel**: [Join here](https://whatsapp.com/channel/0029VbCseMv7IUYSEy2fqX2P)
- **Phone**: +256790206354 or +256787772067
- **Email**: lawrenceomoit66y@gmail.com
- **Mobile Money Payment**: +256790206354

## GitHub Pages

The frontend site is published at:

- `https://omoit699.github.io/Trusan-Electronics-/`

## Documentation

- [Customer Guide](CUSTOMER_GUIDE.md)
- [Terms and Conditions](TERMS_AND_CONDITIONS.md)

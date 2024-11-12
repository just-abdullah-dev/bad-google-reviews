export const defaultLocale = 'en';
export const locales = ['en', 'de'];

export const pathnames = {
  '/': '/',
};

export const localePrefix = 'always';

export const port = process.env.PORT || 3000;
export const host = process.env.NEXT_PUBLIC_DOMAIN_NAME
  ? `https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}`
  : `http://localhost:${port}`;
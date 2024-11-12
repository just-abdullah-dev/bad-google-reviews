export const defaultLocale = 'en';
export const locales = ['en', 'de'];

export const pathnames = {
  '/': '/',
};

export const localePrefix = 'always';

export const port = process.env.PORT || 3000;
export const host = process.env.DOMAIN_NAME
  ? `https://${process.env.DOMAIN_NAME}`
  : `http://localhost:${port}`;
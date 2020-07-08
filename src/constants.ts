export const PORT = process.env.PORT && Number(process.env.PORT) || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || 'MY SUPER SECRET';
export const COOKIE_LIFE_TIME = process.env.COOKIE_LIFE_TIME && Number(process.env.COOKIE_LIFE_TIME) || 24 * 60 * 60 * 1000;
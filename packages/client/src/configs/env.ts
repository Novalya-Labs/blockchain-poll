import { z } from 'zod';

// Schema for environment variables
const envSchema = z.object({
  app: z.object({
    name: z.string().default('DA Prod'),
    url: z.string().default('https://api.da-prod.com'),
    appKey: z.string().default('da-prod'),
    mode: z.enum(['development', 'production', 'test']).default('development'),
  }),
  pwa: z.object({
    name: z.string().default('Blockchain Poll'),
    shortName: z.string().default('Blockchain Poll'),
    description: z.string().default('Blockchain Poll'),
    themeColor: z.string().default('#000000'),
    backgroundColor: z.string().default('#000000'),
  }),
});

// Load environment variables
export const env = envSchema.parse({
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Blockchain Poll',
    url: import.meta.env.VITE_APP_URL || 'https://api.blockchain-poll.com',
    appKey: import.meta.env.VITE_APP_KEY || 'blockchain-poll',
    mode: import.meta.env.MODE || 'development',
  },
  pwa: {
    name: import.meta.env.VITE_PWA_NAME,
    shortName: import.meta.env.VITE_PWA_SHORT_NAME,
    description: import.meta.env.VITE_PWA_DESCRIPTION,
    themeColor: import.meta.env.VITE_PWA_THEME_COLOR,
    backgroundColor: import.meta.env.VITE_PWA_BACKGROUND_COLOR,
  },
});

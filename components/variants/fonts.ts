import { Fraunces } from 'next/font/google'

/**
 * Display face for the /3 design. Body text stays on the site's Geist and
 * labels on Geist Mono, so the "2 + 1" pairing holds without loading a third
 * family. The variable is applied on the design's root element rather than on
 * <body>, so only this route pays for it.
 *
 * SOFT and WONK are what make the italic feel drawn rather than sloped; opsz
 * lets the same file hold up at both 1.3rem in the reel and 6rem in the sign-off.
 */
export const fraunces = Fraunces({
  variable: '--font-v3-display',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
  display: 'swap',
})

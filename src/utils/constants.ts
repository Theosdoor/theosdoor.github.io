const emailUser = 'theo.farrell99';
const emailDomain = 'outlook.com';
const obfuscateEmailPart = (value: string) => value.replaceAll('.', '[dot]');

export const contactConfig = {
  emailObfuscatedText: `${obfuscateEmailPart(emailUser)}[at]${obfuscateEmailPart(emailDomain)}`,
} as const;

// The CV is the PDF itself, served at a dated path so it opens in-tab and
// saves with the date in its name. `cv-meta.json` is stamped by the deploy
// pipeline (resume repo) so the file name and this link never disagree.
// The stable /cv redirect (see astro.config.mjs) also points at this file.
import cvMeta from '../data/cv-meta.json';
export const cvUrl = `/cv/${cvMeta.file}`;
export const cvUpdated = cvMeta.updated;

// `icon` values must be names Icon.astro knows about.
export const socialLinks = [
  { href: 'https://github.com/Theosdoor', label: 'GitHub', icon: 'github' },
  { href: 'https://www.linkedin.com/in/theofarrell/', label: 'LinkedIn', icon: 'linkedin' },
  { href: 'https://scholar.google.com/citations?user=wbiptScAAAAJ', label: 'Google Scholar', icon: 'scholar' },
] as const;

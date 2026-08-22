const emailUser = 'theo.farrell99';
const emailDomain = 'outlook.com';
const obfuscateEmailPart = (value: string) => value.replaceAll('.', '[dot]');

export const contactConfig = {
  emailObfuscatedText: `${obfuscateEmailPart(emailUser)}[at]${obfuscateEmailPart(emailDomain)}`,
} as const;

// The CV is the PDF itself; /cv redirects here (see astro.config.mjs).
export const cvUrl = '/cv/TheoFarrell_CV.pdf';

// Build-date stamp (dd/mm/yyyy) — the CV is redeployed whenever it changes,
// so the site build date tracks the last CV update.
const cvBuildDate = new Date();
const cvDD = String(cvBuildDate.getDate()).padStart(2, '0');
const cvMM = String(cvBuildDate.getMonth() + 1).padStart(2, '0');
export const cvUpdated = `${cvDD}/${cvMM}/${cvBuildDate.getFullYear()}`;
export const cvDownloadName = `TheoFarrell_CV_${cvDD}${cvMM}.pdf`;

// `icon` values must be names Icon.astro knows about.
export const socialLinks = [
  { href: 'https://github.com/Theosdoor', label: 'GitHub', icon: 'github' },
  { href: 'https://www.linkedin.com/in/theofarrell/', label: 'LinkedIn', icon: 'linkedin' },
  { href: 'https://scholar.google.com/citations?user=wbiptScAAAAJ', label: 'Google Scholar', icon: 'scholar' },
] as const;

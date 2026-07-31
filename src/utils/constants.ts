const emailUser = 'theo.farrell99';
const emailDomain = 'outlook.com';
const obfuscateEmailPart = (value: string) => value.replaceAll('.', '[dot]');

export const contactConfig = {
  emailObfuscatedText: `${obfuscateEmailPart(emailUser)}[at]${obfuscateEmailPart(emailDomain)}`,
} as const;

// The CV is the PDF itself; /cv redirects here (see astro.config.mjs).
export const cvUrl = '/cv/TheoFarrell_CV.pdf';

const emailUser = 'theo.farrell99';
const emailDomain = 'outlook.com';
const obfuscateEmailPart = (value: string) => value.replaceAll('.', " 'dot' ");

export const contactConfig = {
  emailUser,
  emailDomain,
  emailObfuscatedText: `${obfuscateEmailPart(emailUser)} 'at' ${obfuscateEmailPart(emailDomain)}`,
} as const;

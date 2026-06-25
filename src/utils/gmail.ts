const EMAIL = 'kalemi1994@gmail.com';

export function gmailComposeUrl(subject: string, body?: string) {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to: EMAIL, su: subject });
  if (body) params.set('body', body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}

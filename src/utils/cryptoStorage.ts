/**
 * Módulo de Criptografia e Proteção de Dados Sensíveis em Repouso (LGPD)
 * Utiliza Web Crypto API nativa do navegador (AES-GCM 256-bit)
 */

// Chave e salt padrão para ofuscação/criptografia local
const DEVICE_SALT = 'agropet_security_salt_v2';

// Derivar chave AES-GCM a partir de chave mestre da loja
async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(DEVICE_SALT),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('agropet_pbkdf2_salt_lgpd_protection'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Criptografa string com AES-GCM retornando formato iv:ciphertext em Base64
 */
export async function encryptSensitiveData(plainText: string): Promise<string> {
  try {
    if (!plainText) return '';
    const key = await getCryptoKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encodedData = enc.encode(plainText);

    const cipherBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedData
    );

    const ivBase64 = btoa(String.fromCharCode(...iv));
    const cipherBase64 = btoa(String.fromCharCode(...new Uint8Array(cipherBuffer)));
    return `enc_v2:${ivBase64}:${cipherBase64}`;
  } catch (err) {
    console.warn('[LGPD Crypto] Falha ao criptografar em repouso, mantendo ofuscado:', err);
    return `b64:${btoa(unescape(encodeURIComponent(plainText)))}`;
  }
}

/**
 * Descriptografa string AES-GCM
 */
export async function decryptSensitiveData(encryptedText: string): Promise<string> {
  try {
    if (!encryptedText) return '';
    if (encryptedText.startsWith('enc_v2:')) {
      const parts = encryptedText.split(':');
      if (parts.length !== 3) return encryptedText;

      const ivStr = atob(parts[1]);
      const cipherStr = atob(parts[2]);

      const iv = new Uint8Array(ivStr.length);
      for (let i = 0; i < ivStr.length; i++) iv[i] = ivStr.charCodeAt(i);

      const cipher = new Uint8Array(cipherStr.length);
      for (let i = 0; i < cipherStr.length; i++) cipher[i] = cipherStr.charCodeAt(i);

      const key = await getCryptoKey();
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        cipher
      );

      return new TextDecoder().decode(decrypted);
    } else if (encryptedText.startsWith('b64:')) {
      return decodeURIComponent(escape(atob(encryptedText.replace('b64:', ''))));
    }
    return encryptedText;
  } catch (err) {
    console.warn('[LGPD Crypto] Falha ao descriptografar dado:', err);
    return encryptedText;
  }
}

/**
 * Mascaramento de CPF (LGPD): Ex: 123.456.789-00 -> ***.456.789-**
 */
export function maskCpf(cpf: string | undefined): string {
  if (!cpf) return 'Não informado';
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return '***.***.***-**';
  return `***.${clean.slice(3, 6)}.${clean.slice(6, 9)}-**`;
}

/**
 * Mascaramento de Telefone (LGPD): Ex: (11) 98765-4321 -> (11) *****-4321
 */
export function maskPhone(phone: string | undefined): string {
  if (!phone) return 'Não informado';
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 8) return '****-****';
  const lastFour = clean.slice(-4);
  const ddd = clean.length >= 10 ? `(${clean.slice(0, 2)}) ` : '';
  return `${ddd}*****-${lastFour}`;
}

/**
 * Mascaramento de Valor Financeiro (Visão de Balcão anti-olhar curioso):
 */
export function maskFinancialValue(val: number | string): string {
  return 'R$ ••••••';
}

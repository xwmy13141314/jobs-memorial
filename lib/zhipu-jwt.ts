/**
 * 智谱 AI JWT Token 生成器
 * 智谱AI API Key格式: id.secret 需要转换为 JWT Token
 */

import crypto from 'crypto';

/**
 * 生成智谱AI API所需的JWT Token
 * @param apiKey 智谱AI API Key (格式: id.secret)
 * @returns JWT Token
 */
export function generateZhipuToken(apiKey: string): string {
  const [id, secret] = apiKey.split('.');

  if (!id || !secret) {
    throw new Error('Invalid Zhipu API Key format. Expected: id.secret');
  }

  const now = Date.now();
  const timestamp = now;
  const exp = now + 3600 * 1000; // 1小时后过期

  const header = {
    alg: 'HS256',
    sign_type: 'SIGN',
  };

  const payload = {
    api_key: id,
    exp: timestamp + 3600 * 1000,
    timestamp: timestamp,
  };

  // 编码 header
  const encodedHeader = base64UrlEncode(JSON.stringify(header));

  // 编码 payload
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // 生成签名
  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(dataToSign)
    .digest('base64url');

  return `${dataToSign}.${signature}`;
}

/**
 * Base64 URL 编码
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

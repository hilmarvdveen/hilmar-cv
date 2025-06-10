import { headers } from 'next/headers';

/**
 * Hook to get the nonce value for CSP inline styles and scripts
 * This nonce is generated in middleware and passed via headers
 */
export async function useNonce(): Promise<string | null> {
  try {
    const headersList = await headers();
    return headersList.get('x-nonce') || null;
  } catch {
    // In case headers() fails (e.g., in client components), return null
    return null;
  }
}

/**
 * Client-side version that can be used in client components
 * Note: This will return null since client components can't access server headers
 * For client components, inline styles with nonces should be rendered server-side
 */
export function useClientNonce(): string | null {
  if (typeof window !== 'undefined') {
    // Client-side: nonce is not available, use CSS classes instead
    return null;
  }
  return null;
} 
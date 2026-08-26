import React from "react";

// Safe wrapper for React cache() that works seamlessly in Next.js Server Components
// as well as Vitest Node/CJS unit test environments.
export const memoize = typeof React.cache === "function" ? React.cache : <T extends (...args: any[]) => any>(fn: T) => fn;

/**
 * Direct safe query execution without unstable_cache to prevent Vercel Serverless DataCache Invariant Crashes (Digest 775779262)
 */
export function cachedQuery<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  _keyParts?: string[],
  _options?: { revalidate?: number | false; tags?: string[] }
): T {
  return fn;
}

import React from "react";

// Safe wrapper for React cache() that works seamlessly in Next.js Server Components
// as well as Vitest Node/CJS unit test environments.
export const memoize = typeof React.cache === "function" ? React.cache : <T extends (...args: any[]) => any>(fn: T) => fn;

export function cachedQuery<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyParts: string[],
  options?: { revalidate?: number | false; tags?: string[] }
): T {
  if (process.env.VITEST || process.env.NODE_ENV === "test") {
    return fn;
  }
  try {
    const { unstable_cache } = require("next/cache");
    if (typeof unstable_cache === "function") {
      const cached = unstable_cache(fn, keyParts, options);
      return (async (...args: any[]) => {
        try {
          return await cached(...args);
        } catch (err: any) {
          if (err?.message?.includes("incrementalCache") || err?.message?.includes("Invariant")) {
            return await fn(...args);
          }
          throw err;
        }
      }) as T;
    }
  } catch {
    // Fallback for non-Next environments
  }
  return fn;
}

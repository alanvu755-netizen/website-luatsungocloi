import React from "react";

// Safe wrapper for React cache() that works seamlessly in Next.js Server Components
// as well as Vitest Node/CJS unit test environments.
export const memoize = typeof React.cache === "function" ? React.cache : <T extends (...args: any[]) => any>(fn: T) => fn;

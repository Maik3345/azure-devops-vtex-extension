/**
 * The `asyncTimeout` function in TypeScript returns a promise that resolves after a specified time in
 * milliseconds.
 * @param {number} ms - The `ms` parameter in the `asyncTimeout` function represents the number of
 * milliseconds to wait before resolving the promise.
 * @returns The `asyncTimeout` function is returning a Promise that resolves after a specified number
 * of milliseconds.
 */
export function asyncTimeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

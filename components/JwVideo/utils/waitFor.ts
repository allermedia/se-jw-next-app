/**
 * Returns a promise that waits for an expression to be true - or fails after `timeout` ms. Once
 * `predicate()` is truthy, the promise is resolved with the returned value. Example use case: wait
 * for a global variable to become available.
 *
 * @param {() => any} predicate
 * @param {{
 *    timeout?: number       // Timeout in ms, 0 means no timeout.
 *    checkInterval?: number
 * }} options
 * @return {Promise<any>}
 */
export default function waitFor(predicate: any, { checkInterval = 50, timeout = 5000 } = {}) {
  let intervalId: any;
  return Promise.race([
    new Promise((_, reject) => timeout && setTimeout(reject, timeout)),
    new Promise((resolve) => {
      intervalId = setInterval(() => {
        const val = predicate();
        if (val) resolve(val);
      }, checkInterval);
    }),
  ]).finally(() => clearInterval(intervalId));
}

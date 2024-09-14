export default function checkSpecKeys(spec, keysArray) {
  // eslint-disable-next-line no-prototype-builtins
  return keysArray.reduce(
    (value, key) => value && spec.hasOwnProperty(key),
    true
  )
    ? null
    : console.error("Keys Missing:", spec);
}

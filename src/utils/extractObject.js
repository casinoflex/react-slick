// given an object and a list of keys, return new object with given keys
export default function extractObject(spec, keys) {
  let newObject = {};
  keys.forEach((key) => (newObject[key] = spec[key]));
  return newObject;
}

import getNavigableIndexes from "./getNavigableIndexes";

export default function checkNavigable(spec, index) {
  const navigables = getNavigableIndexes(spec);
  let prevNavigable = 0;
  if (index > navigables[navigables.length - 1]) {
    index = navigables[navigables.length - 1];
  } else {
    for (let n in navigables) {
      if (index < navigables[n]) {
        index = prevNavigable;
        break;
      }
      prevNavigable = navigables[n];
    }
  }
  return index;
}

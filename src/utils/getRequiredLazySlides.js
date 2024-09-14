import lazyStartIndex from "./lazyStartIndex";
import lazyEndIndex from "./lazyEndIndex";

// return list of slides that need to be present
export default function getRequiredLazySlides(spec) {
  let requiredSlides = [];
  let startIndex = lazyStartIndex(spec);
  let endIndex = lazyEndIndex(spec);
  for (let slideIndex = startIndex; slideIndex < endIndex; slideIndex++) {
    requiredSlides.push(slideIndex);
  }
  return requiredSlides;
}

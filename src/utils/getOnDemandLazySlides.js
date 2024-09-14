import lazyStartIndex from "./lazyStartIndex";
import lazyEndIndex from "./lazyEndIndex";

export default function getOnDemandLazySlides(spec) {
  let onDemandSlides = [];
  let startIndex = lazyStartIndex(spec);
  let endIndex = lazyEndIndex(spec);

  for (let slideIndex = startIndex; slideIndex < endIndex; slideIndex++) {
    if (spec.lazyLoadedList.indexOf(slideIndex) < 0) {
      onDemandSlides.push(slideIndex);
    }
  }

  return onDemandSlides;
}

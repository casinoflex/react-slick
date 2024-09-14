import lazySlidesOnRight from "./lazySlidesOnRight";

export default function lazyEndIndex(spec) {
  return spec.currentSlide + lazySlidesOnRight(spec);
}

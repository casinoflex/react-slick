import lazySlidesOnLeft from "./lazySlidesOnLeft";

export default function lazyStartIndex(spec) {
  return spec.currentSlide - lazySlidesOnLeft(spec);
}

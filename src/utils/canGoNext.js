export default function canGoNext(spec) {
  let canGo = true;
  if (!spec.infinite) {
    if (spec.centerMode && spec.currentSlide >= spec.slideCount - 1) {
      canGo = false;
    } else if (
      spec.slideCount <= spec.slidesToShow ||
      spec.currentSlide >= spec.slideCount - spec.slidesToShow
    ) {
      canGo = false;
    }
  }
  return canGo;
}

import getWidth from "./getWidth";
import getHeight from "./getHeight";

export default function getSlideCount(spec) {
  const centerOffset = spec.centerMode
    ? spec.slideWidth * Math.floor(spec.slidesToShow / 2)
    : 0;
  if (spec.swipeToSlide) {
    let swipedSlide;
    const slickList = spec.listRef;
    const slides =
      (slickList.querySelectorAll &&
        slickList.querySelectorAll(".slick-slide")) ||
      [];
    Array.from(slides).every((slide) => {
      if (!spec.vertical) {
        if (
          slide.offsetLeft - centerOffset + getWidth(slide) / 2 >
          spec.swipeLeft * -1
        ) {
          swipedSlide = slide;
          return false;
        }
      } else {
        if (slide.offsetTop + getHeight(slide) / 2 > spec.swipeLeft * -1) {
          swipedSlide = slide;
          return false;
        }
      }

      return true;
    });

    if (!swipedSlide) {
      return 0;
    }
    const currentIndex =
      spec.rtl === true
        ? spec.slideCount - spec.currentSlide
        : spec.currentSlide;
    const slidesTraversed =
      Math.abs(swipedSlide.dataset.index - currentIndex) || 1;
    return slidesTraversed;
  } else {
    return spec.slidesToScroll;
  }
}

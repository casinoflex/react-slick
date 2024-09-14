import checkSpecKeys from "./checkSpecKeys";
import getPreClones from "./getPreClones";

export default function getTrackLeft(spec) {
  if (spec.unslick) {
    return 0;
  }

  checkSpecKeys(spec, [
    "slideIndex",
    "trackRef",
    "infinite",
    "centerMode",
    "slideCount",
    "slidesToShow",
    "slidesToScroll",
    "slideWidth",
    "listWidth",
    "variableWidth",
    "slideHeight"
  ]);

  const {
    slideIndex,
    trackRef,
    infinite,
    centerMode,
    slideCount,
    slidesToShow,
    slidesToScroll,
    slideWidth,
    listWidth,
    variableWidth,
    slideHeight,
    fade,
    vertical
  } = spec;

  var slideOffset = 0;
  var targetLeft;
  var targetSlide;
  var verticalOffset = 0;

  if (fade || spec.slideCount === 1) {
    return 0;
  }

  let slidesToOffset = 0;
  if (infinite) {
    slidesToOffset = -getPreClones(spec); // bring active slide to the beginning of visual area
    // if next scroll doesn't have enough children, just reach till the end of original slides instead of shifting slidesToScroll children
    if (
      slideCount % slidesToScroll !== 0 &&
      slideIndex + slidesToScroll > slideCount
    ) {
      slidesToOffset = -(slideIndex > slideCount
        ? slidesToShow - (slideIndex - slideCount)
        : slideCount % slidesToScroll);
    }
    // shift current slide to center of the frame
    if (centerMode) {
      slidesToOffset += parseInt(slidesToShow / 2);
    }
  } else {
    if (
      slideCount % slidesToScroll !== 0 &&
      slideIndex + slidesToScroll > slideCount
    ) {
      slidesToOffset = slidesToShow - (slideCount % slidesToScroll);
    }
    if (centerMode) {
      slidesToOffset = parseInt(slidesToShow / 2);
    }
  }
  slideOffset = slidesToOffset * slideWidth;
  verticalOffset = slidesToOffset * slideHeight;

  if (!vertical) {
    targetLeft = slideIndex * slideWidth * -1 + slideOffset;
  } else {
    targetLeft = slideIndex * slideHeight * -1 + verticalOffset;
  }

  if (variableWidth === true) {
    var targetSlideIndex;
    const trackElem = trackRef && trackRef.node;
    targetSlideIndex = slideIndex + getPreClones(spec);
    targetSlide = trackElem && trackElem.childNodes[targetSlideIndex];
    targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0;
    if (centerMode === true) {
      targetSlideIndex = infinite
        ? slideIndex + getPreClones(spec)
        : slideIndex;
      targetSlide = trackElem && trackElem.children[targetSlideIndex];
      targetLeft = 0;
      for (let slide = 0; slide < targetSlideIndex; slide++) {
        targetLeft -=
          trackElem &&
          trackElem.children[slide] &&
          trackElem.children[slide].offsetWidth;
      }
      targetLeft -= parseInt(spec.centerPadding);
      targetLeft += targetSlide && (listWidth - targetSlide.offsetWidth) / 2;
    }
  }

  return targetLeft;
}

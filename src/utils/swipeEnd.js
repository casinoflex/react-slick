import getTrackLeft from "./getTrackLeft";
import getSlideCount from "./getSlideCount";
import checkNavigable from "./checkNavigable";
import getSwipeDirection from "./getSwipeDirection";
import safePreventDefault from "./safePreventDefault";
import getTrackAnimateCSS from "./getTrackAnimateCSS";

export default function swipeEnd(e, spec) {
  const {
    dragging,
    swipe,
    touchObject,
    listWidth,
    touchThreshold,
    verticalSwiping,
    listHeight,
    swipeToSlide,
    scrolling,
    onSwipe,
    targetSlide,
    currentSlide,
    infinite
  } = spec;
  if (!dragging) {
    if (swipe) safePreventDefault(e);
    return {};
  }
  let minSwipe = verticalSwiping
    ? listHeight / touchThreshold
    : listWidth / touchThreshold;
  let swipeDirection = getSwipeDirection(touchObject, verticalSwiping);
  // reset the state of touch related state variables.
  let state = {
    dragging: false,
    edgeDragged: false,
    scrolling: false,
    swiping: false,
    swiped: false,
    swipeLeft: null,
    touchObject: {}
  };
  if (scrolling) {
    return state;
  }
  if (!touchObject.swipeLength) {
    return state;
  }
  if (touchObject.swipeLength > minSwipe) {
    safePreventDefault(e);
    if (onSwipe) {
      onSwipe(swipeDirection);
    }
    let slideCount, newSlide;
    let activeSlide = infinite ? currentSlide : targetSlide;
    switch (swipeDirection) {
      case "left":
      case "up":
        newSlide = activeSlide + getSlideCount(spec);
        slideCount = swipeToSlide ? checkNavigable(spec, newSlide) : newSlide;
        state["currentDirection"] = 0;
        break;
      case "right":
      case "down":
        newSlide = activeSlide - getSlideCount(spec);
        slideCount = swipeToSlide ? checkNavigable(spec, newSlide) : newSlide;
        state["currentDirection"] = 1;
        break;
      default:
        slideCount = activeSlide;
    }
    state["triggerSlideHandler"] = slideCount;
  } else {
    // Adjust the track back to it's original position.
    let currentLeft = getTrackLeft(spec);
    state["trackStyle"] = getTrackAnimateCSS({ ...spec, left: currentLeft });
  }
  return state;
}

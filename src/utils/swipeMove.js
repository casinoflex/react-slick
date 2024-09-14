import canGoNext from "./canGoNext";
import getTrackCSS from "./getTrackCSS";
import getTrackLeft from "./getTrackLeft";
import getSwipeDirection from "./getSwipeDirection";
import safePreventDefault from "./safePreventDefault";

export default function swipeMove(e, spec) {
  // spec also contains, trackRef and slideIndex
  const {
    scrolling,
    animating,
    vertical,
    swipeToSlide,
    verticalSwiping,
    rtl,
    currentSlide,
    edgeFriction,
    edgeDragged,
    onEdge,
    swiped,
    swiping,
    slideCount,
    slidesToScroll,
    infinite,
    touchObject,
    swipeEvent,
    listHeight,
    listWidth
  } = spec;
  if (scrolling) return;
  if (animating) return safePreventDefault(e);
  if (vertical && swipeToSlide && verticalSwiping) safePreventDefault(e);
  let swipeLeft,
    state = {};
  let curLeft = getTrackLeft(spec);
  touchObject.curX = e.touches ? e.touches[0].pageX : e.clientX;
  touchObject.curY = e.touches ? e.touches[0].pageY : e.clientY;
  touchObject.swipeLength = Math.round(
    Math.sqrt(Math.pow(touchObject.curX - touchObject.startX, 2))
  );
  let verticalSwipeLength = Math.round(
    Math.sqrt(Math.pow(touchObject.curY - touchObject.startY, 2))
  );
  if (!verticalSwiping && !swiping && verticalSwipeLength > 10) {
    return { scrolling: true };
  }
  if (verticalSwiping) touchObject.swipeLength = verticalSwipeLength;
  let positionOffset =
    (!rtl ? 1 : -1) * (touchObject.curX > touchObject.startX ? 1 : -1);
  if (verticalSwiping)
    positionOffset = touchObject.curY > touchObject.startY ? 1 : -1;

  let dotCount = Math.ceil(slideCount / slidesToScroll);
  let swipeDirection = getSwipeDirection(spec.touchObject, verticalSwiping);
  let touchSwipeLength = touchObject.swipeLength;
  if (!infinite) {
    if (
      (currentSlide === 0 &&
        (swipeDirection === "right" || swipeDirection === "down")) ||
      (currentSlide + 1 >= dotCount &&
        (swipeDirection === "left" || swipeDirection === "up")) ||
      (!canGoNext(spec) &&
        (swipeDirection === "left" || swipeDirection === "up"))
    ) {
      touchSwipeLength = touchObject.swipeLength * edgeFriction;
      if (edgeDragged === false && onEdge) {
        onEdge(swipeDirection);
        state["edgeDragged"] = true;
      }
    }
  }
  if (!swiped && swipeEvent) {
    swipeEvent(swipeDirection);
    state["swiped"] = true;
  }
  if (!vertical) {
    if (!rtl) {
      swipeLeft = curLeft + touchSwipeLength * positionOffset;
    } else {
      swipeLeft = curLeft - touchSwipeLength * positionOffset;
    }
  } else {
    swipeLeft =
      curLeft + touchSwipeLength * (listHeight / listWidth) * positionOffset;
  }
  if (verticalSwiping) {
    swipeLeft = curLeft + touchSwipeLength * positionOffset;
  }
  state = {
    ...state,
    touchObject,
    swipeLeft,
    trackStyle: getTrackCSS({ ...spec, left: swipeLeft })
  };
  if (
    Math.abs(touchObject.curX - touchObject.startX) <
    Math.abs(touchObject.curY - touchObject.startY) * 0.8
  ) {
    return state;
  }
  if (touchObject.swipeLength > 10) {
    state["swiping"] = true;
    safePreventDefault(e);
  }
  return state;
}

import React from "react";
import getWidth from "./getWidth";
import getHeight from "./getHeight";
import getOnDemandLazySlides from "./getOnDemandLazySlides";

export default function initializedState(spec) {
  // spec also contains listRef, trackRef
  let slideCount = React.Children.count(spec.children);
  const listNode = spec.listRef;
  let listWidth = Math.ceil(getWidth(listNode));
  const trackNode = spec.trackRef && spec.trackRef.node;
  let trackWidth = Math.ceil(getWidth(trackNode));
  let slideWidth;
  if (!spec.vertical) {
    let centerPaddingAdj = spec.centerMode && parseInt(spec.centerPadding) * 2;
    if (
      typeof spec.centerPadding === "string" &&
      spec.centerPadding.slice(-1) === "%"
    ) {
      centerPaddingAdj *= listWidth / 100;
    }
    slideWidth = Math.ceil((listWidth - centerPaddingAdj) / spec.slidesToShow);
  } else {
    slideWidth = listWidth;
  }
  let slideHeight =
    listNode && getHeight(listNode.querySelector('[data-index="0"]'));
  let listHeight = slideHeight * spec.slidesToShow;
  let currentSlide =
    spec.currentSlide === undefined ? spec.initialSlide : spec.currentSlide;
  if (spec.rtl && spec.currentSlide === undefined) {
    currentSlide = slideCount - 1 - spec.initialSlide;
  }
  let lazyLoadedList = spec.lazyLoadedList || [];
  let slidesToLoad = getOnDemandLazySlides({
    ...spec,
    currentSlide,
    lazyLoadedList
  });
  lazyLoadedList = lazyLoadedList.concat(slidesToLoad);

  let state = {
    slideCount,
    slideWidth,
    listWidth,
    trackWidth,
    currentSlide,
    slideHeight,
    listHeight,
    lazyLoadedList
  };

  if (spec.autoplaying === null && spec.autoplay) {
    state["autoplaying"] = "playing";
  }

  return state;
}

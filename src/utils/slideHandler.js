import canGoNext from "./canGoNext";
import clamp from "./clamp";
import getOnDemandLazySlides from "./getOnDemandLazySlides";
import getTrackAnimateCSS from "./getTrackAnimateCSS";
import getTrackCSS from "./getTrackCSS";
import getTrackLeft from "./getTrackLeft";

export default function slideHandler(spec) {
  const {
    waitForAnimate,
    animating,
    fade,
    infinite,
    index,
    slideCount,
    lazyLoad,
    currentSlide,
    centerMode,
    slidesToScroll,
    slidesToShow,
    useCSS
  } = spec;
  let { lazyLoadedList } = spec;
  if (waitForAnimate && animating) return {};
  let animationSlide = index,
    finalSlide,
    animationLeft,
    finalLeft;
  let state = {},
    nextState = {};
  const targetSlide = infinite ? index : clamp(index, 0, slideCount - 1);
  if (fade) {
    if (!infinite && (index < 0 || index >= slideCount)) return {};
    if (index < 0) {
      animationSlide = index + slideCount;
    } else if (index >= slideCount) {
      animationSlide = index - slideCount;
    }
    if (lazyLoad && lazyLoadedList.indexOf(animationSlide) < 0) {
      lazyLoadedList = lazyLoadedList.concat(animationSlide);
    }
    state = {
      animating: true,
      currentSlide: animationSlide,
      lazyLoadedList,
      targetSlide: animationSlide
    };
    nextState = { animating: false, targetSlide: animationSlide };
  } else {
    finalSlide = animationSlide;
    if (animationSlide < 0) {
      finalSlide = animationSlide + slideCount;
      if (!infinite) finalSlide = 0;
      else if (slideCount % slidesToScroll !== 0)
        finalSlide = slideCount - (slideCount % slidesToScroll);
    } else if (!canGoNext(spec) && animationSlide > currentSlide) {
      animationSlide = finalSlide = currentSlide;
    } else if (centerMode && animationSlide >= slideCount) {
      animationSlide = infinite ? slideCount : slideCount - 1;
      finalSlide = infinite ? 0 : slideCount - 1;
    } else if (animationSlide >= slideCount) {
      finalSlide = animationSlide - slideCount;
      if (!infinite) finalSlide = slideCount - slidesToShow;
      else if (slideCount % slidesToScroll !== 0) finalSlide = 0;
    }

    if (!infinite && animationSlide + slidesToShow >= slideCount) {
      finalSlide = slideCount - slidesToShow;
    }

    animationLeft = getTrackLeft({ ...spec, slideIndex: animationSlide });
    finalLeft = getTrackLeft({ ...spec, slideIndex: finalSlide });
    if (!infinite) {
      if (animationLeft === finalLeft) animationSlide = finalSlide;
      animationLeft = finalLeft;
    }
    if (lazyLoad) {
      lazyLoadedList = lazyLoadedList.concat(
        getOnDemandLazySlides({ ...spec, currentSlide: animationSlide })
      );
    }
    if (!useCSS) {
      state = {
        currentSlide: finalSlide,
        trackStyle: getTrackCSS({ ...spec, left: finalLeft }),
        lazyLoadedList,
        targetSlide
      };
    } else {
      state = {
        animating: true,
        currentSlide: finalSlide,
        trackStyle: getTrackAnimateCSS({ ...spec, left: animationLeft }),
        lazyLoadedList,
        targetSlide
      };
      nextState = {
        animating: false,
        currentSlide: finalSlide,
        trackStyle: getTrackCSS({ ...spec, left: finalLeft }),
        swipeLeft: null,
        targetSlide
      };
    }
  }
  return { state, nextState };
}

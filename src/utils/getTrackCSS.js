import checkSpecKeys from "./checkSpecKeys";
import getTotalSlides from "./getTotalSlides";

export default function getTrackCSS(spec) {
  checkSpecKeys(spec, [
    "left",
    "variableWidth",
    "slideCount",
    "slidesToShow",
    "slideWidth"
  ]);
  let trackWidth, trackHeight;
  if (!spec.vertical) {
    trackWidth = getTotalSlides(spec) * spec.slideWidth;
  } else {
    const trackChildren = spec.unslick
      ? spec.slideCount
      : spec.slideCount + 2 * spec.slidesToShow;
    trackHeight = trackChildren * spec.slideHeight;
  }
  let style = {
    opacity: 1,
    transition: "",
    WebkitTransition: ""
  };
  if (spec.useTransform) {
    let WebkitTransform = !spec.vertical
      ? "translate3d(" + spec.left + "px, 0px, 0px)"
      : "translate3d(0px, " + spec.left + "px, 0px)";
    let transform = !spec.vertical
      ? "translate3d(" + spec.left + "px, 0px, 0px)"
      : "translate3d(0px, " + spec.left + "px, 0px)";
    let msTransform = !spec.vertical
      ? "translateX(" + spec.left + "px)"
      : "translateY(" + spec.left + "px)";
    style = {
      ...style,
      WebkitTransform,
      transform,
      msTransform
    };
  } else {
    if (spec.vertical) {
      style["top"] = spec.left;
    } else {
      style["left"] = spec.left;
    }
  }
  if (spec.fade) style = { opacity: 1 };
  if (trackWidth) style.width = trackWidth;
  if (trackHeight) style.height = trackHeight;

  // Fallback for IE8
  if (window && !window.addEventListener && window.attachEvent) {
    if (!spec.vertical) {
      style.marginLeft = spec.left + "px";
    } else {
      style.marginTop = spec.left + "px";
    }
  }

  return style;
}

import checkSpecKeys from "./checkSpecKeys";
import getTrackCSS from "./getTrackCSS";

export default function getTrackAnimateCSS(spec) {
  checkSpecKeys(spec, [
    "left",
    "variableWidth",
    "slideCount",
    "slidesToShow",
    "slideWidth",
    "speed",
    "cssEase"
  ]);

  let style = getTrackCSS(spec);
  // useCSS is true by default so it can be undefined
  if (spec.useTransform) {
    style.WebkitTransition = `-webkit-transform ${spec.speed}ms ${spec.cssEase}`;
    style.transition = `transform ${spec.speed}ms ${spec.cssEase}`;
  } else {
    style.transition = `${spec.vertical ? "top" : "left"} ${spec.speed}ms ${
      spec.cssEase
    }`;
  }

  return style;
}

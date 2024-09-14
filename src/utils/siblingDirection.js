import slidesOnRight from "./slidesOnRight";
import slidesOnLeft from "./slidesOnLeft";

export default function siblingDirection(spec) {
  if (spec.targetSlide > spec.currentSlide) {
    if (spec.targetSlide > spec.currentSlide + slidesOnRight(spec)) {
      return "left";
    }
    return "right";
  } else {
    if (spec.targetSlide < spec.currentSlide - slidesOnLeft(spec)) {
      return "right";
    }
    return "left";
  }
}

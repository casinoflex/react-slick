import getPreClones from "./getPreClones";
import getPostClones from "./getPostClones";

export default function getTotalSlides(spec) {
  if (spec.slideCount === 1) return 1;

  return getPreClones(spec) + spec.slideCount + getPostClones(spec);
}

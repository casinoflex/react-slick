export default function slidesOnLeft({
  slidesToShow,
  centerMode,
  rtl,
  centerPadding
}) {
  // returns no of slides on the left of active slide
  if (centerMode) {
    let left = (slidesToShow - 1) / 2 + 1;
    if (parseInt(centerPadding) > 0) left += 1;
    if (!rtl && slidesToShow % 2 === 0) left += 1;
    return left;
  }
  if (rtl) {
    return slidesToShow - 1;
  }
  return 0;
}

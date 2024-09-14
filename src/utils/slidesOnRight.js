export default function slidesOnRight({
  slidesToShow,
  centerMode,
  rtl,
  centerPadding
}) {
  // returns no of slides on the right of active slide
  if (centerMode) {
    let right = (slidesToShow - 1) / 2 + 1;
    if (parseInt(centerPadding) > 0) right += 1;
    if (rtl && slidesToShow % 2 === 0) right += 1;
    return right;
  }
  if (rtl) {
    return 0;
  }
  return slidesToShow - 1;
}

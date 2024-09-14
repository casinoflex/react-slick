export default function lazySlidesOnLeft(spec) {
  if (!spec.centerMode) return 0;

  return (
    Math.floor(spec.slidesToShow / 2) +
    (parseInt(spec.centerPadding) > 0 ? 1 : 0)
  );
}

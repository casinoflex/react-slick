export default function getNavigableIndexes(spec) {
  let max = spec.infinite ? spec.slideCount * 2 : spec.slideCount;
  let breakpoint = spec.infinite ? spec.slidesToShow * -1 : 0;
  let counter = spec.infinite ? spec.slidesToShow * -1 : 0;
  let indexes = [];
  while (breakpoint < max) {
    indexes.push(breakpoint);
    breakpoint = counter + spec.slidesToScroll;
    counter += Math.min(spec.slidesToScroll, spec.slidesToShow);
  }
  return indexes;
}

import React from "react";
import $ from "jquery";
import assign from "object-assign";
import { render } from "@testing-library/react";
import Slider from "../src/components/Slider";
import InnerSlider from "../src/components/InnerSlider";
import defaultProps from "../src/constants/default-props";
import * as slickCarousel from "slick-carousel"; // defining slick in global environment
import getTrackLeft from "../src/utils/getTrackLeft";
import {
  getActiveSlides,
  getActiveSlidesCount,
  clickNext,
  clickPrevious
} from "../test-utils";

// finds active slide number in the last transition in the forward direction
export function activeSlideInLastTransition(
  noOfSlides,
  slidesToShow,
  slidesToScroll
) {
  let currentSlide = 0;
  while (currentSlide < noOfSlides) {
    currentSlide += slidesToScroll;
  }
  return currentSlide - slidesToScroll;
}

// create jsx-form children for react slider
export function createReactSliderChildren(noOfSlides) {
  return Array.from(Array(noOfSlides).keys()).map((i) => (
    <div key={i}>
      <h3>{i + 1}</h3>
    </div>
  ));
}

// create a react-slider with given noOfSlides and other props
// variable widths are ignored for now for simplicity
export function createReactSlider({ noOfSlides, ...props }) {
  return <Slider {...props}>{createReactSliderChildren(noOfSlides)}</Slider>;
}

// create a react inner-slider with given noOfSlides and other props
// performs most operations like the ones when mounted inside Slider component
export function createInnerSlider({ noOfSlides, ...settings }) {
  if (settings.centerMode) {
    settings.slidesToScroll = 1; // always scroll by one when centerMode is enabled
  }
  settings = assign({}, defaultProps, settings);
  const children = React.Children.toArray(
    createReactSliderChildren(noOfSlides)
  );
  return <InnerSlider {...settings}>{children}</InnerSlider>;
}

export function createInnerSliderWrapper(settings) {
  return render(createInnerSlider(settings)).container;
}

// creates a dom string, containing children of slick children
export function createJQuerySliderChildren(noOfSlides) {
  let children = [];
  for (let i = 0; i < noOfSlides; i++) {
    children.push(`<div><h3>${i + 1}</h3></div>`);
  }
  return children.join("");
}

// performs the very basic tests while clicking next or prev
export function testSliderScroll({ direction, ...settings }) {
  const { noOfSlides, slidesToShow, slidesToScroll, initialSlide } = settings;
  // initialize react slider
  const { container } = render(createReactSlider(settings));
  // initialize jquery slider
  document.body.innerHTML = `
  <section class="regular slider">
    ${createJQuerySliderChildren(noOfSlides)}
  </section>
  `;
  $(".regular.slider").slick({
    ...settings
  });
  // console.log('setings:', settings)

  let expectedSlideIndex = initialSlide || 0;
  for (let click = 0; click < 2 * noOfSlides + 2; click++) {
    let activeslides = getActiveSlides(container);
    let $activeSlides = $(".regular.slider").find("div.slick-active");
    expect(getActiveSlidesCount(container)).toEqual(slidesToShow || 1);
    expect($activeSlides.length).toEqual(slidesToShow || 1);
    let firstActiveSlide = activeslides[0];
    let $firstActiveSlide = $activeSlides.first();
    // console.log('classes', $firstActiveSlide.attr('data-slick-index'))
    // console.warn('currentSlide:', firstActiveSlide.prop('data-index'), 'expected slide', expectedSlideIndex)
    expect(parseInt(firstActiveSlide.getAttribute("data-index"))).toEqual(
      expectedSlideIndex % noOfSlides
    );
    expect(parseInt($firstActiveSlide.attr("data-slick-index"))).toEqual(
      expectedSlideIndex % noOfSlides
    );
    if (direction === "next") {
      // click the next arrow button
      clickNext(container);
      $("button.slick-next").click();
      expectedSlideIndex += slidesToScroll || 1;
      if (expectedSlideIndex >= noOfSlides) {
        expectedSlideIndex = 0;
      }
    } else {
      // click on the prev arrow button
      clickPrevious(container);
      $("button.slick-prev").click();
      expectedSlideIndex -= slidesToScroll || 1;
      if (expectedSlideIndex < 0) {
        expectedSlideIndex = activeSlideInLastTransition(
          noOfSlides,
          slidesToShow,
          slidesToScroll
        );
      }
    }
  }
}

// function to run tests on a slider,
// scrolls slider to the right by clicking right arrow several times
// scrolls slider to the left by clicking left arrow several times
export function testSlider(settings) {
  const settings1 = { direction: "next", ...settings };
  const settings2 = { direction: "prev", ...settings };
  testSliderScroll(settings1);
  testSliderScroll(settings2);
}

export const tryAllConfigs = (settings, settingsList) => {
  let leaf = true;
  for (let key of Object.keys(settings)) {
    if (Array.isArray(settings[key])) {
      leaf = false;
      for (let val of settings[key]) {
        tryAllConfigs({ ...settings, [key]: val }, settingsList);
      }
    }
  }
  if (leaf) {
    if (
      settingsList
        .map((setting) => JSON.stringify(setting))
        .indexOf(JSON.stringify(settings)) < 0
    ) {
      settingsList.push(settings);
    }
  }
};

export const actualTrackLeft = (container) =>
  container
    .querySelector(".slick-track")
    .style.transform.match(/translate3d\((\d+)px/i)[1];

export const testTrackLeft = (container) => {
  let trackLeft = parseInt(actualTrackLeft(container));
  let spec = assign({}, wrapper.props(), wrapper.state(), {
    slideIndex: wrapper.state().currentSlide,
    trackRef: null
  });
  let expectedTrackLeft = getTrackLeft(spec);
  expect(trackLeft).toEqual(parseInt(expectedTrackLeft));
};
test("fake test", () => {
  expect(1).toBe(1);
});

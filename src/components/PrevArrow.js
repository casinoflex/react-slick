"use strict";

import React from "react";
import classnames from "classnames";

export default class PrevArrow extends React.PureComponent {
  clickHandler(options, e) {
    if (e) {
      e.preventDefault();
    }
    this.props.clickHandler(options, e);
  }
  render() {
    let prevClasses = { "slick-arrow": true, "slick-prev": true };
    let prevHandler = this.clickHandler.bind(this, { message: "previous" });

    if (
      !this.props.infinite &&
      (this.props.currentSlide === 0 ||
        this.props.slideCount <= this.props.slidesToShow)
    ) {
      prevClasses["slick-disabled"] = true;
      prevHandler = null;
    }

    let prevArrowProps = {
      key: "0",
      "data-role": "none",
      className: classnames(prevClasses),
      style: { display: "block" },
      onClick: prevHandler
    };
    let customProps = {
      currentSlide: this.props.currentSlide,
      slideCount: this.props.slideCount
    };
    let prevArrow;

    if (this.props.prevArrow) {
      prevArrow = React.cloneElement(this.props.prevArrow, {
        ...prevArrowProps,
        ...customProps
      });
    } else {
      prevArrow = (
        <button key="0" type="button" {...prevArrowProps}>
          {" "}
          Previous
        </button>
      );
    }

    return prevArrow;
  }
}

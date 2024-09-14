"use strict";

import React from "react";
import classnames from "classnames";
import canGoNext from "../utils/canGoNext";

export default class NextArrow extends React.PureComponent {
  clickHandler(options, e) {
    if (e) {
      e.preventDefault();
    }
    this.props.clickHandler(options, e);
  }
  render() {
    let nextClasses = { "slick-arrow": true, "slick-next": true };
    let nextHandler = this.clickHandler.bind(this, { message: "next" });

    if (!canGoNext(this.props)) {
      nextClasses["slick-disabled"] = true;
      nextHandler = null;
    }

    let nextArrowProps = {
      key: "1",
      "data-role": "none",
      className: classnames(nextClasses),
      style: { display: "block" },
      onClick: nextHandler
    };
    let customProps = {
      currentSlide: this.props.currentSlide,
      slideCount: this.props.slideCount
    };
    let nextArrow;

    if (this.props.nextArrow) {
      nextArrow = React.cloneElement(this.props.nextArrow, {
        ...nextArrowProps,
        ...customProps
      });
    } else {
      nextArrow = (
        <button key="1" type="button" {...nextArrowProps}>
          {" "}
          Next
        </button>
      );
    }

    return nextArrow;
  }
}

"use strict";

import React from "react";
import json2mq from "json2mq";
import defaultProps from "../constants/default-props";
import canUseDOM from "../utils/canUseDOM";
import filterSettings from "../utils/filterSettings";
import InnerSlider from "./InnerSlider";

export default class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakpoint: null
    };

    this._responsiveMediaHandlers = [];
  }

  innerSliderRefHandler = (ref) => (this.innerSlider = ref);

  media(query, handler) {
    // javascript handler for  css media query
    const mql = window.matchMedia(query);
    const listener = ({ matches }) => matches && handler();

    mql.addListener(listener);
    listener(mql);
    this._responsiveMediaHandlers.push({ mql, query, listener });
  }

  componentDidMount() {
    if (!this.props.responsive) return;

    // sort them in increasing order of their numerical value
    const breakpoints = this.props.responsive
      .map(({ breakpoint }) => breakpoint)
      .sort((x, y) => x - y);

    breakpoints.forEach((breakpoint, index) => {
      // media query for each breakpoint
      const brakepointQuery = json2mq({
        minWidth: index === 0 ? 0 : breakpoints[index - 1] + 1,
        maxWidth: breakpoint
      });

      // when not using server side rendering
      canUseDOM() &&
        this.media(brakepointQuery, () =>
          this.setState({ breakpoint: breakpoint })
        );
    });

    // Register media query for full screen. Need to support resize from small to large
    // convert javascript object to media query string
    const query = json2mq({ minWidth: breakpoints.slice(-1)[0] });

    canUseDOM() && this.media(query, () => this.setState({ breakpoint: null }));
  }

  componentWillUnmount() {
    this._responsiveMediaHandlers.forEach(function (obj) {
      obj.mql.removeListener(obj.listener);
    });
  }

  slickPrev = () => this.innerSlider.slickPrev();

  slickNext = () => this.innerSlider.slickNext();

  slickGoTo = (slide, dontAnimate = false) =>
    this.innerSlider.slickGoTo(slide, dontAnimate);

  slickPause = () => this.innerSlider.pause("paused");

  slickPlay = () => this.innerSlider.autoPlay("play");

  currentBrakepointSettings() {
    if (!this.state.breakpoint) return {};

    return this.props.responsive.filter(
      ({ breakpoint }) => breakpoint === this.state.breakpoint
    )[0].settings;
  }

  currentSettings() {
    return {
      ...defaultProps,
      ...this.props,
      ...this.currentBrakepointSettings()
    };
  }

  checkForOneSlideLimit(settings) {
    if (process.env.NODE_ENV === "production") return;

    if (settings.centerMode && settings.slidesToScroll > 1) {
      console.warn(
        `slidesToScroll should be equal to 1 in centerMode, you are using ${settings.slidesToScroll}`
      );

      settings.slidesToScroll = 1;
    }

    if (settings.fade && settings.slidesToShow > 1) {
      console.warn(
        `slidesToScroll should be equal to 1 when fade is true, you're using ${settings.slidesToScroll}`
      );

      settings.slidesToScroll = 1;
    }

    if (settings.fade && settings.slidesToShow > 1) {
      console.warn(
        `slidesToShow should be equal to 1 when fade is true, you're using ${settings.slidesToShow}`
      );

      settings.slidesToShow;
    }
  }

  checkForWariableWidthLimit(settings) {
    // rows and slidesPerRow logic is handled here
    if (
      settings.variableWidth &&
      (settings.rows > 1 || settings.slidesPerRow > 1)
    ) {
      console.warn(
        `variableWidth is not supported in case of rows > 1 or slidesPerRow > 1`
      );

      settings.variableWidth = false;
    }
  }

  rawFilteredChildren() {
    // Children may contain false or null, so we should filter them
    // children may also contain string filled with spaces (in certain cases where we use jsx strings)
    return React.Children.toArray(this.props.children).filter((child) => {
      if (typeof child === "string") return !!child.trim();

      return !!child;
    });
  }

  currentChildren(settings) {
    const children = this.rawFilteredChildren();
    const newChildren = [];
    let currentWidth = null;

    for (
      let i = 0;
      i < children.length;
      i += settings.rows * settings.slidesPerRow
    ) {
      let newSlide = [];

      for (
        let j = i;
        j < i + settings.rows * settings.slidesPerRow;
        j += settings.slidesPerRow
      ) {
        let row = [];

        for (let k = j; k < j + settings.slidesPerRow; k += 1) {
          if (settings.variableWidth && children[k].props.style) {
            currentWidth = children[k].props.style.width;
          }

          if (k >= children.length) break;

          row.push(
            React.cloneElement(children[k], {
              key: 100 * i + 10 * j + k,
              tabIndex: -1,
              style: {
                width: `${100 / settings.slidesPerRow}%`,
                display: "inline-block"
              }
            })
          );
        }

        newSlide.push(<div key={10 * i + j}>{row}</div>);
      }

      newChildren.push(
        <div
          key={i}
          style={settings.variableWidth ? { width: currentWidth } : {}}
        >
          {newSlide}
        </div>
      );
    }

    return newChildren;
  }

  render() {
    const settings = this.currentSettings();

    if (settings === "unslick") {
      return (
        <div className={`regular slider ${this.props.className || ""}`}>
          {this.rawFilteredChildren()}
        </div>
      );
    }

    this.checkForOneSlideLimit(settings);
    this.checkForWariableWidthLimit(settings);

    const children = this.currentChildren(settings);

    if (children.length <= settings.slidesToShow && !settings.infinite) {
      settings.unslick = true;
    }

    return (
      <InnerSlider
        style={this.props.style}
        ref={this.innerSliderRefHandler}
        {...filterSettings(settings)}
      >
        {children}
      </InnerSlider>
    );
  }
}

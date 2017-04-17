import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { isEqual, transitionEventName, animationFramePolyfill } from './utils';

export default class AnimakitExpander extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animation: false,
      prepare: false,
      expanded: false,

      size: 0,

      duration: 0,
    };
  }

  componentWillMount() {
    this.contentNode = null;
    this.canAnimate = !this.props.expanded;

    this.transitionEventName = transitionEventName();

    this.listeners = this.getListeners();

    this.animationReset = false;
    this.animationResetTO = null;
    this.resizeCheckerRAF = null;
  }

  componentDidMount() {
    this.repaint(this.props);

    this.toggleAnimationListener(true);
  }

  componentWillReceiveProps(nextProps) {
    this.repaint(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !isEqual(nextState, this.state);

    const childrenChanged = !isEqual(nextProps.children, this.props.children);

    return stateChanged || childrenChanged;
  }

  componentWillUpdate() {
    this.toggleResizeChecker(false);
  }

  componentDidUpdate() {
    this.toggleResizeChecker(true);
  }

  componentWillUnmount() {
    this.toggleResizeChecker(false);
    this.toggleAnimationReset(false);
    this.toggleAnimationListener(false);
  }

  getListeners() {
    return {
      onCheckResize: this.onCheckResize.bind(this),
      onTransitionEnd: this.onTransitionEnd.bind(this),
    };
  }

  toggleResizeChecker(start) {
    if (typeof requestAnimationFrame === 'undefined') {
      animationFramePolyfill();
    };

    if (start) {
      this.resizeCheckerRAF = requestAnimationFrame(this.listeners.onCheckResize);
    } else if (this.resizeCheckerRAF) {
      cancelAnimationFrame(this.resizeCheckerRAF);
    }
  }

  toggleAnimationReset(add) {
    if (this.animationResetTO) clearTimeout(this.animationResetTO);

    if (add) {
      this.animationResetTO = setTimeout(() => {
        this.animationReset = true;
      }, this.state.duration);
    } else {
      this.animationReset = false;
    }
  }

  toggleAnimationListener(add) {
    const method = add ? 'addEventListener' : 'removeEventListener';
    this.rootNode[method](this.transitionEventName, this.listeners.onTransitionEnd, false);
  }

  onTransitionEnd() {
    if (!this.animationReset) return;

    this.setState({
      animation: false,
    });
  }

  onCheckResize() {
    this.toggleResizeChecker(false);

    this.repaint(this.props);

    this.toggleResizeChecker(true);
  }

  getRootStyles() {
    const { animation, expanded, prepare } = this.state;

    if (!animation && !prepare && !this.props.children) return {};

    const position = 'relative';
    const overflow = 'hidden';
    const horizontal = this.props.horizontal;

    const size = expanded || prepare ? `${this.state.size}px` : 0;
    const styles = horizontal ? { width: size } : { height: size };

    if (!animation && !prepare) {
      if (expanded && !prepare) return {};

      return { ...styles };
    }

    const easing = this.props.easing;
    const duration = this.state.duration;

    const dimension = horizontal ? 'width' : 'height';
    const transition = `${dimension} ${duration}ms ${easing}`;

    return { position, overflow, transition, ...styles };
  }

  getContentStyles() {
    const { animation, prepare } = this.state;

    if (!animation && !prepare && !this.props.children) return {};

    const { horizontal, align } = this.props;

    if (horizontal) {
      const float = align === 'right' ? 'right' : 'left';

      return { float };
    }

    if (align === 'bottom' && animation) {
      return {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
      };
    }

    return {};
  }

  getClearance() {
    return (
      <span style={{ display: 'table', height: 0 }} />
    );
  }

  calcDuration(size) {
    if (!this.canAnimate) {
      this.canAnimate = true;
      return 0;
    }

    const { durationPerPx, duration } = this.props;

    if (!durationPerPx) return duration;

    const sizeDiff = Math.abs(this.state.size - size);
    return durationPerPx * sizeDiff;
  }

  calcSize() {
    const node = this.contentNode;
    const newSize = this.props.horizontal ? node.offsetWidth : node.offsetHeight;
    const size = this.state.size;

    return (Math.abs(newSize - size) <= 1) ? size : newSize;
  }

  repaint(nextProps) {
    const expanded = nextProps.expanded;

    const { expanded: curExpanded, prepare: curPrepare } = this.state;

    if (curExpanded === expanded && !curPrepare) return;

    let size = 0;
    const lastSize = this.state.size;

    if (curExpanded && (!expanded || (curPrepare && expanded))) {
      size = this.calcSize();
      if (!size) {
        if (!expanded) size = lastSize;
      }
    }

    const prepare = !curPrepare && (curExpanded !== expanded);
    const animation = !prepare;
    const duration = animation ? this.calcDuration(expanded ? size : 0) : 0;

    const state = { expanded, size, prepare, animation, duration };

    setTimeout(() => {
      this.applyState(state);
    }, +curPrepare);
  }

  applyState(state) {
    if (!Object.keys(state).length) return;

    if (state.animation) {
      this.toggleAnimationReset(false);
    }

    this.setState(state);

    if (state.animation) {
      this.toggleAnimationReset(true);
    }
  }

  render() {
    const { animation, expanded, prepare } = this.state;
    const showChildren = expanded || prepare || animation;
    const hasChildren = !!this.props.children;

    return (
      <div
        ref={(c) => { this.rootNode = c; }}
        style={ showChildren ? this.getRootStyles() : {} }
      >
        <div
          ref={(c) => { this.contentNode = c; }}
          style={ showChildren ? this.getContentStyles() : {} }
        >
          { showChildren && hasChildren && this.getClearance() }
          { showChildren && this.props.children }
          { showChildren && hasChildren && this.getClearance() }
        </div>
      </div>
    );
  }
}

AnimakitExpander.propTypes = {
  children: PropTypes.any,
  expanded: PropTypes.bool,
  horizontal: PropTypes.bool,
  align: PropTypes.string,
  duration: PropTypes.number,
  durationPerPx: PropTypes.number,
  easing: PropTypes.string,
  smoothResize: PropTypes.bool,
};

AnimakitExpander.defaultProps = {
  expanded: true,
  horizontal: false,
  align: 'left',
  duration: 500,
  durationPerPx: 0,
  easing: 'ease-out',
};

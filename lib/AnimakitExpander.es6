import React        from 'react';
import AnimakitBase from 'animakit-core';

export default class AnimakitExpander extends AnimakitBase {
  static propTypes = {
    children:      React.PropTypes.any,
    expanded:      React.PropTypes.bool,
    horizontal:    React.PropTypes.bool,
    align:         React.PropTypes.string,
    duration:      React.PropTypes.number,
    durationPerPx: React.PropTypes.number,
    easing:        React.PropTypes.string,
    smoothResize:  React.PropTypes.bool,
  };

  static defaultProps = {
    expanded:      true,
    horizontal:    false,
    align:         'left',
    duration:      500,
    durationPerPx: 0,
    easing:        'ease-out',
    smoothResize:  false,
  };

  state = {
    size:      -1,
    duration:  0,
    animation: false,
    expanded:  false,
  };

  init() {
    this.contentNode      = null;
    this.contentMounted   = false;
  }

  getDuration() {
    return this.state.duration;
  }

  getRootStyles() {
    if (!this.state.animation && !this.props.children) return {};

    const position = 'relative';
    const overflow = 'hidden';
    const horizontal = this.props.horizontal;

    const size = this.state.expanded ? `${this.state.size}px` : 0;
    const styles =  horizontal ? { width: size } : { height: size };

    if (!this.state.animation) {
      return { ...styles };
    }

    const easing = this.props.easing;
    const duration = this.state.duration;

    const dimension = horizontal ? 'width' : 'height';
    const transition = `${dimension} ${duration}ms ${easing}`;

    return { position, overflow, transition, ...styles };
  }

  getContentStyles() {
    if (!this.state.animation && !this.props.children) return {};

    const { horizontal, align } = this.props;

    if (horizontal) {
      const float = align === 'right' ? 'right' : 'left';

      return { float };
    }

    if (align === 'bottom' && this.state.animation) {
      return {
        position: 'absolute',
        bottom:   0,
        left:     0,
        width:    '100%',
      };
    }

    return {};
  }

  getClearance() {
    return (
      <span style = {{ display: 'table', height: 0 }} />
    );
  }

  getChildrenCount(children) {
    const length = Array.isArray(children) ? children.length : 1;

    if (length > 1) return length;

    return children ? 1 : 0;
  }

  calcDuration(size) {
    if (!this.props.durationPerPx) return this.props.duration;

    const sizeDiff = Math.abs(this.state.size - size);
    return this.props.durationPerPx * sizeDiff;
  }

  calcSize() {
    if (!this.state.expanded) return 0;

    const node = this.contentNode;
    // return this.props.horizontal ? node.offsetWidth : node.offsetHeight;

    const rect = node.getBoundingClientRect();
    return Math.ceil(rect[this.props.horizontal ? 'width' : 'height']);
  }

  repaint(nextProps) {
    const expanded = nextProps.expanded;
    const size = this.calcSize();

    if (this.state.expanded === expanded && this.state.size === size) return;

    const expansionChanged = this.props.smoothResize ||
                            (this.state.expanded !== expanded) ||
                            (this.state.size === 0 || size === 0);

    const duration = this.calcDuration(expanded ? size : 0);
    const animation = this.contentMounted && expansionChanged;
    const state = { expanded, size, duration, animation };

    if (this.state.size === -1) {
      setTimeout(() => {
        this.contentMounted = true;
      }, 1);
    }

    this.applyState(state);
  }

  render() {
    const showChildren = this.state.expanded || this.state.animation;
    const hasChildren = !!this.props.children;

    return (
      <div style = { showChildren ? this.getRootStyles() : {} }>
        <div
          ref = {(c) => { this.contentNode = c; }}
          style = { showChildren ? this.getContentStyles() : {} }
        >
          { showChildren && hasChildren && this.getClearance() }
          { showChildren && this.props.children }
          { showChildren && hasChildren && this.getClearance() }
        </div>
      </div>
    );
  }
}

import React        from 'react';
import AnimakitBase from 'animakit-core';

export default class AnimakitExpander extends AnimakitBase {
  constructor(props) {
    super(props);

    this.state = {
      size:      0,
      lastSize:  0,
      duration:  0,
      animation: false,
      prepare:   false,
      expanded:  false,
    };
  }

  init() {
    this.contentNode = null;
    this.canAnimate  = !this.props.expanded;
  }

  getDuration() {
    return this.state.duration;
  }

  getRootStyles() {
    if (!this.state.animation && !this.state.prepare && !this.props.children) return {};

    const position = 'relative';
    const overflow = 'hidden';
    const horizontal = this.props.horizontal;

    const size = this.state.expanded || this.state.prepare ? `${this.state.size}px` : 0;
    const styles =  horizontal ? { width: size } : { height: size };

    if (!this.state.animation && !this.state.prepare) {
      if (this.state.expanded && !this.state.prepare) return {};
      return { ...styles };
    }

    const easing = this.props.easing;
    const duration = this.state.duration;

    const dimension = horizontal ? 'width' : 'height';
    const transition = `${dimension} ${duration}ms ${easing}`;

    return { position, overflow, transition, ...styles };
  }

  getContentStyles() {
    if (!this.state.animation && !this.state.prepare && !this.props.children) return {};

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

  calcDuration(size) {
    if (!this.canAnimate) {
      this.canAnimate = true;
      return 0;
    }

    if (!this.props.durationPerPx) return this.props.duration;

    const sizeDiff = Math.abs(this.state.size - size);
    return this.props.durationPerPx * sizeDiff;
  }

  calcSize() {
    const node = this.contentNode;
    // return this.props.horizontal ? node.offsetWidth : node.offsetHeight;

    const rect = node.getBoundingClientRect();
    return Math.ceil(rect[this.props.horizontal ? 'width' : 'height']);
  }

  repaint(nextProps) {
    const expanded = nextProps.expanded;

    const { expanded: curExpanded, prepare: curPrepare } = this.state;

    if (curExpanded === expanded && !curPrepare) return;

    let size = 0;
    let lastSize = this.state.lastSize;

    if (curExpanded && (!expanded || (curPrepare && expanded))) {
      size = this.calcSize();
      if (!size) {
        if (!expanded) size = lastSize;
      } else {
        lastSize = size;
      }
    }

    const prepare = !curPrepare && (curExpanded !== expanded);
    const animation = !prepare;
    const duration = animation ? this.calcDuration(expanded ? size : 0) : 0;

    const state = { expanded, size, lastSize, prepare, animation, duration };

    setTimeout(() => {
      this.applyState(state);
    }, +curPrepare);
  }

  render() {
    const showChildren = this.state.expanded || this.state.prepare || this.state.animation;
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

AnimakitExpander.propTypes = {
  children:      React.PropTypes.any,
  expanded:      React.PropTypes.bool,
  horizontal:    React.PropTypes.bool,
  align:         React.PropTypes.string,
  duration:      React.PropTypes.number,
  durationPerPx: React.PropTypes.number,
  easing:        React.PropTypes.string,
  smoothResize:  React.PropTypes.bool,
};

AnimakitExpander.defaultProps = {
  expanded:      true,
  horizontal:    false,
  align:         'left',
  duration:      500,
  durationPerPx: 0,
  easing:        'ease-out',
};

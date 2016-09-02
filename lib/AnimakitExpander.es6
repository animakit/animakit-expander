import React       from 'react';
import { isEqual } from 'animakit-core';

export default class AnimakitExpander extends React.Component {
  static propTypes = {
    children:      React.PropTypes.any,
    expanded:      React.PropTypes.bool,
    horizontal:    React.PropTypes.bool,
    align:         React.PropTypes.string,
    duration:      React.PropTypes.number,
    durationPerPx: React.PropTypes.number,
    easing:        React.PropTypes.string,
  };

  static defaultProps = {
    expanded:      true,
    horizontal:    false,
    align:         'left',
    duration:      500,
    durationPerPx: 0,
    easing:        'ease-out',
  };

  state = {
    size:      -1,
    duration:  0,
    animation: false,
    expanded:  false,
  };

  componentWillMount() {
    this.init();
  }

  componentDidMount() {
    this.initLoad();

    this.repaint(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.repaint(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !isEqual(nextState, this.state);

    const propsChanged = !isEqual(nextProps.children, this.props.children);

    return stateChanged || propsChanged;
  }

  componentWillUpdate() {
    this.cancelResizeChecker();
  }

  componentDidUpdate() {
    this.startResizeChecker();
  }

  componentWillUnmount() {
    this.cancelResizeChecker();
    this.cancelAnimationReset();
    this.cancelLoad();
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

  init() {
    this.contentNode      = null;
    this.animationResetTO = null;
    this.resizeCheckerRAF = null;
    this.winLoaded        = false;
    this.contentMounted   = false;

    this.listeners = {
      checkResize: this.checkResize.bind(this),
      winOnLoad:   this.winOnLoad.bind(this),
    };
  }

  initLoad() {
    if (!window || document.readyState === 'complete') {
      this.winLoaded = true;
      return;
    }

    window.addEventListener('load', this.listeners.winOnLoad, false);
  }

  cancelLoad() {
    if (!window || this.winLoaded) {
      return;
    }

    window.removeEventListener('load', this.listeners.winOnLoad, false);
  }

  winOnLoad() {
    this.winLoaded = true;
  }

  startResizeChecker() {
    if (typeof requestAnimationFrame === 'undefined') return;
    this.resizeCheckerRAF = requestAnimationFrame(this.listeners.checkResize);
  }

  cancelResizeChecker() {
    if (typeof requestAnimationFrame === 'undefined') return;
    if (this.resizeCheckerRAF) cancelAnimationFrame(this.resizeCheckerRAF);
  }

  startAnimationReset() {
    this.animationResetTO = setTimeout(() => {
      this.setState({
        animation: false,
      });
    }, this.state.duration);
  }

  cancelAnimationReset() {
    if (this.animationResetTO) clearTimeout(this.animationResetTO);
  }

  checkResize() {
    this.cancelResizeChecker();

    this.repaint(this.props);

    this.startResizeChecker();
  }

  calcDuration(size) {
    if (!this.props.durationPerPx) return this.props.duration;

    const sizeDiff = Math.abs(this.state.size - size);
    return this.props.durationPerPx * sizeDiff;
  }

  calcSize() {
    if (!this.state.expanded) return 0;

    const node = this.contentNode;
    return this.props.horizontal ? node.offsetWidth : node.offsetHeight;
  }

  repaint(nextProps) {
    const expanded = nextProps.expanded;
    const size = this.calcSize();

    if (this.state.expanded === expanded && this.state.size === size) return;

    const duration = this.calcDuration(expanded ? size : 0);
    const animation = this.winLoaded && this.contentMounted;
    const state = { expanded, size, duration, animation };

    if (this.state.size === -1) {
      setTimeout(() => {
        this.contentMounted = true;
      }, 1);
    }

    if (animation) {
      this.cancelAnimationReset();
    }

    this.setState(state);

    if (animation) {
      this.startAnimationReset();
    }
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

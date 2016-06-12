import React           from 'react';
import { findDOMNode } from 'react-dom';
import { isEqual }     from 'animakit-core';

export default class AnimakitExpander extends React.Component {
  static propTypes = {
    children:      React.PropTypes.any,
    expanded:      React.PropTypes.bool,
    horizontal:    React.PropTypes.bool,
    align:         React.PropTypes.string,
    duration:      React.PropTypes.number,
    durationPerPx: React.PropTypes.number,
    easing:        React.PropTypes.string
  };

  static defaultProps = {
    expanded:      true,
    horizontal:    false,
    align:         'left',
    duration:      500,
    durationPerPx: 0,
    easing:        'ease-out'
  };

  state = {
    size:      -1,
    duration:  0,
    animation: false,
    expanded:  false
  };

  contentNode      = null;
  resizeCheckerRAF = null;
  animationResetTO = null;

  componentDidMount() {
    this.contentNode = findDOMNode(this.refs.content);
    this.repaint(this.props, true);
  }

  componentWillReceiveProps(nextProps) {
    this.repaint(nextProps);
  }

  componentWillUpdate() {
    this.cancelResizeChecker();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !isEqual(nextState, this.state);

    const propsChanged = !isEqual(nextProps.children, this.props.children);

    return stateChanged || propsChanged;
  }

  componentDidUpdate() {
    this.startResizeChecker();
  }

  componentWillUnmount() {
    this.cancelResizeChecker();
    this.cancelAnimationReset();
  }

  startResizeChecker() {
    if (typeof requestAnimationFrame === 'undefined') return;
    this.resizeCheckerRAF = requestAnimationFrame(this.checkResize.bind(this));
  }

  cancelResizeChecker() {
    if (typeof requestAnimationFrame === 'undefined') return;
    if (this.resizeCheckerRAF) cancelAnimationFrame(this.resizeCheckerRAF);
  }

  startAnimationReset() {
    this.animationResetTO = setTimeout(() => {
      this.setState({
        animation: false
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

  repaint(nextProps, first = false) {
    const expanded = nextProps.expanded;
    const size = this.calcSize();

    if (this.state.expanded === expanded && this.state.size === size) return;

    const duration = this.calcDuration(expanded ? size : 0);
    const animation = !first;
    const state = { expanded, size, duration, animation };

    if (animation) {
      this.cancelAnimationReset();
    }

    this.setState(state);

    if (animation) {
      this.startAnimationReset();
    }
  }

  getWrapperStyles() {
    const position = 'relative';
    const overflow = 'hidden';
    const horizontal = this.props.horizontal;

    const size = this.state.expanded ? `${ this.state.size }px` : 0;
    const styles =  horizontal ? { width: size } : { height: size };

    if (!this.state.animation) {
      return { ...styles };
    }

    const easing = this.props.easing;
    const duration = this.state.duration;

    const dimension = horizontal ? 'width' : 'height';
    const transition = `${ dimension } ${ duration }ms ${ easing }`;

    return { position, overflow, transition, ...styles };
  }

  getContentStyles() {
    if (this.props.horizontal) {
      const float = this.props.align === 'right' ? 'right' : 'left';

      return { float };
    }

    if (this.props.align === 'bottom' && this.state.animation) {
      return {
        position: 'absolute',
        bottom:   0,
        left:     0,
        width:    '100%'
      };
    }

    return {};
  }

  render() {
    return (
      <div>
        <div style = { this.getWrapperStyles() }>
          <div
            ref = "content"
            style = { this.getContentStyles() }
          >
            <span style = {{ display: 'table', height: 0 }}></span>
            { (this.state.expanded || this.state.animation) && this.props.children }
          </div>
        </div>
      </div>
    );
  }
}

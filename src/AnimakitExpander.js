import React                        from 'react';
import { findDOMNode }              from 'react-dom';

import styles                       from './styles.js';
import useSheet                     from 'react-jss';
import jss                          from 'jss';
import nested                       from 'jss-nested';

import { isEqual, genUniqueString } from 'animakit-core';

jss.use(nested());

class AnimakitExpander extends React.Component {
  static propTypes = {
    children:   React.PropTypes.any,
    expanded:   React.PropTypes.bool,
    horizontal: React.PropTypes.bool,
    align:      React.PropTypes.string,
    duration:   React.PropTypes.number,
    easing:     React.PropTypes.string
  };

  static defaultProps = {
    expanded:   true,
    horizontal: false,
    align:      'left',
    duration:   500,
    easing:     'ease-out'
  };

  state = {
    animation: false,
    expanded:  false
  };

  styleSheetNode   = null;
  animationNames   = null;
  contentNode      = null;
  contentSize      = 0;
  animationResetTO = null;

  componentWillMount() {
    this.styleSheetNode = document.createElement('style');
    document.head.appendChild(this.styleSheetNode);
  }

  componentDidMount() {
    this.contentNode = findDOMNode(this.refs.content);
    this.repaint(this.props, true);
  }

  componentWillReceiveProps(nextProps) {
    this.repaint(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !isEqual(this.state, nextState);

    return stateChanged;
  }

  componentWillUnmount() {
    this.cancelAnimationReset();
  }

  startAnimationReset() {
    this.animationResetTO = setTimeout(() => {
      this.setState({
        animation: false
      });
    }, this.props.duration);
  }

  cancelAnimationReset() {
    if (this.animationResetTO) clearTimeout(this.animationResetTO);
  }

  checkResize() {
    const size = this.calcSize();
    if (size !== this.contentSize) {
      this.contentSize = size;
      this.resetAnimationNames();
      this.resetAnimationStyles();
    }
  }

  calcSize() {
    const node = this.contentNode;
    return this.props.horizontal ? node.offsetWidth : node.offsetHeight;
  }

  resetDimensionsState(stateChunk) {
    const { width, height } = stateChunk;

    if (
      width === this.state.width &&
      height === this.state.height
    ) return {};

    return stateChunk;
  }

  repaint(nextProps, first = false) {
    const expanded = nextProps.expanded;

    if (this.state.expanded === expanded) return;

    const animation = !first;
    const state = { expanded, animation };

    if (animation) {
      this.checkResize();
      this.cancelAnimationReset();
    }

    this.setState(state);

    if (animation) {
      this.startAnimationReset();
    }
  }

  resetAnimationNames() {
    const uniqueString = genUniqueString();
    const expand = `AnimakitExpanderExpand-${ uniqueString }`;
    const collapse = `AnimakitExpanderCollapse-${ uniqueString }`;

    this.animationNames = { expand, collapse };
  }

  getAnimationStyle(expand) {
    const name = this.animationNames[expand ? 'expand' : 'collapse'];
    const dimension = this.props.horizontal ? 'width' : 'height';
    const size = this.contentSize;
    const from = expand ? 0 : size;
    const to = expand ? size : 0;

    return `@keyframes ${ name } { from { ${ dimension }: ${ from }px; } to { ${ dimension }: ${ to }px; } }`;
  }

  resetAnimationStyles() {
    this.styleSheetNode.innerHTML = `${ this.getAnimationStyle(true) } ${ this.getAnimationStyle(false) }`;
  }

  getWrapperStyles() {
    const expanded = this.state.expanded;
    const position = 'relative';
    const overflow = 'hidden';

    if (!this.state.animation) {
      const horizontal = this.props.horizontal;

      if (!expanded) {
        const width = 0;
        const height = 0;

        return horizontal ? { overflow, width } : { overflow, height };
      }

      const width = 'auto';
      const height = 'auto';

      return horizontal ? { width } : { height };
    }

    const { duration, easing } = this.props;
    const name = this.animationNames[expanded ? 'expand' : 'collapse'];

    const animation = `${ name } ${ duration }ms ${ easing } forwards`;

    return { position, overflow, animation };
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
    const { classes } = this.props.sheet;

    return (
      <div className = { classes.root }>
        <div
          className = { classes.wrapper }
          style = { this.getWrapperStyles() }
        >
          <div
            ref = "content"
            className = { classes.content }
            style = { this.getContentStyles() }
          >
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }
}

export default useSheet(AnimakitExpander, styles);
export { AnimakitExpander as PureAnimakitExpander };

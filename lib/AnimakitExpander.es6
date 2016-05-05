import React                        from 'react';
import { findDOMNode }              from 'react-dom';
import { isEqual, genUniqueString } from 'animakit-core';

export default class AnimakitExpander extends React.Component {
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

  componentDidMount() {
    this.contentNode = findDOMNode(this.refs.content);
    this.repaint(this.props, true);
  }

  componentWillReceiveProps(nextProps) {
    this.repaint(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !isEqual(nextState, this.state);

    const propsChanged = !isEqual(nextProps.children, this.props.children);

    return stateChanged || propsChanged;
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
    const expand = `expand-${ uniqueString }`;
    const collapse = `collapse-${ uniqueString }`;

    this.animationNames = { expand, collapse };
  }

  getAnimationStyle(type) {
    const name = this.animationNames[type];
    const dimension = this.props.horizontal ? 'width' : 'height';
    const size = this.contentSize;
    const from = type === 'expand' ? 0 : size;
    const to = type === 'expand' ? size : 0;

    return `@keyframes ${ name } { from { ${ dimension }: ${ from }px; } to { ${ dimension }: ${ to }px; } }`;
  }

  resetAnimationStyles() {
    if (!this.styleSheetNode) {
      const sheet = document.createElement('style');
      sheet.setAttribute('type', 'text/css');
      document.head.appendChild(sheet);

      this.styleSheetNode = sheet;
    }

    this.styleSheetNode.innerHTML = `${ this.getAnimationStyle('expand') } ${ this.getAnimationStyle('collapse') }`;
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
    return (
      <div>
        <div style = { this.getWrapperStyles() }>
          <div
            ref = "content"
            style = { this.getContentStyles() }
          >
            <span style = {{ display: 'table', height: 0 }}></span>
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }
}

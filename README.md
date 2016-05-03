# AnimakitExpander
React component for expanding and collapsing of content blocks.
Supports both vertical and horizontal mode.

```javascript
class Song extends React.Component {
  state = {
    expanded: false
  };

  listeners = {
    onClick: this.onClick.bind(this)
  };

  onClick() {
    const expanded = !this.state.expanded;
    this.setState({ expanded });
  }

  render() {
    return (
      <div className = { styles.song }>
        <div
          className = { this.state.expanded ? styles.titleExpanded : styles.title }
          onClick = { this.listeners.onClick }
        >
          { this.props.title }
        </div>

        <AnimakitExpander expanded = { this.state.expanded }>
          <div className = { styles.text }>
            { this.props.text }
          </div>
        </AnimakitExpander>
      </div>
    );
  }
}
```

## [Demo](http://askd.github.io/animakit/#/expander)

## Installation

```
npm install animakit-expander
```

## Usage

```javascript
<AnimakitExpander expanded={false}>
  <div>Content</div>
</AnimakitExpander>
```

## Properties

| Propery | Required | Type | Default Value  | Available Values  | Description |
| ----- | ----- | ----- | ----- | ----- | ----- |
| expanded | true | bool | `false` | `true`, `false` | State of the component: expanded or collapsed |
| horizontal | false | bool | `false` | `true`, `false` | If true, component will expand in horizontal direction |
| align | false | string |  | `top`, `bottom` for the default direction or `left`, `right` for the horizontal direction | Align of the content during the animation |
| duration | false | number | `1000` | Any integer number | Duration of rotation |
| easing | false | string | `ease-out` | Any [easing function](http://easings.net/) | Easing function of rotation |


## Origin

Part of Animakit.
See http://askd.github.io/animakit for more details.

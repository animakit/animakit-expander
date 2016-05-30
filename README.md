# AnimakitExpander
React component for the expanding and collapsing of the blocks.
Supports both vertical and horizontal mode.

## Usage

```javascript
<div className="title" onClick={ toggle }>
  { this.props.title }
</div>
<AnimakitExpander expanded={ this.state.expanded }>
  <div className="text">
    { this.props.text }
  </div>
</AnimakitExpander>
```

## [Demo](http://askd.github.io/animakit/#/expander)

## Installation

```
npm install animakit-expander
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

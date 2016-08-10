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

## [Demo](https://animakit.github.io/#/expander)

## Installation

```
npm install animakit-expander
```

## Properties

| Property | Required | Type | Default Value  | Available Values  | Description |
| ----- | ----- | ----- | ----- | ----- | ----- |
| expanded | true | bool | `false` | `true`, `false` | State of the component: expanded or collapsed |
| horizontal | false | bool | `false` | `true`, `false` | If true, component will expand in horizontal direction |
| align | false | string |  | `top`, `bottom` for the default direction or `left`, `right` for the horizontal direction | Align of the content during the animation |
| duration | false | number | `500` | Any integer number | Duration of animation |
| durationPerPx | false | number | `0` | Any integer number | Duration of animation per pixel. Use it if you want the duration depended on the size and calculated dynamically. |
| easing | false | string | `ease-out` | Any [easing function](http://easings.net/) | Easing function of animation |


## Origin

Part of Animakit.
See https://animakit.github.io for more details.

<a href="https://evilmartians.com/?utm_source=animakit">
  <img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg"
       alt="Sponsored by Evil Martians" width="236" height="54">
</a>

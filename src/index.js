import { AnimakitExpander } from './AnimakitExpander';

import React      from 'react';
import { render } from 'react-dom';

if (typeof document !== 'undefined') {
  render(<AnimakitExpander/>, document.body);
}

export default AnimakitExpander;

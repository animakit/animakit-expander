/* eslint-env jest */

import { render }      from 'enzyme';

import React            from 'react';
import AnimakitExpander from '../lib/AnimakitExpander.js';

describe('<AnimakitExpander />', () => {
  it('should render', () => {
    const component = render(<AnimakitExpander />);

    expect(component).toMatchSnapshot();
  });
});

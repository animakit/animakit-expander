/* eslint-env jest */

import { shallow }      from 'enzyme';

import React            from 'react';
import AnimakitExpander from '../lib/AnimakitExpander.js';

describe('<AnimakitExpander />', () => {
  it('should render', () => {
    const component = shallow(<AnimakitExpander />);

    expect(component).toMatchSnapshot();
  });
});

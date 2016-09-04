import React              from 'react';
import test               from 'ava';
import { shallow, mount } from 'enzyme';
import AnimakitExpander   from '../lib/AnimakitExpander.js';

test('shallow', t => {
  const wrapper = shallow(<AnimakitExpander />);
  t.is(wrapper.type(), 'div');
});

test('mount', t => {
  const wrapper = mount(<AnimakitExpander />);
  t.is(wrapper.children().length, 1);
});

test('has container', t => {
  const wrapper = shallow(<AnimakitExpander />);
  t.is(wrapper.children().length, 1);
});

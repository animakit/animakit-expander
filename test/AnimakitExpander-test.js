import React                                        from 'react';
import { expect }                                   from 'chai';
import { shallow, render }                          from 'enzyme';
import { PureAnimakitExpander as AnimakitExpander } from '../lib/AnimakitExpander.js';

const classes = {
  root:    'root',
  wrapper: 'wrapper',
  content: 'content'
};

describe('AnimakitExpander', () => {
  it('shallow', () => {
    const wrapper = shallow(<AnimakitExpander sheet={{ classes }} />);
    expect(wrapper.is('div')).to.equal(true);
  });

  it('render', () => {
    const wrapper = render(<AnimakitExpander sheet={{ classes }} />);
    expect(wrapper.find('.wrapper')).to.have.length(1);
  });

  it('children', () => {
    const wrapper = render(<AnimakitExpander sheet={{ classes }}><div>1</div></AnimakitExpander>);
    expect(wrapper.find('.content')).to.have.length(1);
  });
});

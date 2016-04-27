import React               from 'react';
import { expect }          from 'chai';
import { shallow, render } from 'enzyme';
import { AnimakitExpander } from '../src/AnimakitExpander';
import styles              from '../src/AnimakitExpander.css';

describe('AnimakitExpander', () => {
  it('shallow', () => {
    const wrapper = shallow(<AnimakitExpander />);
    expect(wrapper.is('div')).to.equal(true);
  });

  it('render', () => {
    const wrapper = render(<AnimakitExpander />);
    expect(wrapper.find(`.${ styles.wrapper }`)).to.have.length(1);
  });

  it('children', () => {
    const wrapper = render(<AnimakitExpander><div>1</div></AnimakitExpander>);
    expect(wrapper.find(`.${ styles.content }`)).to.have.length(1);
  });
});

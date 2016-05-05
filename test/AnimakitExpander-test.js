import React            from 'react';
import { expect }       from 'chai';
import { shallow }      from 'enzyme';
import AnimakitExpander from '../lib/AnimakitExpander.js';

describe('AnimakitExpander', () => {
  it('shallow', () => {
    const root = shallow(<AnimakitExpander />);
    expect(root.is('div')).to.equal(true);
  });

  it('has wrapper', () => {
    const root = shallow(<AnimakitExpander />);
    expect(root.children()).to.have.length(1);
  });

  it('has children', () => {
    const root = shallow(<AnimakitExpander><div>1</div></AnimakitExpander>);
    const wrapper = root.childAt(0);
    expect(wrapper.children()).to.have.length(1);
  });
});

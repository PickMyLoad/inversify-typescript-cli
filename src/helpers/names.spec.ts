import { names } from './names';
import { expect } from 'chai';

describe('names', () => {

  it('should return correct casing', () => {

    expect(names.getModuleVarName('Hi')).to.eql('hi');
    expect(names.getModuleDirName('Hi')).to.eql('hi');
    expect(names.getModuleFileName('Hi')).to.eql('hi');
    expect(names.getComponentFileName('hi')).to.eql('Hi');
    expect(names.getComponentClassName('hi')).to.eql('Hi');
    expect(names.getComponentInterfaceName('hi')).to.eql('IHi');
    expect(names.getRefName('hi')).to.eql('Hi');

  });

});
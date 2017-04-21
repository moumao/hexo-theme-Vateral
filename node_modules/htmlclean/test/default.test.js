'use strict';

const expect = require('chai').expect,
  htmlclean = require('../lib/htmlclean');

describe('Control flow', () => {

  it('should return empty string when source is not string', () => {
    expect(htmlclean()).to.equal('');
    expect(htmlclean(1)).to.equal('');
    expect(htmlclean(true)).to.equal('');
  });

  it('should throw an error when source contains \\f or \\x07', () => {
    expect(() => { htmlclean('A \f B'); }).to.throw('\\f or \\x07 that is used as marker is included.');
    expect(() => { htmlclean('A \x07 B'); }).to.throw('\\f or \\x07 that is used as marker is included.');
  });

  it('should change the string with options.edit', () => {
    expect(htmlclean('A  B  C  X  Y  Z',
        {edit: src => src.replace(/B C X/, '@')}))
      .to.equal('A @ Y Z');
    expect(htmlclean('A  B  C  X  Y  Z', {edit: () => 1})).to.equal(''); // empty string
    expect(htmlclean('A  B  C  X  Y  Z', {edit: () => false})).to.equal(''); // empty string
  });

});

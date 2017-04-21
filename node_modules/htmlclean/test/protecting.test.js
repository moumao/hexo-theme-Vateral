'use strict';

const expect = require('chai').expect,
  htmlclean = require('../lib/htmlclean');

describe('Protecting', () => {

  it('[htmlclean-protect]', () => {
    expect(htmlclean('A  B  <!--[htmlclean-protect]-->  C\n\nD  <!--[/htmlclean-protect]-->  E  F'))
      .to.equal('A B   C\n\nD   E F');
  });

  describe('Texts in SSI tags', () => {
    [
      ['<%', '%>'], ['<?', '?>'], ['<?php', '?>'],
      ['< %', '% >'], ['< ?', '? >'], ['< ?php', '? >'],
      ['<  %', '%  >'], ['<  ?', '?  >'], ['<  ?  php', '?  >'],
      ['<jsp:', '>'], ['<!--#', '-->'],
      ['< jsp:', '>'], ['< !--#', '-- >'],
      ['<  jsp  :', '>'], ['<  !  --  #', '--  >']
    ].forEach(tag => {
      it(`${tag[0]} ... ${tag[1]}`, () => {
        expect(htmlclean(`A  B  ${tag[0]}  C\n\nD  ${tag[1]}  E  F`))
          .to.equal(`A B ${tag[0]}  C\n\nD  ${tag[1]} E F`);
      });
    });

    it('<?php ... ', () => {
      expect(htmlclean('A  B  <?php  C\n\nD    E  F')).to.equal('A B <?php  C\n\nD    E  F');
    });
    it('< ?php ... ', () => {
      expect(htmlclean('A  B  < ?php  C\n\nD    E  F')).to.equal('A B < ?php  C\n\nD    E  F');
    });
    it('<  ?  php ... ', () => {
      expect(htmlclean('A  B  <  ?  php  C\n\nD    E  F')).to.equal('A B <  ?  php  C\n\nD    E  F');
    });

    it('should unprotect xml', () => {
      expect(htmlclean('A  B  <?xml  C\n\nD  ?>  E  F')).to.equal('A B<?xml C D ?> E F');
      expect(htmlclean('A  B  < ?xml  C\n\nD  ? >  E  F')).to.equal('A B<?xml C D ?> E F');
      expect(htmlclean('A  B  <  ?  xml  C\n\nD  ?  >  E  F')).to.equal('A B<? xml C D ?> E F');
    });
  });

  describe('IE conditional comments', () => {
    [
      ['<![if', ']>'], ['<!--[if', ']>'], ['<!--[if', ']>-->'], ['<!--[if', ']><!-->'],
      ['< !  [if', ']>'], ['< !  --[if', ']>'], ['< !  --[if', ']>-->'], ['< !  --[if', ']><!-->'],
      ['<  !  [ if', ']>'], ['<  !  --[ if', ']>'], ['<  !  --[ if', ']>-->'], ['<  !  --[ if', ']><  !  -->']
    ].forEach(tag => {
      it(`${tag[0]} ... ${tag[1]}`, () => {
        expect(htmlclean(`A  B  ${tag[0]}  C\n\nD  ${tag[1]}  E  F`))
          .to.equal(`A B ${tag[0]}  C\n\nD  ${tag[1]} E F`);
      });
    });

    [
      '<![endif]>', '<![endif]-->', '<!--<![endif]-->',
      '< !  [endif]>', '< !  [endif]-->', '< !  --< !  [endif]-->',
      '<![  endif]>', '<![  endif]-->', '<!--<![  endif]-->',
    ].forEach(tag => {
      it(tag, () => {
        expect(htmlclean(`A  B  ${tag}`)).to.equal(`A B ${tag}`);
      });
    });
  });

  describe('CDATA/preformatted text', () => {
    ['script', 'style', 'pre'].forEach(tag => {
      it(`<${tag}>`, () => {
        expect(htmlclean(`A  B  <${tag}>  C\n\nD  </${tag}>  E  F`))
          .to.equal(`A B<${tag}>  C\n\nD  </${tag}> E F`);
        expect(htmlclean(`A  B  < ${tag} ATTR=V>  C\n\nD  <  / ${tag}  >  E  F`))
          .to.equal(`A B<${tag} ATTR=V>  C\n\nD  </${tag}> E F`);
      });
    });
    // phrasing-element
    it('<textarea>', () => {
      expect(htmlclean('A  B  <textarea>  C\n\nD  </textarea>  E  F'))
        .to.equal('A B <textarea>  C\n\nD  </textarea> E F');
      expect(htmlclean('A  B  < textarea ATTR=V>  C\n\nD  <  / textarea  >  E  F'))
        .to.equal('A B <textarea ATTR=V>  C\n\nD  </textarea> E F');
    });

    // Allow nesting tags
    it('should protect nesting tags in <pre>', () => {
      expect(htmlclean('A  B  <  pre   ATTR  =  V>  C\n\nD  <  TAG   ATTR  =  V>  <  /  TAG><  /  pre>  E  F'))
        .to.equal('A B<pre ATTR=V>  C\n\nD  <TAG ATTR=V>  </TAG></pre> E F');
    });
    // Disallow nesting tags
    it('should ignore nesting tags in <textarea>', () => {
      expect(htmlclean('A  B  <  textarea   ATTR  =  V>  C\n\nD  <  TAG   ATTR  =  V>  <  /  TAG><  /  textarea>  E  F'))
        .to.equal('A B <textarea ATTR=V>  C\n\nD  <  TAG   ATTR  =  V>  <  /  TAG></textarea> E F');
    });

    it('accept empty string', () => {
      expect(htmlclean('A  B  <textarea></textarea>  E  F')).to.equal('A B<textarea></textarea> E F');
    });
  });

  it('options.protect', () => {
    expect(htmlclean('A  B  @  C\n\nD  %  E  F  @  X\n\nY    %')).to.equal('A B @ C D % E F @ X Y %');
    expect(htmlclean('A  B  @  C\n\nD  %  E  F  @  X\n\nY    %', {protect: /@[^]*?%/}))
      .to.equal('A B @  C\n\nD  % E F @ X Y %'); // only 1st
    expect(htmlclean('A  B  @  C\n\nD  %  E  F  @  X\n\nY    %', {protect: [/@[^]*?%/g]})) // array
      .to.equal('A B @  C\n\nD  % E F @  X\n\nY    %');
    expect(htmlclean('A  B  @1  C\n\nD  %1  E  F  @2  X\n\nY    %2  G  H @3  C\n\nD  %3  Z',
        {protect: /@[13][^]*?%[13]/g}))
      .to.equal('A B @1  C\n\nD  %1 E F @2 X Y %2 G H @3  C\n\nD  %3 Z');
    expect(htmlclean('A  B  @  C\n\nD  %  E  F  @  X\n\nY    %', {protect: '@[^]*?%'})) // Ignore incorrect
      .to.equal('A B @ C D % E F @ X Y %');
  });

  it('options.unprotect', () => {
    expect(htmlclean('A  B  <textarea>  C\n\nD  </textarea>  E  F'))
      .to.equal('A B <textarea>  C\n\nD  </textarea> E F');
    expect(htmlclean('A  B  <textarea>  C\n\nD  </textarea>  E  F',
        {unprotect: /<textarea>[^]*?<\/textarea>/g}))
      .to.equal('A B <textarea>C D</textarea> E F');
    expect(htmlclean('A', {unprotect: [/\d*$/g]})).to.equal('A'); // Accept empty string, and array
    expect(htmlclean('A  B  <textarea>  C\n\nD  </textarea>  E  F',
        {unprotect: '<textarea>[^]*?<\/textarea>'})) // Ignore incorrect
      .to.equal('A B <textarea>  C\n\nD  </textarea> E F');
  });

  it('should protect inner when options.protect includes options.unprotect', () => {
    expect(htmlclean('A  B  <textarea>  C\n\nD  </textarea>  E  F', {
      unprotect: /C[^]*?D/g
    })).to.equal('A B <textarea>  C\n\nD  </textarea> E F');
  });

  it('should not protect inner when options.unprotect includes options.protect', () => {
    expect(htmlclean('A  B  <textarea>  C\n\nD  </textarea>  E  F', {
      unprotect: /B[^]*?E/g
    })).to.equal('A B <textarea>C D</textarea> E F');
  });

});

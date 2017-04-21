'use strict';

const expect = require('chai').expect,
  htmlclean = require('../lib/htmlclean');

describe('Removing', () => {
  const SPS = ['\n', '\r', '\t', ' '];

  it('More than two whitespaces', () => {
    SPS.forEach(str => {
      expect(htmlclean(`A${str}${str}B${str}C${str}${str}${str}D${str}E`)).to.equal('A B C D E');
    });
    expect(htmlclean(
      `A${SPS[0]}${SPS[1]}B${SPS[2]}C${SPS[3]}${SPS[0]}${SPS[1]}D${SPS[2]}E`)).to.equal('A B C D E');
  });

  it('Leading and trailing whitespaces', () => {
    SPS.forEach(str => {
      expect(htmlclean(`${str}ABC${str}`)).to.equal('ABC');
      expect(htmlclean(`${str}${str}ABC${str}${str}`)).to.equal('ABC');
    });
    expect(htmlclean(
      `${SPS[0]}${SPS[1]}${SPS[2]}ABC${SPS[3]}${SPS[0]}${SPS[1]}${SPS[2]}`)).to.equal('ABC');
  });

  it('HTML comments', () => {
    expect(htmlclean('ABC <!----> DEF')).to.equal('ABC DEF');
    expect(htmlclean('ABC < !----> DEF')).to.equal('ABC DEF');
    expect(htmlclean('ABC <  !----> DEF')).to.equal('ABC DEF');
    expect(htmlclean('ABC < !  --  -- > DEF')).to.equal('ABC DEF');
  });

  describe('Whitespaces in tags', () => {

    it('Leading and trailing', () => {
      expect(htmlclean('< \n\rTAG >')).to.equal('<TAG>');
    });

    // in </ p> and <br />
    [['', ' '], [' ', ''], [' ', ' '], ['', '   '], ['   ', ''], ['   ', '   ']].forEach(sp => {
      it(`In <${sp[0]}/${sp[1]}p> and <br${sp[0]}/${sp[1]}>`, () => {
        expect(htmlclean(`<${sp[0]}/${sp[1]}p>`)).to.equal('</p>');
        expect(htmlclean(`<br${sp[0]}/${sp[1]}>`)).to.equal('<br/>');
      });
    });

    // side of =
    [['', ' '], [' ', ''], [' ', ' '], ['', '   '], ['   ', ''], ['   ', '   ']].forEach(sp => {
      it(`In <TAG   \\n\\nATTR${sp[0]}=${sp[1]}V>`, () => {
        expect(htmlclean(`<TAG   \n\nATTR${sp[0]}=${sp[1]}V>`)).to.equal('<TAG ATTR=V>');
      });
    });

  });

  describe('Whitespaces between HTML tags', () => {

    it('<br>, <wbr>', () => {
      ['<br>', '<wbr>', '<br/>', '<wbr/>'].forEach(tag => {
        expect(htmlclean(` A ${tag} B `)).to.equal(`A${tag} B`);
        expect(htmlclean(`<span> A </span>${tag} B C`)).to.equal(` <span>A</span>${tag} B C`);
        expect(htmlclean(`<span> A </span> ${tag} B C`)).to.equal(` <span>A</span>${tag} B C`);
        expect(htmlclean(`<span>${tag} A </span> B C`)).to.equal(`<span>${tag} A</span> B C`);
        expect(htmlclean(`<span> A ${tag} B </span> C`)).to.equal(` <span>A${tag} B</span> C`);
      });
    });

    it('Phrasing-Element # Element that keeps inner contents', () => {
      expect(htmlclean('<span> A </span> <button> B </button> C'))
        .to.equal(' <span>A</span> <button> B</button> C');
      expect(htmlclean('<span> A </span> <button> <span> B </span> </button> C'))
        .to.equal(' <span>A</span> <button> <span>B</span></button> C');

      expect(htmlclean('<span> A</span> <button> <span> B </span> </button> C'))
        .to.equal(' <span>A</span> <button> <span>B</span></button> C');
      expect(htmlclean('<span> A <button> <span> B </span> </button> </span> C'))
        .to.equal(' <span>A <button> <span>B</span></button></span> C');

      expect(htmlclean('<span> A </span> <button> B <b> C </button> D'))
        .to.equal(' <span>A</span> <button> B <b>C</button> D');
      expect(htmlclean('<span> A </span> <button> B<b> C </button> D'))
        .to.equal(' <span>A</span> <button> B <b>C</button> D');
    });

    it('Phrasing-Element # Empty-Element', () => {
      expect(htmlclean('<span> A </span> <img> B C')).to.equal(' <span>A</span> <img> B C');
      expect(htmlclean('<span> A</span><img> B C')).to.equal(' <span>A</span><img> B C');
      expect(htmlclean('<span> A<img> B C</span>')).to.equal(' <span>A<img> B C</span>');
    });

    it('Phrasing-Element', () => {
      expect(htmlclean('<span> A <span> B </span> <span> C </span> </span> <span> D </span> E'))
        .to.equal(' <span>A <span>B</span> <span>C</span></span> <span>D</span> E');
      expect(htmlclean('<span><span></span><span> C </span> </span> <span> D </span> E'))
        .to.equal('<span><span></span> <span>C</span></span> <span>D</span> E');
    });

    it('Block-Element', () => {
      expect(htmlclean('<div> A <span> B </span> <div> C </div> </div> <span> D </span> E'))
        .to.equal('<div> A <span>B</span><div> C</div></div> <span>D</span> E');
      expect(htmlclean('<span> A <div> C </div> </span> <span> D </span> E'))
        .to.equal(' <span>A<div> C</div></span> <span>D</span> E');
    });

    it('Text after last tag', () => {
      expect(htmlclean('<span> A </span> B')).to.equal(' <span>A</span> B');
      expect(htmlclean('<span> A ')).to.equal(' <span>A');
    });

  });

  describe('Attributes of HTML tags', () => {

    it('should remove unneeded whitespaces', () => {
      expect(htmlclean('<   span  ATTR = V > A </span> B')).to.equal(' <span ATTR=V>A</span> B');
    });

    it('should protect quoted value', () => {
      expect(htmlclean('<   span  ATTR =  "  A  \n\n B  " > A </span> B'))
        .to.equal(' <span ATTR="  A  \n\n B  ">A</span> B');
      // Invalid tag (can't get tag name)
      expect(htmlclean('<   //span  ATTR =  "  A  \n\n B  " > A </span> B'))
        .to.equal('<//span ATTR="  A  \n\n B  "> A</span> B');
      // No attribute name
      expect(htmlclean('<   span    "  A  \n\n B  " > A </span> B'))
        .to.equal(' <span "  A  \n\n B  ">A</span> B');
    });

    describe('path data', () => {
      it('should accept `path#d` as path data', () => {
        expect(htmlclean('A <path d="  M  0,  0  "/> B')).to.equal('A<path d="M0 0"/> B');
      });
      it('should accept `animateMotion#path` as path data', () => {
        expect(htmlclean('A <animateMotion path="  M  0,  0  "/> B')).to.equal('A<animateMotion path="M0 0"/> B');
      });
      it('should accept `glyph#d` as path data', () => {
        expect(htmlclean('A <glyph d="  M  0,  0  "/> B')).to.equal('A<glyph d="M0 0"/> B');
      });

      it('should accept as implicit lineto command', () => {
        expect(htmlclean('A <path d="M 2,4 L 8, 16"/> B')).to.equal('A<path d="M2 4 8 16"/> B');
      });
      it('should accept as implicit lineto command', () => {
        expect(htmlclean('A <path d="m 2,4 l 8, 16"/> B')).to.equal('A<path d="m2 4 8 16"/> B');
      });

      it('should remove same command name', () => {
        expect(htmlclean('A <path d="V 200 L 2, 4 L 8, 16 V 100 z"/> B'))
          .to.equal('A<path d="V200L2 4 8 16V100z"/> B');
      });

      it('should normalize number', () => {
        expect(htmlclean('A <path d="V +200"/> B')).to.equal('A<path d="V200"/> B');
        expect(htmlclean('A <path d="V 00200"/> B')).to.equal('A<path d="V200"/> B'); // leading zero
        expect(htmlclean('A <path d="V -00200"/> B')).to.equal('A<path d="V-200"/> B'); // leading zero
        expect(htmlclean('A <path d="V200.00"/> B')).to.equal('A<path d="V200"/> B'); // trailing zero
        expect(htmlclean('A <path d="V200."/> B')).to.equal('A<path d="V200"/> B'); //  no fraction
        expect(htmlclean('A <path d="V+0 H0"/> B')).to.equal('A<path d="V0H0"/> B');
        expect(htmlclean('A <path d="V-0."/> B')).to.equal('A<path d="V0"/> B');

        // Number separator
        expect(htmlclean('A <path d="L 05, 0.5"/> B')).to.equal('A<path d="L5 .5"/> B');

        // exponent
        expect(htmlclean('A <path d="V999e1"/> B')).to.equal('A<path d="V999e1"/> B');
        expect(htmlclean('A <path d="V999e+1"/> B')).to.equal('A<path d="V999e1"/> B');
        expect(htmlclean('A <path d="V999e001"/> B')).to.equal('A<path d="V999e1"/> B');
        expect(htmlclean('A <path d="V999e+001"/> B')).to.equal('A<path d="V999e1"/> B');
        expect(htmlclean('A <path d="V999e-001"/> B')).to.equal('A<path d="V999e-1"/> B');
        expect(htmlclean('A <path d="V999e+0"/> B')).to.equal('A<path d="V999"/> B');
        expect(htmlclean('A <path d="V999e-0"/> B')).to.equal('A<path d="V999"/> B');
        expect(htmlclean('A <path d="V999e0"/> B')).to.equal('A<path d="V999"/> B');
      });

      it('should remove invalid command', () => {
        expect(htmlclean('A <path d="0,  0  "/> B')).to.equal('A<path d=""/> B');
      });
    });

  });

});

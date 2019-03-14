'use strict';

const chai = require('chai');
const { formatCharset, generateHeader, foldLine } = require('../lib/shared');

const expect = chai.expect;
chai.config.includeStack = true;

describe('Shared functions', () => {
  describe('formatCharset', () => {
    it('should default to iso-8859-1', () => {
      expect(formatCharset()).to.equal('iso-8859-1');
    });

    it('should normalize UTF8 to utf-8', () => {
      expect(formatCharset('UTF8')).to.equal('utf-8');
    });
  });

  describe('generateHeader', () => {
    it('should return an empty string by default', () => {
      expect(generateHeader()).to.equal('');
    });
  });

  describe('foldLine', () => {
    it('should not fold when not necessary', () => {
      const line = 'abc def ghi';
      const folded = foldLine(line);

      expect(line).to.equal(folded.join(''));
      expect(folded.length).to.equal(1);
    });

    it('should force fold with newline', () => {
      const line = 'abc \\ndef \\nghi';
      const folded = foldLine(line);

      expect(line).to.equal(folded.join(''));
      expect(folded).to.deep.equal(['abc \\n', 'def \\n', 'ghi']);
      expect(folded.length).to.equal(3);
    });

    it('should fold at default length', () => {
      const expected = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum pretium ',
        'a nunc ac fringilla. Nulla laoreet tincidunt tincidunt. Proin tristique ',
        'vestibulum mauris non aliquam. Vivamus volutpat odio nisl, sed placerat ',
        'turpis sodales a. Vestibulum quis lectus ac elit sagittis sodales ac a ',
        'felis. Nulla iaculis, nisl ut mattis fringilla, tortor quam tincidunt ',
        'lorem, quis feugiat purus felis ut velit. Donec euismod eros ut leo ',
        'lobortis tristique.'
      ];
      const folded = foldLine(expected.join(''));
      expect(folded).to.deep.equal(expected);
      expect(folded.length).to.equal(7);
    });

    it('should force fold white space', () => {
      const line = 'abc def ghi';
      const folded = foldLine(line, 5);

      expect(line).to.equal(folded.join(''));
      expect(folded).to.deep.equal(['abc ', 'def ', 'ghi']);
      expect(folded.length).to.equal(3);
    });

    it('should ignore leading spaces', () => {
      const line = '    abc def ghi';
      const folded = foldLine(line, 5);

      expect(line).to.equal(folded.join(''));
      expect(folded).to.deep.equal(['    a', 'bc ', 'def ', 'ghi']);
      expect(folded.length).to.equal(4);
    });

    it('should force fold special character', () => {
      const line = 'abcdef--ghi';
      const folded = foldLine(line, 5);

      expect(line).to.equal(folded.join(''));
      expect(folded).to.deep.equal(['abcde', 'f--', 'ghi']);
      expect(folded.length).to.equal(3);
    });

    it('should force fold last special character', () => {
      const line = 'ab--cdef--ghi';
      const folded = foldLine(line, 10);

      expect(line).to.equal(folded.join(''));
      expect(folded).to.deep.equal(['ab--cdef--', 'ghi']);
      expect(folded.length).to.equal(2);
    });

    it('should force fold only if at least one non-special character', () => {
      const line = '--abcdefghi';
      const folded = foldLine(line, 5);

      expect(line).to.equal(folded.join(''));
      expect(folded).to.deep.equal(['--abc', 'defgh', 'i']);
      expect(folded.length).to.equal(3);
    });
  });
});

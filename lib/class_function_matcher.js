/*
 * MIT License
 *
 * Copyright (c) 2018 M4Numbers <m4numbers@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const config = require('config');
const logger = require('./logger')();
const { regexExtractDescription, regexExtractParameters, regexExtractReturn } = require('./common_extractors');

const regexMatch = (className, inputString) => {
  const regex = new RegExp(`${config.get('docs.general.start')}<${className}>@<([A-Za-z0-9_]*)>\\+\\s+([a-zA-Z \\s.,!@<>':\t+\\-_*]*)\\s+\\+@${config.get('docs.general.end')}`, 'mui');
  let classFuncMatch = regex.exec(inputString);
  if (classFuncMatch !== null) {
    return {
      name: classFuncMatch[1],
      desc: regexExtractDescription(classFuncMatch[2]),
      params: regexExtractParameters(classFuncMatch[2]),
      return: regexExtractReturn(classFuncMatch[2])
    };
  }
  return false;
};

const findAllClassFunctions = (className, extracts=[]) => {
  let foundClassFunctions = {};
  Object.values(extracts).forEach(extract => {
    let match = regexMatch(className, extract);
    if (match !== false) {
      logger.debug(`Found class function of name ${match.name}`);
      if (!foundClassFunctions.hasOwnProperty(match.name)) {
        foundClassFunctions[match.name] = [];
      }
      foundClassFunctions[match.name].push(match);
    }
  });
  return foundClassFunctions;
};

module.exports = findAllClassFunctions;
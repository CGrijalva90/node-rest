/*
* Test runner
*/

// Application logic for the test runner
const _app = {};

// Container for the tests
_app.tests = {};

// Add on the unit tests
_app.tests.unit = require('./unit');

// Count all the tests
_app.countTests = () => {
  let counter = 0;
  Object.keys(_app.tests).forEach(key => {
    const subTests = _app.tests[key];
    Object.keys(subTests).forEach(testName => {
      counter += 1;
    });
  });
  return counter;
};

/* eslint-disable */
// Run all the tests, collectin the errors and successes
_app.runTests = () => {
  const errors = [];
  let successes = 0;
  let counter = 0;
  const limit = _app.countTests();
  Object.keys(_app.tests).forEach(key => {
    const subTests = _app.tests[key];
    Object.keys(subTests).forEach(testName => {
      (function() {
        const temporaryTestName = testName;
        const testValue = subTests[testName];
        // call the test
        try {
          testValue(function() {
            // If it calls back without throwing, then it succeeded, so log it in green
            console.log('\x1b[32m%s\x1b[0m', temporaryTestName);
            counter += 1;
            successes += 1;
            if (counter === limit) {
              _app.produceTestReport(limit, successes, errors);
            }
          });
        } catch (e) {
          // If it throws, then it failed, so capture the error thrown and log it in red
          errors.push({
            name: testName,
            error: e
          });
          console.log('\x1b[31m%s\x1b[0m', temporaryTestName);
          counter += 1;
          if (counter === limit) {
            _app.produceTestReport(limit, successes, errors);
          }
        }
      })();
    });
  });
};
/* eslint-enable */

// Product a test outcome report
_app.produceTestReport = function(limit, successes, errors) {
  console.log('');
  console.log('--------BEGIN TEST REPORT--------');
  console.log('');
  console.log('Total Tests: ', limit);
  console.log('Pass: ', successes);
  console.log('Fail: ', errors.length);
  console.log('');

  // If there are errors, print them in detail
  if (errors.length > 0) {
    console.log('--------BEGIN ERROR DETAILS--------');
    console.log('');
    errors.forEach(testError => {
      console.log('\x1b[31m%s\x1b[0m', testError.name);
      console.log(testError.error);
      console.log('');
    });
    console.log('');
    console.log('--------END ERROR DETAILS--------');
  }
  console.log('');
  console.log('--------END TEST REPORT--------');
};

// Run the tests
_app.runTests();

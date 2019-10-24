import {CalculatorService} from './calculator.service';
import {LoggerService} from './logger.service';
import {TestBed} from '@angular/core/testing';

// If you want to disable this test suite you can add an 'x' before 'describe' like this...
// xdescribe()
// If you want to only focus on this test suite, then you can add an 'f' before 'describe' like this...
// fdescribe()  This bypasses other test suites.
describe('CalculatorService', () => {
  // The variables in beforeEach() are not available in other methods since it is within that block of code.
  // So we have to initialize the variables here at this level.
  let calculator: CalculatorService;
  //  We name logger as loggerSpy to let us know that this is a Jasmine object.  We give it a type 'any'.
  let loggerSpy: any;

  // The beforeEach() will be executed before each it().  This help reduced the amount of redundant code.
  beforeEach(() => {
    console.log('Calling beforeEach');
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);

    // Here we are going to use Angular's TestBed to take advantage of Angular's DI.
    // We don't want to initialize the LoggerService so we use the object {provide:, useValue}
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {
          provide: LoggerService,  // The name of the fake service from Jasmine
          useValue: loggerSpy     // The name we use to reference
        }
      ]
    });
    calculator = TestBed.get(CalculatorService);

    // calculator = new CalculatorService(loggerSpy);   // Since we are using TestBed, we don't need to instantiate like this.

  });

  // If you want to disable this test you can add an 'x' before 'it' like this...
  // xit()
  // If you want to only focus on this test, then you can add an 'f' before 'it' like this...
  // fit()  This bypasses other tests in this suite.
  it('should add two numbers', () => {
    console.log('add test');

    // BEGIN NON-UNIT TESTING OPTION
    // This is one way to test, but is not a unit test because we are testing two different code base: LoggerService()
    // and CalculatorService().
    // const logger = new LoggerService();
    // spyOn(logger, 'log');
    // The CalculatorService needs an argument for the LoggerService();
    // const calculator = new CalculatorService(logger);
    // END NON-UNIT TESTING OPTION

    // BEGIN UNIT TESTING OPTION - PREFERRED WAY
    // Since the CalculatorService needs an argument for the LoggerService();
    // We'll create a false LoggerService().  This allows us to not test the LoggerService(), but only the CalculatorService().
    // We are focusing on unit testing and not integration testing so we'll onl test the CalculatorService().

    // Here we have Jasmine create an object, LoggerService with a method log().
    // const logger = jasmine.createSpyObj('LoggerService', ['log']);
    // logger.log.and.returnValue();  // If the log() method returned a value, we can mock the return here.
    // const calculator = new CalculatorService(logger);
    // END UNIT TESTING OPTION - PREFERRED WAY

    const result = calculator.add(2, 2);

    expect(result).toBe(4);

    // This tests how many times the log() method was called and how many times is expected.
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {
    console.log('subtract test');

    // const calculator = new CalculatorService(new LoggerService());

    const result = calculator.subtract(2, 2);

    expect(result).toBe(0, 'Unexpected subtraction result');

  });

});

import {fakeAsync, flush, flushMicrotasks, tick} from '@angular/core/testing';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';

describe('Async Testing Examples', () => {

  /**
   * Here we use Angular's fakeAsync() to simulate setTimeout(), setInterval(), etc. type of methods.
   * This test uses the tick() method used when running a single setTimeout() method.
   */
  it('Asynchronous test example with tick() - setTimeout()', fakeAsync(() => {
    // data set up
    let test = false;

    setTimeout(() => {
      console.log('running assertions setTimeout()');

      test = true;

      // expect(test).toBeTruthy();  // We don't need our assertion here anymore, just the logic
    }, 1000);

    /*
    If we end the test here, we will get a console log, because it would not know about the assertion in the setTimeout().
    Here, we use Angular's method tick() to 'move' the clock forward.  Specify the same amount of time as you do for the
    setTimeout().

    If the time is different than the setTimeout(), then you will get a console error.  You can have multiple tick() methods,
    but the time specified to all the tick() methods must equal what you specify in the setTimeout();
    EXAMPLE: these add up to 1000
      tick(500);
      tick(499);
      tick(1);
    */
    tick(1000);

    // The control of time using the tick() method allows us to extract the assertion from the setTimeout() and place it here in the body of
    // the test
    expect(test).toBeTruthy();

  }));

  /**
   * Here we use Angular's fakeAsync() to simulate setTimeout(), setInterval(), etc. type of methods.
   * This test uses the flush() method used when running multiple setTimeout() methods.
   */
  it('Asynchronous test example with flush() - setTimeout()', fakeAsync(() => {
    // data set up
    let test = false;

    setTimeout(() => {
    }, 500);

    setTimeout(() => {
      console.log('running assertions setTimeout()');

      test = true;

      // expect(test).toBeTruthy();  // We don't need our assertion here anymore, just the logic
    }, 1000);

    flush();

    // The control of time using the tick() method allows us to extract the assertion from the setTimeout() and place it here in the body of
    // the test
    expect(test).toBeTruthy();
  }));

  /**
   * Testing microtasks - Promise based code
   * Here we test Promises which are microtasks as oppose to macrotasks such as setTimeout().
   */
  it('Asynchronous test example - plain promise', fakeAsync(() => {
    // data set up
    let test = false;

    console.log('Creating promise');

    Promise.resolve().then(() => {
      console.log('Promise first then() evaluated successfully');
      test = true;
      return Promise.resolve();
    })
      .then(() => {
        console.log('Promise second then() evaluated successfully');

      });

    // Since the Promises are microtasks, we can't/shouldn't use the flush() method.  We use Angular's flushMicrotasks() method.
    flushMicrotasks();
    console.log('Running test assertions');

    expect(test).toBeTruthy();
  }));

  /**
   * Testing both macro and micro tasks together - Promise + setTimeout()
   */
  it('Asynchronous test example - Promises + setTimeout()', fakeAsync(() => {
    // data set up
    let counter = 0;

    Promise.resolve().then(() => {
      counter += 10;

      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    expect(counter).toBe(0);

    // Now flush the microtasks
    flushMicrotasks();

    expect(counter).toBe(10);

    // Move the macrotask forward in time
    tick(500);

    // We have not equaled 1000 in time yet, so we should still expect counter = 10.
    expect(counter).toBe(10);

    // Move the macrotask forward in time
    tick(500);

    // We have now come to 1000ms.
    expect(counter).toBe(11);

  }));

  /**
   * Testing Observables - Synchronous
   * Here we do not use the fakeAsync() because we are testing synchronously
   */
  it('Asynchronous test example - Observables - Synchronous', () => {
    // data set up
    let test = false;

    console.log('Creating Observable');

    // This code runs synchronously
    // The $ sign after the var name is a convention used to indicate that it is an Observable.
    const test$ = of(test);

    test$.subscribe(() => {
      test = true;
    });

    console.log('Running test assertions');

    expect(test).toBe(true);
  });

  /**
   * Testing Observables - Asynchronous
   * * Here we use the fakeAsync() because we are testing asynchronously
   */
  it('Asynchronous test example - Observables - Asynchronous', fakeAsync(() => {
    // data set up
    let test = false;

    console.log('Creating Observable');

    // This code runs asynchronously
    // Use the RxJs method delay() to create a setTimeout process
    // The $ sign after the var name is a convention used to indicate that it is an Observable.
    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {
      test = true;
    });

    // Since delay() uses the setTimeout() method, we use the tick() method to move the time
    tick(1000);

    console.log('Running test assertions');

    expect(test).toBe(true);
  }));

});


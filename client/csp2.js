import { go, chan, take, put } from 'js-csp';

let chDuck = chan();

go(function*(){
  const receivedFirst = yield take(chDuck);
  console.log('+ Duck >', receivedFirst);

  const sending = 'duck';
  console.log('+ Duck <', sending);

  const receivedSecond = yield take(chDuck);
  console.log('+ Duck >', receivedSecond);

});
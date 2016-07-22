import { Template } from 'meteor/templating';
import { go, timeout, chan, take, put, putAsync } from 'js-csp';

import './main.html';

Template.sheet.helpers({
  color(){
    go(function*(){
     yield take(chDuck);
     return "hello";
    });
  }
});


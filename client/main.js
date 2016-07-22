import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { go, timeout, chan, take, put, putAsync } from 'js-csp';
import './main.html';

Template.hello.onCreated(function helloOnCreated() {
    // counter starts at 0
    this.counter = new ReactiveVar(0);
});

chDuck = chan();

go(function*() {
    yield take(chDuck);
    console.log(chDuck.data);
});
Template.hello.helpers({
    counter() {
        return Template.instance().counter.get();
    },
    visible() {
        if (Template.instance().counter.get()) {
            return "visible";
        }
    },
    textfromch1() {
        go(function*() {
            yield take(chDuck);
            return chDuck.data;
        });
    }
});

Template.hello.events({
    'click button' (event, instance) {
        // increment the counter when button is clicked
        instance.counter.set("1");
        console.log(instance.counter.get());

        go(function*() {
            put(chDuck, "+ > clicking button");
        });
    },
});

let chantimed = chan();
putAsync(chantimed, 'true');

Template.sheet.helpers({
    loaded() {
        go(function*() {
            yield take(chantimed);
            console.log('+ headerslpash')
        });
        return 'loaded';
    }

});




go(function*() {
    console.log('+ action');
});

go(function*() {
    yield timeout(1000);
    console.log('+ timers');
});

go(function*() {
    yield timeout(2000);
    console.log('+ delight');
});

let ch = chan();

go(function*() {
    const received = yield take(ch);
    console.log('+ received', received);
});



const text = '< message >';
console.log('+ sending', text);

putAsync(ch, text);


let chA = chan();
let chB = chan();

// Process A
go(function*() {
    const receivedFirst = take(chA);
    console.log('A > RECEIVED:', receivedFirst);

    const sending = 'cat';
    console.log('A > SENDING:', sending);
    yield put(chB, sending);

    const receivedSecond = yield take(chA);
    console.log('A > RECEIVED:', receivedSecond);
});

// Process B
go(function*() {
    const sendingFirst = 'dog';
    console.log('B > SENDING:', sendingFirst);
    put(chA, sendingFirst);

    const received = yield take(chB);
    console.log('B > RECEIVED:', received);

    const sendingSecond = 'another dog';
    console.log('B > SENDING:', sendingSecond);
    yield put(chA, sendingSecond + take(chA));
});




// terminal output:
//
// => B > SENDING: dog
// => A > RECEIVED: dog
// => A > SENDING: cat
// => B > RECEIVED: cat
// => B > SENDING: another dog
// => A > RECEIVED: another dog

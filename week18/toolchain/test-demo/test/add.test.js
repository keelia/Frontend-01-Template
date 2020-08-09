//Mocha
//let mod = require('../src/add')
// let assert = require('assert')
import {add } from '../src/add.js';
let assert = require('assert')
//import assert from 'assert'
describe('add', function () {
    it('add(3,5) should be 8', function () {
        assert.equal(add(3,5), 8);
    })
});

//AVA: simillar as mocha
// let mod = require('../src/add')
// let test = require('ava');

// test('foo', t => {
//     if(mod.add(3,4) === 7){
// 	    t.pass();
//     }
// });

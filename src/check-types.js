/**
 * This module exports functions for checking types
 * and throwing exceptions.
 */

/*globals define, module */

(function (globals) {
    'use strict';

    var messages, predicates, functions, verify, maybe;

    predicates = {
        like: like,
        instance: instance,
        emptyObject: emptyObject,
        object: object,
        length: length,
        array: array,
        date: date,
        fn: fn,
        webUrl: webUrl,
        unemptyString: unemptyString,
        string: string,
        evenNumber: evenNumber,
        oddNumber: oddNumber,
        positiveNumber: positiveNumber,
        negativeNumber: negativeNumber,
        number: number
    };

    messages = {
        like: 'Invalid type',
        instance: 'Invalid type',
        emptyObject: 'Invalid object',
        object: 'Invalid object',
        length: 'Invalid length',
        array: 'Invalid array',
        date: 'Invalid date',
        fn: 'Invalid function',
        webUrl: 'Invalid URL',
        unemptyString: 'Invalid string',
        string: 'Invalid string',
        evenNumber: 'Invalid number',
        oddNumber: 'Invalid number',
        positiveNumber: 'Invalid number',
        negativeNumber: 'Invalid number',
        number: 'Invalid number'
    };

    functions = {
        map: map,
        every: every,
        any: any
    };

    functions = mixin(functions, predicates);
    verify = createModifiedPredicates(verifyModifier);
    maybe = createModifiedPredicates(maybeModifier);

    exportFunctions(mixin(functions, {
        verify: verify,
        maybe: maybe
    }));

    /**
     * Public function `like`.
     *
     * Tests whether an object 'quacks like a duck'.
     * Returns `true` if the first argument has all of
     * the properties of the second, archetypal argument
     * (the 'duck'). Returns `false` otherwise. If either
     * argument is not an object, an exception is thrown.
     *
     * @param thing {object} The object to test.
     * @param duck {object}  The archetypal object, or
     *                       'duck', that the test is
     *                       against.
     */
    function like (thing, duck) {
        var name;

        verify.object(thing);
        verify.object(duck);

        for (name in duck) {
            if (duck.hasOwnProperty(name)) {
                if (thing.hasOwnProperty(name) === false || typeof thing[name] !== typeof duck[name]) {
                    return false;
                }

                if (object(thing[name]) && like(thing[name], duck[name]) === false) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Public function `instance`.
     *
     * Returns `true` if an object is an instance of a prototype,
     * `false` otherwise.
     *
     * @param thing {object}       The object to test.
     * @param prototype {function} The prototype that the
     *                             test is against.
     */
    function instance (thing, prototype) {
        if (typeof thing === 'undefined' || thing === null) {
            return false;
        }

        if (fn(prototype) && thing instanceof prototype) {
            return true;
        }

        return false;
    }

    /**
     * Public function `emptyObject`.
     *
     * Returns `true` if something is an empty, non-null,
     * non-array object, `false` otherwise.
     *
     * @param thing          The thing to test.
     */
    function emptyObject (thing) {
        var property;

        if (object(thing)) {
            for (property in thing) {
                if (thing.hasOwnProperty(property)) {
                    return false;
                }
            }

            return true;
        }

        return false;
    }

    /**
     * Public function `object`.
     *
     * Returns `true` if something is a non-null, non-array,
     * non-date object, `false` otherwise.
     *
     * @param thing          The thing to test.
     */
    function object (thing) {
        return typeof thing === 'object' && thing !== null && array(thing) === false && date(thing) === false;
    }

    /**
     * Public function `length`.
     *
     * Returns `true` if something is has a length property
     * matching the specified value, `false` otherwise.
     *
     * @param thing The thing to test.
     * @param value The required length to test against.
     */
    function length (thing, value) {
        return thing && thing.length === value;
    }

    /**
     * Public function `array`.
     *
     * Returns `true` something is an array, `false` otherwise.
     *
     * @param thing          The thing to test.
     */
    function array (thing) {
        if (Array.isArray) {
            return Array.isArray(thing);
        }

        return Object.prototype.toString.call(thing) === '[object Array]';
    }

    /**
     * Public function `date`.
     *
     * Returns `true` something is a date, `false` otherwise.
     *
     * @param thing          The thing to test.
     */
    function date (thing) {
        return Object.prototype.toString.call(thing) === '[object Date]';
    }

    /**
     * Public function `fn`.
     *
     * Returns `true` if something is function, `false` otherwise.
     *
     * @param thing          The thing to test.
     */
    function fn (thing) {
        return typeof thing === 'function';
    }

    /**
     * Public function `webUrl`.
     *
     * Returns `true` if something is an HTTP or HTTPS URL,
     * `false` otherwise.
     *
     * @param thing          The thing to test.
     */
    function webUrl (thing) {
        return unemptyString(thing) && /^https?:\/\/.+/.test(thing);
    }

    /**
     * Public function `unemptyString`.
     *
     * Returns `true` if something is a non-empty string, `false`
     * otherwise.
     *
     * @param thing          The thing to test.
     */
    function unemptyString (thing) {
        return string(thing) && thing !== '';
    }

    /**
     * Public function `string`.
     *
     * Returns `true` if something is a string, `false` otherwise.
     *
     * @param thing          The thing to test.
     */
    function string (thing) {
        return typeof thing === 'string';
    }

    /**
     * Public function `oddNumber`.
     *
     * Returns `true` if something is an odd number,
     * `false` otherwise.
     *
     * @param thing          The thing to test.
     */
    function oddNumber (thing) {
        return number(thing) && (thing % 2 === 1 || thing % 2 === -1);
    }

    /**
     * Public function `evenNumber`.
     *
     * Returns `true` if something is an even number,
     * `false` otherwise.
     *
     * @param thing          The thing to test.
     */
    function evenNumber (thing) {
        return number(thing) && thing % 2 === 0;
    }

    /**
     * Public function `positiveNumber`.
     *
     * Returns `true` if something is a positive number,
     * `false` otherwise.
     *
     * @param thing          The thing to test.
     */
    function positiveNumber (thing) {
        return number(thing) && thing > 0;
    }

    /**
     * Public function `negativeNumber`.
     *
     * Returns `true` if something is a positive number,
     * `false` otherwise.
     *
     * @param thing          The thing to test.
     */
    function negativeNumber (thing) {
        return number(thing) && thing < 0;
    }

    /**
     * Public function `number`.
     *
     * Returns `true` if something is a number other than NaN,
     * `false` otherwise.
     *
     * @param thing The thing to test.
     */
    function number (thing) {
        return typeof thing === 'number' && isNaN(thing) === false;
    }

    /**
     * Public function `map`.
     *
     * Returns the results hash of mapping each predicate to the
     * corresponding thing's property. Similar to `like` but
     * with functions instead of values.
     *
     * @param things {object}     The things to test.
     * @param predicates {object} The map of functions to call against
     *                            the corresponding properties from `things`.
     */
    function map (things, predicates) {
        var property, result = {}, predicate;

        verify.object(things);
        verify.object(predicates);

        for (property in predicates) {
            if (predicates.hasOwnProperty(property)) {
                predicate = predicates[property];

                if (fn(predicate)) {
                    result[property] = things.hasOwnProperty(property) ?  predicate(things[property]) : undefined;
                } else if (object(predicate)) {
                    result[property] = things.hasOwnProperty(property) ?  map(things[property], predicate) : undefined;
                }
            }
        }

        return result;
    }

    /**
     * Public function `every`
     *
     * Returns the conjunction of all booleans in a hash.
     *
     * @param predicateResults {object} The hash of evaluated predicates.
     */
    function every (predicateResults) {
        var property, value;

        verify.object(predicateResults);

        for (property in predicateResults) {
            if (predicateResults.hasOwnProperty(property)) {
                value = predicateResults[property];

                if (object(value) && every(value) === false) {
                    return false;
                }

                if (value === false) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Public function `any`
     *
     * Returns the disjunction of all booleans in a hash.
     *
     * @param predicateResults {object} The hash of evaluated predicates.
     */
    function any (predicateResults) {
        var property, value;

        verify.object(predicateResults);

        for (property in predicateResults) {
            if (predicateResults.hasOwnProperty(property)) {
                value = predicateResults[property];

                if (object(value) && any(value)) {
                    return true;
                }

                if (value === true) {
                    return true;
                }
            }
        }

        return false;
    }

    function mixin (target, source) {
        var property;

        for (property in source) {
            if (source.hasOwnProperty(property)) {
                target[property] = source[property];
            }
        }

        return target;
    }

    /**
     * Public modifier `verify`.
     *
     * Throws if `predicate` returns `false`.
     */
    function verifyModifier (predicate, defaultMessage) {
        return function() {
            var message = arguments[arguments.length - 1];
            if (predicate.apply(null, arguments) === false) {
                throw new Error(unemptyString(message) ? message : defaultMessage);
            }
        };
    }

    /**
     * Public modifier `maybe`.
     *
     * Returns `true` if preficate is `null` or `undefined`, otherwise
     * propagates the return value from the predicate.
     */
    function maybeModifier (predicate) {
        return function() {
            return arguments[0] === null || arguments[0] === undefined ?  true : predicate.apply(null, arguments);
        };
    }

    function createModifiedPredicates (modifier) {
        var name, result = {};

        for (name in predicates) {
            if (predicates.hasOwnProperty(name)) {
                result[name] = modifier(predicates[name], messages[name]);
            }
        }

        return result;
    }

    function exportFunctions (functions) {
        if (typeof define === 'function' && define.amd) {
            define(function () {
                return functions;
            });
        } else if (typeof module !== 'undefined' && module !== null) {
            module.exports = functions;
        } else {
            globals.check = functions;
        }
    }
}(this));

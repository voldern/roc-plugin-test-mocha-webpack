import { isString, isObject, isBoolean } from 'roc/validators';
import { toBoolean } from 'roc/converters';
import { generateDependencies, lazyFunctionRequire } from 'roc';

import config from '../config/roc.config.js';
import meta from '../config/roc.config.meta.js';

import { packageJSON } from './util';

const lazyRequire = lazyFunctionRequire(require);

export default {
    required: {
        'roc-package-webpack-node': '^1.0.0-beta',
    },
    plugins: [
        require.resolve('roc-abstract-plugin-test'),
    ],
    dependencies: {
        exports: generateDependencies(packageJSON, ['expect']),
    },
    config,
    meta,
    actions: [{
        hook: 'run-test-command',
        description: 'Adds support for running tests with nyc using Webpack.',
        action: lazyRequire('../actions/test'),
    }, {
        extension: 'roc-plugin-test-mocha-webpack',
        hook: 'build-webpack',
        description: 'Adds Webpack configuration specific for tests.',
        action: lazyRequire('../actions/webpack'),
    }],
    hooks: {
        'build-webpack': {
            description: 'Used to create the final Webpack configuration object for tests.',
            initialValue: {},
            returns: isObject(),
            arguments: [{
                name: 'target',
                validator: isString,
                description: 'The target for which the Webpack configuration should be build for.',
            }, {
                name: 'coverage',
                validator: isBoolean,
                description: 'If the code should be prepared for coverage generation.',
            }],
        },
    },
    commands: {
        development: {
            test: {
                override: 'roc-abstract-plugin-test',
                options: [{
                    name: 'grep',
                    shortname: 'g',
                    description: 'Will only run tests that match the given pattern. ' +
                        'Will be compiled to a RegExp by Mocha.',
                    validator: isString,
                }, {
                    name: 'watch',
                    shortname: 'w',
                    description: 'If the tests should run in watch mode.',
                    default: false,
                    validator: isBoolean,
                }, {
                    name: 'coverage',
                    description: 'If coverage reports should be generated for the code.',
                    default: true,
                    validator: isBoolean,
                    converter: toBoolean,
                }],
            },
        },
    },
};

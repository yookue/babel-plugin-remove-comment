/*
 * Copyright (c) 2024 Yookue Ltd. All rights reserved.
 *
 * Licensed under the MIT License.
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
 */


const babelCore = require('@babel/core');
const babelPlugin = require('../dist/cjs');


const sourceCode = `
    /**
     * Block comment
     */
    const blockComment = 1;

    // Line comment
    const lineComment = 2;
`;


describe('BabelPluginRemoveComment', () => {
    test('Testing all comment', () => {
        const ast = babelCore.transform(sourceCode, {
            presets: ['@babel/preset-env'],
            plugins: [
                [babelPlugin, {
                    scope: 'all',
                }]
            ]
        });
        expect(ast.code.indexOf('* Block comment')).toBe(-1);
        expect(ast.code.indexOf('// Line comment')).toBe(-1);
    });

    test('Testing block comment', () => {
        const ast = babelCore.transform(sourceCode, {
            presets: ['@babel/preset-env'],
            plugins: [
                [babelPlugin, {
                    scope: 'block',
                }]
            ]
        });
        expect(ast.code.indexOf('* Block comment')).toBe(-1);
        expect(ast.code.indexOf('// Line comment')).toBeGreaterThan(-1);
    });

    test('Testing line comment', () => {
        const ast = babelCore.transform(sourceCode, {
            presets: ['@babel/preset-env'],
            plugins: [
                [babelPlugin, {
                    scope: 'line',
                }]
            ]
        });
        expect(ast.code.indexOf('* Block comment')).toBeGreaterThan(-1);
        expect(ast.code.indexOf('// Line comment')).toBe(-1);
    });
});

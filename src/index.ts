/*
 * Copyright (c) 2024 Yookue Ltd. All rights reserved.
 *
 * Licensed under the MIT License (the 'License')
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 */


import {types as babelTypes, type PluginObj} from '@babel/core';


/**
 * Removes comment plugin options
 *
 * @ignore
 */
export type RemoveCommentOptions = {
    scope?: 'all' | 'block' | 'line' | 'none';
};


/**
 * Removes comment plugin for babel
 * <p>
 * Removes script comments during babel compilation
 * <p>
 * The entry function, called by babel when loading this plugin
 *
 * @author David Hsing
 *
 * @ignore
 */
// noinspection JSUnusedGlobalSymbols
export default (_babel: unknown, options: RemoveCommentOptions = {scope: 'none'}): PluginObj<RemoveCommentOptions> => {
    return {
        name: '@yookue/babel-plugin-remove-comment',
        visitor: {
            Program(path) {
                if (!options.scope || options.scope === 'none') {
                    return;
                }
                if (!['all', 'block', 'line', 'none'].includes(options.scope)) {
                    throw SyntaxError(`Invalid scope parameter '${options.scope}', it should be one of 'all' | 'block' | 'line' | 'none'`);
                }
                path.traverse({
                    enter(path) {
                        const leading = path.node.leadingComments;
                        const trailing = path.node.trailingComments;
                        if ((!leading || leading.length === 0) && (!trailing || trailing.length === 0)) {
                            return;
                        }
                        if (options.scope === 'all') {
                            babelTypes.removeComments(path.node);
                        } else if (options.scope === 'block') {
                            if (leading && leading.length > 0) {
                                path.node.leadingComments = leading.filter(item => item.type !== 'CommentBlock');
                            }
                            if (trailing && trailing.length > 0) {
                                path.node.trailingComments = trailing.filter(item => item.type !== 'CommentBlock');
                            }
                        } else if (options.scope === 'line') {
                            if (leading && leading.length > 0) {
                                path.node.leadingComments = leading.filter(item => item.type !== 'CommentLine');
                            }
                            if (trailing && trailing.length > 0) {
                                path.node.trailingComments = trailing.filter(item => item.type !== 'CommentLine');
                            }
                        }
                    }
                });
            }
        }
    };
}

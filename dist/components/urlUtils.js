"use strict";
/**
 * Contains utils for working with URL strings.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppType = void 0;
function getAppType(url) {
    const pathname = getPathName(url);
    const pathParts = pathname.split('/');
    return pathParts[1];
}
exports.getAppType = getAppType;
function getPathName(url) {
    const urlRef = new URL(url);
    return urlRef.pathname;
}

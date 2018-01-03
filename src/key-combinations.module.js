/**
 * @author Created by Alice Paquette on 12/31/2017
 * @fileOverview This module is used to track and exploit key combinations for use with keyboard shortcuts.
 */
'use strict';
var KeyCombinationsModule;
(function (KeyCombinationsModule) {
    /**
     * @constant
     * @type {string[]}
     * These are keys that A) are not modifiers, and B) do not output a different character (if they output
     * one at all) when combined with Shift. This means Shift can be included when converting to a keybind,
     * e.g. Shift + Enter, while most characters--such as digits, which become symbols--need to have Shift filtered out.
     *
     * For example, Shift + $ would make no sense as the dollar sign ($) is achieved by pressing Shift in the first place.
     * This also helps with localization and different keyboard layouts since keybinds in this module are based on
     * the output-based KeyboardEvent.key, not KeyboardEvent.code. The latter represents a physical key on the keyboard,
     * and so is unmodified by layout or locale.
     * @summary Represents KeyboardEvent.keys whose output is not modified by Shift.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
     */
    var shiftIndependentKeys = [
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Backspace', 'Delete',
        'Enter', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'Space', 'CapsLock', 'Tab'
    ];
    /**
     * Converts a KeyboardEvent into a key combination string in the format 'Modifier+Key'.
     * Shift is filtered out for any shift-dependent character (e.g. symbols and capital letters).
     *
     * @param {KeyboardEvent} e - The event to convert.
     * @returns {string} - A string in the format 'Modifier+Key'.
     */
    function convertToKeyCombination(e) {
        var payload = '';
        var mods = listActiveModifiers(e);
        if (!isModifier(e)) {
            // Remove shift if the KeyboardEvent.key is shift dependent
            if (e.shiftKey && !shiftIndependentKeys.includes(e.key)) {
                mods.splice(mods.indexOf('Shift'));
            }
            payload = "" + mods.join('+') + (mods.length > 0 ? '+' : '') + e.key;
        }
        return payload;
    }
    KeyCombinationsModule.convertToKeyCombination = convertToKeyCombination;
    /**
     * Returns all active modifiers for a KeyboardEvent as an array of strings. The strings correspond to each
     * modifier's KeyboardEvent.key attribute.
     *
     * @param {KeyboardEvent} e - The event to analyze.
     * @returns {string[]} - An array of active modifiers, e.g. ['Control', 'Shift']
     */
    function listActiveModifiers(e) {
        var payload = [];
        if (e.ctrlKey)
            payload.push('Control');
        if (e.shiftKey)
            payload.push('Shift');
        if (e.altKey)
            payload.push('Alt');
        if (e.metaKey)
            payload.push('Meta');
        return payload;
    }
    KeyCombinationsModule.listActiveModifiers = listActiveModifiers;
    /**
     * Checks whether the source of the provided KeyboardEvent is a modifier.
     *
     * @param {KeyboardEvent} e - The event to analyze.
     * @returns {boolean} - True if the source of the event is a modifier.
     */
    function isModifier(e) {
        return e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt' || e.key === 'Meta';
    }
    KeyCombinationsModule.isModifier = isModifier;
})(KeyCombinationsModule || (KeyCombinationsModule = {}));

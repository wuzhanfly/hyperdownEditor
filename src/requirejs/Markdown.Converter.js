/*"use strict";
var Markdown;

if (typeof exports === "object" && typeof require === "function") // we're in a CommonJS (e.g. Node.js) module
    Markdown = exports;
else
    Markdown = {};
*/
// The following text is included for historical reasons, but should
// be taken with a pinch of salt; it's not all true anymore.

//
// Wherever possible, Showdown is a straight, line-by-line port
// of the Perl version of Markdown.
//
// This is not a normal parser design; it's basically just a
// series of string substitutions.  It's hard to read and
// maintain this way,  but keeping Showdown close to the original
// design makes it easier to port new features.
//
// More importantly, Showdown behaves like markdown.pl in most
// edge cases.  So web applications can do client-side preview
// in Javascript, and then build identical HTML on the server.
//
// This port needs the new RegExp functionality of ECMA 262,
// 3rd Edition (i.e. Javascript 1.5).  Most modern web browsers
// should do fine.  Even with the new regular expression features,
// We do a lot of work to emulate Perl's regex functionality.
// The tricky changes in this file mostly have the "attacklab:"
// label.  Major or self-explanatory changes don't.
//
// Smart diff tools like Araxis Merge will be able to match up
// this file with markdown.pl in a useful way.  A little tweaking
// helps: in a copy of markdown.pl, replace "#" with "//" and
// replace "$text" with "text".  Be sure to ignore whitespace
// and line endings.
//


//
// Usage:
//
//   var text = "Markdown *rocks*.";
//
//   var converter = new Markdown.Converter();
//   var html = converter.makeHtml(text);
//
//   alert(html);
//
// Note: move the sample code to the bottom of this
// file before uncommenting it.
//

define(['hyperdown', 'emojiList'], function (Hyperdown, emojiList) {
    'use strict';
    var Markdown = {};
    function identity(x) { return x; }
    function returnFalse(x) { return false; }

    function HookCollection() { }

    HookCollection.prototype = {

        chain: function (hookname, func) {
            var original = this[hookname];
            if (!original)
                throw new Error("unknown hook " + hookname);

            if (original === identity)
                this[hookname] = func;
            else
                this[hookname] = function (text) {
                    var args = Array.prototype.slice.call(arguments, 0);
                    args[0] = original.apply(null, args);
                    return func.apply(null, args);
                };
        },
        set: function (hookname, func) {
            if (!this[hookname])
                throw new Error("unknown hook " + hookname);
            this[hookname] = func;
        },
        addNoop: function (hookname) {
            this[hookname] = identity;
        },
        addFalse: function (hookname) {
            this[hookname] = returnFalse;
        }
    };

    Markdown.HookCollection = HookCollection;

    // g_urls and g_titles allow arbitrary user-entered strings as keys. This
    // caused an exception (and hence stopped the rendering) when the user entered
    // e.g. [push] or [__proto__]. Adding a prefix to the actual key prevents this
    // (since no builtin property starts with "s_"). See
    // http://meta.stackexchange.com/questions/64655/strange-wmd-bug
    // (granted, switching from Array() to Object() alone would have left only __proto__
    // to be a problem)
    function SaveHash() { }
    SaveHash.prototype = {
        set: function (key, value) {
            this["s_" + key] = value;
        },
        get: function (key) {
            return this["s_" + key];
        }
    };

    Markdown.Converter = new Hyperdown();

    var pluginHooks = Markdown.Converter.hooks = new HookCollection();
    // given a URL that was encountered by itself (without markup), should return the link text that's to be given to this link
    pluginHooks.addNoop("plainLinkText");

    // called with the orignal text as given to makeHtml. The result of this plugin hook is the actual markdown source that will be cooked
    pluginHooks.addNoop("preConversion");

    // called with the text once all normalizations have been completed (tabs to spaces, line endings, etc.), but before any conversions have
    pluginHooks.addNoop("postNormalization");

    // Called with the text before / after creating block elements like code blocks and lists. Note that this is called recursively
    // with inner content, e.g. it's called with the full text, and then only with the content of a blockquote. The inner
    // call will receive outdented text.
    pluginHooks.addNoop("preBlockGamut");
    pluginHooks.addNoop("postBlockGamut");

    // called with the text of a single block element before / after the span-level conversions (bold, code spans, etc.) have been made
    pluginHooks.addNoop("preSpanGamut");
    pluginHooks.addNoop("postSpanGamut");

    // called with the final cooked HTML code. The result of this plugin hook is the actual output of makeHtml
    pluginHooks.addNoop("postConversion");

    // hyperdown 的自定义 hooks
    Markdown.Converter.hook('beforeParseInline', function(line) {  //数学公式
        line = line.replace(/\$\$(.+?)\$\$/g, function(match){
            return Markdown.Converter.makeHolder('$$' + match  + '$$');
        });
        return line
    })

    Markdown.Converter.hook('afterParseInlineBeforeRelease', function(line) {  //emoji
        line = line.replace(/:([_a-z0-9]+):/g, function(match, p1){
            if(emojiList.indexOf(p1) !== -1) {
                var str = '<img src="' + SF.staticUrl + '/global/img/emojis/' + p1 + '.png" class="emoji" alt="' + p1 + '" title="' + p1 + '">';
                return Markdown.Converter.makeHolder(str);
            } else {
                return match
            }
        });
        return line
    })

    return Markdown;

});

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * editor.js
 * 一个复杂的编辑器，支持markdown的语法
 *
 * 用法：
 * var myEditor = new Editor({toolbar: false, status: true});
 * myEditor.render('#myEditor');
 *
 * @author integ@segmentfault.com
 *
 */

/**
 * Interface of Editor.
 */

__webpack_require__(13);

let Markdown = __webpack_require__(1);
__webpack_require__(2)(Markdown);
__webpack_require__(3)(Markdown);
__webpack_require__(4)(Markdown);

var Editor, goEdit, goLive, goPreview, toggleBig;

Editor = function (options) {
    options = $.extend({
        toolbar: Editor.toolbar,
        statusbar: true,
        status: Editor.statusbar
    }, options);
    this.options = options;
    this.converter = null;
    this.isBig = false;
    this.isLive = false;
    this.originHeight = 420;
};

/**
 * Toggle big of the editor.
 */

toggleBig = function (editor) {
    var cancel, goBig;
    goBig = function () {
        $('.editor__menu--zen').addClass('editor__menu--unzen').removeClass('editor__menu--zen');
        $('.editor').addClass('editor_fullscreen');
        $('body').addClass('noscroll');
        $('.editor__resize').hide();
        editor.isBig = true;
    };
    cancel = function () {
        $('.editor__resize').show();
        $('.editor__menu--unzen').addClass('editor__menu--zen').removeClass('editor__menu--unzen');
        $('.editor').removeClass('editor_fullscreen');
        $('body').removeClass('noscroll');
        editor.isBig = false;
    };
    if ($('.editor__menu--zen').length) {
        goBig();
    } else if (cancel) {
        cancel();
    }
};

/**
 * Preview action.
 */

goPreview = function (editor) {
    editor.mode = 'preview';
    $('.editor').removeClass('liveMode editMode').addClass('previewMode');
    $('.editor-mode a').removeClass('muted');
    $('.editor__menu--preview').addClass('muted');
};

/**
 * 编辑模式.
 */

goEdit = function (editor) {
    editor.mode = 'edit';
    $('.editor').removeClass('liveMode previewMode').addClass('editMode');
    $('.editor-mode a').removeClass('muted');
    $('.editor__menu--edit').addClass('muted');
};

/**
 * 实况模式.
 */

goLive = function (editor) {
    editor.mode = 'live';
    $('.editor').removeClass('editMode previewMode').addClass('liveMode');
    $('.editor-mode a').removeClass('muted');
    $('.editor__menu--live').addClass('muted');
};

'use strict';

/**
 * get the value of the Editor
 * myEditor.getVal();
 *
 */

Editor.prototype.getVal = function () {
    return $('.wmd-input').val();
};

/**
 * set the value of the Editor
 * myEditor.setVal(text);
 *
 */

Editor.prototype.setVal = function (text) {
    var ret;
    ret = $('.wmd-input').val(text);
    this.pagedownEditor.refreshPreview();
    return ret;
};

/**
 * bind change event of the Editor
 * myEditor.change(function(cm){});
 *
 */

Editor.prototype.change = function (callback) {
    if (callback) {
        $('.wmd-input').on('input', function () {
            callback();
        });
    }
};

/**
 * Render editor to the given element.
 * myEditor.render('#editor')
 * mode选择"live", 'edit', 'preview'
 */

Editor.prototype.render = function (el, mode, callback) {

    /* private functions */
    var _localContentKey, _localTagsKey, _localTitleKey, converter, editor, endDrag, iLastMousePos, iMin, mousePosition, options, performDrag, resizeHtml, self, sfLinkEnteredCallback, startDrag, staticOffset, textarea;
    startDrag = function (e) {
        var iLastMousePos, staticOffset;
        iLastMousePos = mousePosition(e).y;
        staticOffset = textarea.height() - iLastMousePos;
        textarea.css('opacity', 0.3);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
    };
    performDrag = function (e) {
        var iLastMousePos, iMousePos, iThisMousePos;
        iThisMousePos = mousePosition(e).y;
        iMousePos = staticOffset + iThisMousePos;
        if (iLastMousePos >= iThisMousePos) {
            iMousePos -= 5;
        }
        iLastMousePos = iThisMousePos;
        iMousePos = Math.max(iMin, iMousePos);
        textarea.height(iMousePos + 'px');
        if (iMousePos < iMin) {
            endDrag(e);
        }
        return false;
    };
    endDrag = function () {
        var iLastMousePos, staticOffset, textarea;
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea = $('.wmd-input');
        textarea.css('opacity', 1);
        textarea.focus();
        textarea = null;
        staticOffset = null;
        iLastMousePos = 0;
    };
    mousePosition = function (e) {
        return {
            x: e.clientX + document.documentElement.scrollLeft,
            y: e.clientY + document.documentElement.scrollTop
        };
    };
    if (this._rendered && this._rendered === el) {
        return;
    }
    if (document.cookie.indexOf('typemode') > -1) {
        $(el).addClass('wmd-input');
        return;
    }
    mode = mode || 'live';
    $(el).removeClass('hidden hide').addClass('mono form-control wmd-input');
    $(el).before('<div class="editor-toolbar" id="wmd-button-bar"><ul class="editor-mode"></ul></div>');
    $(el).wrap('<div class="wmd"></div>');
    $('.wmd').after('<div class="editor-line"></div><div class="editor-preview fmt" id="wmd-preview"></div>');

    /*myDropzone.on('success', function(file, result) {
     var imgName = file.name;
     var imgLink;
     var status = result.match(/\[(\d),/)[1];
     var data = result.match(/\[\d,"(\S*)"\]/)[1];
     if(status !== '0') {
     sfModal(eval('"' + data + '"'));    // 坏味道 用于转义
     } else {
     data = data.replace(/\\/g, '');
     imgLink = data;
     }
     sfLinkEnteredCallback(imgLink, imgName);
     });
     */
    sfLinkEnteredCallback = function (imgLink, imgName) {
        var cur, insText, reg, text;
        if (imgLink !== null) {
            insText = '\n![' + imgName + '](' + imgLink + ')\n';
            text = $(el).val();
            cur = $(el)[0].selectionStart;
            reg = new RegExp('^(.{' + cur + '})', 'g');
            text = text.replace(reg, '$1' + insText);
            $(el).val(text);
        }
    };
    this.element = $(el)[0];
    options = this.options;
    self = this;
    converter = new Markdown.getSanitizingConverter();
    Markdown.Extra.init(converter);
    editor = new Markdown.Editor(converter);
    editor.run(el.slice(1));
    this.converter = converter;
    this.pagedownEditor = editor;
    editor.hooks.chain('onPreviewRefresh', function () {});
    if (options.toolbar !== false) {
        this.createToolbar();
    }
    resizeHtml = '<a class="editor__resize" href="javascript:void(0);">调整高度</a>';
    $('.editor').after(resizeHtml);
    staticOffset = void 0;
    iLastMousePos = 0;
    iMin = 32;
    textarea = $('.wmd-input');
    $('.editor__resize').on('mousedown', startDrag);
    $(window).scroll(function () {
        var _editorTop, _scrollTop, _top, _width;
        if (!self.isBig) {
            _width = $('.editor').width();
            _top = $('.editor').offset().top;
            _scrollTop = $(this).scrollTop();
            _editorTop = 62 + $('.editor-help .tab-content').height();
            if (_scrollTop >= _top) {
                $('.editor-help-content.active').removeClass('active');
                $('.editor__menu').css({
                    position: 'fixed',
                    top: 0,
                    'z-index': 1000,
                    width: _width
                });
                $('.editor-help').css({
                    position: 'fixed',
                    top: '31px',
                    'z-index': 1000,
                    width: _width
                });
            } else {
                $('.editor__menu, .editor-help').css({
                    position: 'static',
                    width: 'auto'
                });
            }
        }
    });
    this._rendered = el;
    if (mode === 'live') {
        $('.editor__menu--live').trigger('click');
    } else if (mode === 'edit') {
        $('.editor__menu--edit').trigger('click');
    } else if (mode === 'preview') {
        $('.editor__menu--preview').trigger('click');
    }
    if (window.localStorage) {
        _localContentKey = 'autoSaveContent_' + location.pathname + location.search;
        _localTitleKey = 'autoSaveTitle_' + location.pathname + location.search;
        _localTagsKey = 'autoSaveTags_' + location.pathname + location.search;
        if (localStorage[_localContentKey]) {
            $(el).val(localStorage[_localContentKey]);
        }
        if (localStorage[_localTitleKey]) {
            $('#myTitle').val(localStorage[_localTitleKey]);
        }
    }
    if (callback) {
        callback(self);
    }
};

Editor.prototype.createToolbar = function (items) {
    var _helpHead, helpHtml, self, toolbarRight, toolbarRightHtml, win;
    self = this;
    toolbarRightHtml = '<li class="pull-right"><a class="editor__menu--preview" title="预览模式"></a></li><li class="pull-right"><a class="editor__menu--live" title="实况模式"></a></li><li class="pull-right"><a class="editor__menu--edit" title="编辑模式"></a></li><li class="pull-right editor__menu--divider"></li><li id="wmd-zen-button" class="pull-right" title="全屏"><a class="editor__menu--zen"></a></li>';
    toolbarRight = $(toolbarRightHtml);
    $('.editor-mode').append(toolbarRight);
    $('.editor').delegate('.editor__menu--edit', 'click', function () {
        if (!$(this).hasClass('muted')) {
            goEdit(self);
        }
    });
    $('.editor').delegate('.editor__menu--preview', 'click', function () {
        if (!$(this).hasClass('muted')) {
            goPreview(self);
        }
    });
    $('.editor').delegate('.editor__menu--live', 'click', function () {
        if (!$(this).hasClass('muted')) {
            goLive(self);
        }
    });
    $('#wmd-zen-button').find('a').removeClass('editor__menu--bold').addClass('editor__menu--zen');
    $('#wmd-zen-button').click(function () {
        toggleBig(self);
    });
    _helpHead = '<title>Markdown 语法指南</title><link rel="stylesheet" href="' + $('head link[rel="stylesheet"]').attr('href') + '"><script src="http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js"></script><script src="http://cdn.bootcss.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>';
    helpHtml = _helpHead + '<body style="background-color:#FAF2CC"><div class="editor-help"><ul class="editor-help-tabs nav nav-tabs" id="editorHelpTab" role="tablist">    <li rel="heading"><a href="#editorHelpHeading" role="tab" data-toggle="tab">标题 / 粗斜体</a></li>    <li rel="code"><a href="#editorHelpCode" role="tab" data-toggle="tag">代码</a></li>    <li rel="link"><a href="#editorHelpLink" role="tab" data-toggle="tag">链接</a></li>    <li rel="image"><a href="#editorHelpImage" role="tab" data-toggle="tag">图片</a></li>    <li rel="split"><a href="#editorHelpSplit" role="tab" data-toggle="tag">换行 / 分隔符</a></li>    <li rel="list"><a href="#editorHelpList" role="tab" data-toggle="tag">列表 / 引用</li></a>    <li class="pull-right"><a href="http://segmentfault.com/q/1010000000187808" target="_blank">高级技巧</a></li>    </ul><div class="tab-content"><!-- 粗斜体、标题 --><div class="editor-help-content tab-pane fade" id="editorHelpHeading" rel="heading"><p>文章内容较多时，可以用标题分段：</p><pre>## 大标题 ##\n### 小标题 ###</pre><p>粗体 / 斜体</p><pre>*斜体文本*    _斜体文本_\n**粗体文本**    __粗体文本__\n***粗斜体文本***    ___粗斜体文本___</pre></div><!-- end 粗斜体、标题 --><!-- 代码 --><div class="editor-help-content tab-pane fade" id="editorHelpCode" rel="code"><p>如果你只想高亮语句中的某个函数名或关键字，可以使用 <code>`function_name()`</code> 实现</p><p>通常我们会根据您的代码片段适配合适的高亮方法，但你也可以用 <code>```</code> 包裹一段代码，并指定一种语言</p><pre>```<strong>javascript</strong>\n$(document).ready(function () {\n    alert(\'hello world\');\n});\n```</pre><p>支持的语言：<code>actionscript, apache, bash, clojure, cmake, coffeescript, cpp, cs, css, d, delphi, django, erlang, go, haskell, html, http, ini, java, javascript, json, lisp, lua, markdown, matlab, nginx, objectivec, perl, php, python, r, ruby, scala, smalltalk, sql, tex, vbscript, xml</code></p><p>您也可以使用 4 空格缩进，再贴上代码，实现相同的的效果</p><pre><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i>def g(x):\n<i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i>yield from range(x, 0, -1)\n<i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i>yield from range(x)</pre></div><!-- end 代码 --><!-- 链接 --><div class="editor-help-content tab-pane fade" rel="link" id="editorHelpLink"><p>常用链接方法</p><pre>文字链接 [链接名称](http://链接网址)\n网址链接 &lt;http://链接网址&gt;</pre><p>高级链接技巧</p><pre>这个链接用 1 作为网址变量 [Google][1].\n这个链接用 yahoo 作为网址变量 [Yahoo!][yahoo].\n然后在文档的结尾为变量赋值（网址）\n\n<i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i>[1]: http://www.google.com/\n<i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i>[yahoo]: http://www.yahoo.com/</pre></div><!-- end 链接 --><!-- 图片 --><div class="editor-help-content tab-pane fade" id="editorHelpImage" rel="image"><p>跟链接的方法区别在于前面加了个感叹号 <code>!</code>，这样是不是觉得好记多了呢？</p><pre>![图片名称](http://图片网址)</pre><p>当然，你也可以像网址那样对图片网址使用变量</p><pre>这个链接用 1 作为网址变量 [Google][1].\n然后在文档的结尾位变量赋值（网址）\n\n<i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i>[1]: http://www.google.com/logo.png</pre></div><!-- end 图片 --><!-- 换行、分隔符 --><div class="editor-help-content tab-pane fade" id="editorHelpSplit" rel="split"><p>如果另起一行，只需在当前行结尾加 2 个空格</p><pre>在当前行的结尾加 2 个空格<i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i>\n这行就会新起一行</pre><p>如果是要起一个新段落，只需要空出一行即可。</p><p>如果你有写分割线的习惯，可以新起一行输入三个减号 <code>-</code>：</p><pre>---\n</pre></div><!-- end 换行、分隔符 --><!-- 列表、引用 --><div class="editor-help-content tab-pane fade" id="editorHelpList" rel="list"><p>普通列表</p><pre>-<i class="nbsp">&nbsp;</i>列表文本前使用 [减号+空格]\n+<i class="nbsp">&nbsp;</i>列表文本前使用 [加号+空格]\n*<i class="nbsp">&nbsp;</i>列表文本前使用 [星号+空格]</pre><p>带数字的列表</p><pre>1.<i class="nbsp">&nbsp;</i>列表前使用 [数字+空格]\n2.<i class="nbsp">&nbsp;</i>我们会自动帮你添加数字\n7.<i class="nbsp">&nbsp;</i>不用担心数字不对，显示的时候我们会自动把这行的 7 纠正为 3</pre><p>引用</p><pre>&gt;<i class="nbsp">&nbsp;</i>引用文本前使用 [大于号+空格]\n&gt;<i class="nbsp">&nbsp;</i>折行可以不加，新起一行都要加上哦</pre></div><!-- end 列表、引用 --></div></div><script>$("#editorHelpTab a").eq(0).tab("show");$("#editorHelpTab a").click(function (e) {    var _$wrap = $(this).parent();    if(! _$wrap.hasClass("pull-right")) {        e.preventDefault();        $(this).tab("show");    }});</script></body>';
    win = null;
    $('#wmd-help-button').click(function () {
        if (!win || !win.window) {
            win = window.open('', 'Markdown Help', 'channelmode=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=505, height=400, top=100, left=100');
            win.document.write(helpHtml);
        } else {
            win.focus();
        }
    });
};

window.Editor = new Editor();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Markdown = {};

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

(function () {

    function identity(x) {
        return x;
    }

    function returnFalse(x) {
        return false;
    }

    function HookCollection() {}

    HookCollection.prototype = {

        chain: function (hookname, func) {
            var original = this[hookname];
            if (!original) throw new Error("unknown hook " + hookname);

            if (original === identity) this[hookname] = func;else this[hookname] = function (text) {
                var args = Array.prototype.slice.call(arguments, 0);
                args[0] = original.apply(null, args);
                return func.apply(null, args);
            };
        },
        set: function (hookname, func) {
            if (!this[hookname]) throw new Error("unknown hook " + hookname);
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
    function SaveHash() {}

    SaveHash.prototype = {
        set: function (key, value) {
            this["s_" + key] = value;
        },
        get: function (key) {
            return this["s_" + key];
        }
    };

    Markdown.Converter = function (OPTIONS) {
        var pluginHooks = this.hooks = new HookCollection();

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

        //
        // Private state of the converter instance:
        //

        // Global hashes, used by various utility routines
        var g_urls;
        var g_titles;
        var g_html_blocks;

        // Used to track when we're inside an ordered or unordered list
        // (see _ProcessListItems() for details):
        var g_list_level;

        OPTIONS = OPTIONS || {};
        var asciify = identity,
            deasciify = identity;
        if (OPTIONS.nonAsciiLetters) {

            /* In JavaScript regular expressions, \w only denotes [a-zA-Z0-9_].
             * That's why there's inconsistent handling e.g. with intra-word bolding
             * of Japanese words. That's why we do the following if OPTIONS.nonAsciiLetters
             * is true:
             *
             * Before doing bold and italics, we find every instance
             * of a unicode word character in the Markdown source that is not
             * matched by \w, and the letter "Q". We take the character's code point
             * and encode it in base 51, using the "digits"
             *
             *     A, B, ..., P, R, ..., Y, Z, a, b, ..., y, z
             *
             * delimiting it with "Q" on both sides. For example, the source
             *
             * > In Chinese, the smurfs are called 藍精靈, meaning "blue spirits".
             *
             * turns into
             *
             * > In Chinese, the smurfs are called QNIhQQMOIQQOuUQ, meaning "blue spirits".
             *
             * Since everything that is a letter in Unicode is now a letter (or
             * several letters) in ASCII, \w and \b should always do the right thing.
             *
             * After the bold/italic conversion, we decode again; since "Q" was encoded
             * alongside all non-ascii characters (as "QBfQ"), and the conversion
             * will not generate "Q", the only instances of that letter should be our
             * encoded characters. And since the conversion will not break words, the
             * "Q...Q" should all still be in one piece.
             *
             * We're using "Q" as the delimiter because it's probably one of the
             * rarest characters, and also because I can't think of any special behavior
             * that would ever be triggered by this letter (to use a silly example, if we
             * delimited with "H" on the left and "P" on the right, then "Ψ" would be
             * encoded as "HTTP", which may cause special behavior). The latter would not
             * actually be a huge issue for bold/italic, but may be if we later use it
             * in other places as well.
             * */
            (function () {
                var lettersThatJavaScriptDoesNotKnowAndQ = /[Q\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376-\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0523\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0621-\u064a\u0660-\u0669\u066e-\u066f\u0671-\u06d3\u06d5\u06e5-\u06e6\u06ee-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07c0-\u07ea\u07f4-\u07f5\u07fa\u0904-\u0939\u093d\u0950\u0958-\u0961\u0966-\u096f\u0971-\u0972\u097b-\u097f\u0985-\u098c\u098f-\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc-\u09dd\u09df-\u09e1\u09e6-\u09f1\u0a05-\u0a0a\u0a0f-\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32-\u0a33\u0a35-\u0a36\u0a38-\u0a39\u0a59-\u0a5c\u0a5e\u0a66-\u0a6f\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2-\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0-\u0ae1\u0ae6-\u0aef\u0b05-\u0b0c\u0b0f-\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32-\u0b33\u0b35-\u0b39\u0b3d\u0b5c-\u0b5d\u0b5f-\u0b61\u0b66-\u0b6f\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99-\u0b9a\u0b9c\u0b9e-\u0b9f\u0ba3-\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0be6-\u0bef\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58-\u0c59\u0c60-\u0c61\u0c66-\u0c6f\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0-\u0ce1\u0ce6-\u0cef\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d28\u0d2a-\u0d39\u0d3d\u0d60-\u0d61\u0d66-\u0d6f\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32-\u0e33\u0e40-\u0e46\u0e50-\u0e59\u0e81-\u0e82\u0e84\u0e87-\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa-\u0eab\u0ead-\u0eb0\u0eb2-\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0ed0-\u0ed9\u0edc-\u0edd\u0f00\u0f20-\u0f29\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8b\u1000-\u102a\u103f-\u1049\u1050-\u1055\u105a-\u105d\u1061\u1065-\u1066\u106e-\u1070\u1075-\u1081\u108e\u1090-\u1099\u10a0-\u10c5\u10d0-\u10fa\u10fc\u1100-\u1159\u115f-\u11a2\u11a8-\u11f9\u1200-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u1676\u1681-\u169a\u16a0-\u16ea\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u17e0-\u17e9\u1810-\u1819\u1820-\u1877\u1880-\u18a8\u18aa\u1900-\u191c\u1946-\u196d\u1970-\u1974\u1980-\u19a9\u19c1-\u19c7\u19d0-\u19d9\u1a00-\u1a16\u1b05-\u1b33\u1b45-\u1b4b\u1b50-\u1b59\u1b83-\u1ba0\u1bae-\u1bb9\u1c00-\u1c23\u1c40-\u1c49\u1c4d-\u1c7d\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u203f-\u2040\u2054\u2071\u207f\u2090-\u2094\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2183-\u2184\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2c6f\u2c71-\u2c7d\u2c80-\u2ce4\u2d00-\u2d25\u2d30-\u2d65\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3006\u3031-\u3035\u303b-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31b7\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fc3\ua000-\ua48c\ua500-\ua60c\ua610-\ua62b\ua640-\ua65f\ua662-\ua66e\ua67f-\ua697\ua717-\ua71f\ua722-\ua788\ua78b-\ua78c\ua7fb-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8d0-\ua8d9\ua900-\ua925\ua930-\ua946\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa50-\uaa59\uac00-\ud7a3\uf900-\ufa2d\ufa30-\ufa6a\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe33-\ufe34\ufe4d-\ufe4f\ufe70-\ufe74\ufe76-\ufefc\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]/g;
                var cp_Q = "Q".charCodeAt(0);
                var cp_A = "A".charCodeAt(0);
                var cp_Z = "Z".charCodeAt(0);
                var dist_Za = "a".charCodeAt(0) - cp_Z - 1;

                asciify = function (text) {
                    return text.replace(lettersThatJavaScriptDoesNotKnowAndQ, function (m) {
                        var c = m.charCodeAt(0);
                        var s = "";
                        var v;
                        while (c > 0) {
                            v = c % 51 + cp_A;
                            if (v >= cp_Q) v++;
                            if (v > cp_Z) v += dist_Za;
                            s = String.fromCharCode(v) + s;
                            c = c / 51 | 0;
                        }
                        return "Q" + s + "Q";
                    });
                };

                deasciify = function (text) {
                    return text.replace(/Q([A-PR-Za-z]{1,3})Q/g, function (m, s) {
                        var c = 0;
                        var v;
                        for (var i = 0; i < s.length; i++) {
                            v = s.charCodeAt(i);
                            if (v > cp_Z) v -= dist_Za;
                            if (v > cp_Q) v--;
                            v -= cp_A;
                            c = c * 51 + v;
                        }
                        return String.fromCharCode(c);
                    });
                };
            })();
        }

        var _DoItalicsAndBold = OPTIONS.asteriskIntraWordEmphasis ? _DoItalicsAndBold_AllowIntrawordWithAsterisk : _DoItalicsAndBoldStrict;

        this.makeHtml = function (text) {

            //
            // Main function. The order in which other subs are called here is
            // essential. Link and image substitutions need to happen before
            // _EscapeSpecialCharsWithinTagAttributes(), so that any *'s or _'s in the <a>
            // and <img> tags get encoded.
            //

            // This will only happen if makeHtml on the same converter instance is called from a plugin hook.
            // Don't do that.
            if (g_urls) throw new Error("Recursive call to converter.makeHtml");

            // Create the private state objects.
            g_urls = new SaveHash();
            g_titles = new SaveHash();
            g_html_blocks = [];
            g_list_level = 0;

            text = pluginHooks.preConversion(text);

            // attacklab: Replace ~ with ~T
            // This lets us use tilde as an escape char to avoid md5 hashes
            // The choice of character is arbitray; anything that isn't
            // magic in Markdown will work.
            text = text.replace(/~/g, "~T");

            // attacklab: Replace $ with ~D
            // RegExp interprets $ as a special character
            // when it's in a replacement string
            text = text.replace(/\$/g, "~D");

            // Standardize line endings
            text = text.replace(/\r\n/g, "\n"); // DOS to Unix
            text = text.replace(/\r/g, "\n"); // Mac to Unix

            // Make sure text begins and ends with a couple of newlines:
            text = "\n\n" + text + "\n\n";

            // Convert all tabs to spaces.
            text = _Detab(text);

            // Strip any lines consisting only of spaces and tabs.
            // This makes subsequent regexen easier to write, because we can
            // match consecutive blank lines with /\n+/ instead of something
            // contorted like /[ \t]*\n+/ .
            text = text.replace(/^[ \t]+$/mg, "");

            text = pluginHooks.postNormalization(text);

            // Turn block-level HTML blocks into hash entries
            text = _HashHTMLBlocks(text);

            // Strip link definitions, store in hashes.
            text = _StripLinkDefinitions(text);

            text = _RunBlockGamut(text);

            text = _UnescapeSpecialChars(text);

            // attacklab: Restore dollar signs
            text = text.replace(/~D/g, "$$");

            // attacklab: Restore tildes
            text = text.replace(/~T/g, "~");

            text = pluginHooks.postConversion(text);

            g_html_blocks = g_titles = g_urls = null;

            return text;
        };

        function _StripLinkDefinitions(text) {
            //
            // Strips link definitions from text, stores the URLs and titles in
            // hash references.
            //

            // Link defs are in the form: ^[id]: url "optional title"

            /*
             text = text.replace(/
             ^[ ]{0,3}\[([^\[\]]+)\]:  // id = $1  attacklab: g_tab_width - 1
             [ \t]*
             \n?                 // maybe *one* newline
             [ \t]*
             <?(\S+?)>?          // url = $2
             (?=\s|$)            // lookahead for whitespace instead of the lookbehind removed below
             [ \t]*
             \n?                 // maybe one newline
             [ \t]*
             (                   // (potential) title = $3
             (\n*)           // any lines skipped = $4 attacklab: lookbehind removed
             [ \t]+
             ["(]
             (.+?)           // title = $5
             [")]
             [ \t]*
             )?                  // title is optional
             (\n+)             // subsequent newlines = $6, capturing because they must be put back if the potential title isn't an actual title
             /gm, function(){...});
             */

            text = text.replace(/^[ ]{0,3}\[([^\[\]]+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?(?=\s|$)[ \t]*\n?[ \t]*((\n*)["(](.+?)[")][ \t]*)?(\n+)/gm, function (wholeMatch, m1, m2, m3, m4, m5, m6) {
                m1 = m1.toLowerCase();
                g_urls.set(m1, _EncodeAmpsAndAngles(m2)); // Link IDs are case-insensitive
                if (m4) {
                    // Oops, found blank lines, so it's not a title.
                    // Put back the parenthetical statement we stole.
                    return m3 + m6;
                } else if (m5) {
                    g_titles.set(m1, m5.replace(/"/g, "&quot;"));
                }

                // Completely remove the definition from the text
                return "";
            });

            return text;
        }

        function _HashHTMLBlocks(text) {

            // Hashify HTML blocks:
            // We only want to do this for block-level HTML tags, such as headers,
            // lists, and tables. That's because we still want to wrap <p>s around
            // "paragraphs" that are wrapped in non-block-level tags, such as anchors,
            // phrase emphasis, and spans. The list of tags we're looking for is
            // hard-coded:
            var block_tags_a = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del";
            var block_tags_b = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math";

            // First, look for nested blocks, e.g.:
            //   <div>
            //     <div>
            //     tags for inner block must be indented.
            //     </div>
            //   </div>
            //
            // The outermost tags must start at the left margin for this to match, and
            // the inner nested divs must be indented.
            // We need to do this before the next, more liberal match, because the next
            // match will start at the first `<div>` and stop at the first `</div>`.

            // attacklab: This regex can be expensive when it fails.

            /*
             text = text.replace(/
             (                       // save in $1
             ^                   // start of line  (with /m)
             <($block_tags_a)    // start tag = $2
             \b                  // word break
             // attacklab: hack around khtml/pcre bug...
             [^\r]*?\n           // any number of lines, minimally matching
             </\2>               // the matching end tag
             [ \t]*              // trailing spaces/tabs
             (?=\n+)             // followed by a newline
             )                       // attacklab: there are sentinel newlines at end of document
             /gm,function(){...}};
             */
            text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm, hashMatch);

            //
            // Now match more liberally, simply from `\n<tag>` to `</tag>\n`
            //

            /*
             text = text.replace(/
             (                       // save in $1
             ^                   // start of line  (with /m)
             <($block_tags_b)    // start tag = $2
             \b                  // word break
             // attacklab: hack around khtml/pcre bug...
             [^\r]*?             // any number of lines, minimally matching
             .*</\2>             // the matching end tag
             [ \t]*              // trailing spaces/tabs
             (?=\n+)             // followed by a newline
             )                       // attacklab: there are sentinel newlines at end of document
             /gm,function(){...}};
             */
            text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm, hashMatch);

            // Special case just for <hr />. It was easier to make a special case than
            // to make the other regex more complicated.  

            /*
             text = text.replace(/
             \n                  // Starting after a blank line
             [ ]{0,3}
             (                   // save in $1
             (<(hr)          // start tag = $2
             \b          // word break
             ([^<>])*?
             \/?>)           // the matching end tag
             [ \t]*
             (?=\n{2,})      // followed by a blank line
             )
             /g,hashMatch);
             */
            text = text.replace(/\n[ ]{0,3}((<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g, hashMatch);

            // Special case for standalone HTML comments:

            /*
             text = text.replace(/
             \n\n                                            // Starting after a blank line
             [ ]{0,3}                                        // attacklab: g_tab_width - 1
             (                                               // save in $1
             <!
             (--(?:|(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)   // see http://www.w3.org/TR/html-markup/syntax.html#comments and http://meta.stackexchange.com/q/95256
             >
             [ \t]*
             (?=\n{2,})                                  // followed by a blank line
             )
             /g,hashMatch);
             */
            text = text.replace(/\n\n[ ]{0,3}(<!(--(?:|(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>[ \t]*(?=\n{2,}))/g, hashMatch);

            // PHP and ASP-style processor instructions (<?...?> and <%...%>)

            /*
             text = text.replace(/
             (?:
             \n\n            // Starting after a blank line
             )
             (                   // save in $1
             [ ]{0,3}        // attacklab: g_tab_width - 1
             (?:
             <([?%])     // $2
             [^\r]*?
             \2>
             )
             [ \t]*
             (?=\n{2,})      // followed by a blank line
             )
             /g,hashMatch);
             */
            text = text.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g, hashMatch);

            return text;
        }

        function hashBlock(text) {
            text = text.replace(/(^\n+|\n+$)/g, "");
            // Replace the element text with a marker ("~KxK" where x is its key)
            return "\n\n~K" + (g_html_blocks.push(text) - 1) + "K\n\n";
        }

        function hashMatch(wholeMatch, m1) {
            return hashBlock(m1);
        }

        var blockGamutHookCallback = function (t) {
            return _RunBlockGamut(t);
        };

        function _RunBlockGamut(text, doNotUnhash, doNotCreateParagraphs) {
            //
            // These are all the transformations that form block-level
            // tags like paragraphs, headers, and list items.
            //

            text = pluginHooks.preBlockGamut(text, blockGamutHookCallback);

            text = _DoHeaders(text);

            // Do Horizontal Rules:
            var replacement = "<hr />\n";
            text = text.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm, replacement);
            text = text.replace(/^[ ]{0,2}([ ]?-[ ]?){3,}[ \t]*$/gm, replacement);
            text = text.replace(/^[ ]{0,2}([ ]?_[ ]?){3,}[ \t]*$/gm, replacement);

            text = _DoLists(text);
            text = _DoCodeBlocks(text);
            text = _DoBlockQuotes(text);

            text = pluginHooks.postBlockGamut(text, blockGamutHookCallback);

            // We already ran _HashHTMLBlocks() before, in Markdown(), but that
            // was to escape raw HTML in the original Markdown source. This time,
            // we're escaping the markup we've just created, so that we don't wrap
            // <p> tags around block-level tags.
            text = _HashHTMLBlocks(text);

            text = _FormParagraphs(text, doNotUnhash, doNotCreateParagraphs);

            return text;
        }

        function _RunSpanGamut(text) {
            //
            // These are all the transformations that occur *within* block-level
            // tags like paragraphs, headers, and list items.
            //

            text = pluginHooks.preSpanGamut(text);

            text = _DoCodeSpans(text);
            text = _EscapeSpecialCharsWithinTagAttributes(text);
            text = _EncodeBackslashEscapes(text);

            // Process anchor and image tags. Images must come first,
            // because ![foo][f] looks like an anchor.
            text = _DoImages(text);
            text = _DoAnchors(text);

            // Make links out of things like `<http://example.com/>`
            // Must come after _DoAnchors(), because you can use < and >
            // delimiters in inline links like [this](<url>).
            text = _DoAutoLinks(text);

            text = text.replace(/~P/g, "://"); // put in place to prevent autolinking; reset now

            text = _EncodeAmpsAndAngles(text);
            text = _DoItalicsAndBold(text);

            // Do hard breaks:
            text = text.replace(/  +\n/g, " <br>\n");

            text = pluginHooks.postSpanGamut(text);

            return text;
        }

        function _EscapeSpecialCharsWithinTagAttributes(text) {
            //
            // Within tags -- meaning between < and > -- encode [\ ` * _] so they
            // don't conflict with their use in Markdown for code, italics and strong.
            //

            // Build a regex to find HTML tags and comments.  See Friedl's 
            // "Mastering Regular Expressions", 2nd Ed., pp. 200-201.

            // SE: changed the comment part of the regex

            var regex = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--(?:|(?:[^>-]|-[^>])(?:[^-]|-[^-])*)--)>)/gi;

            text = text.replace(regex, function (wholeMatch) {
                var tag = wholeMatch.replace(/(.)<\/?code>(?=.)/g, "$1`");
                tag = escapeCharacters(tag, wholeMatch.charAt(1) == "!" ? "\\`*_/" : "\\`*_"); // also escape slashes in comments to prevent autolinking there -- http://meta.stackexchange.com/questions/95987
                return tag;
            });

            return text;
        }

        function _DoAnchors(text) {

            if (text.indexOf("[") === -1) return text;

            //
            // Turn Markdown link shortcuts into XHTML <a> tags.
            //
            //
            // First, handle reference-style links: [link text] [id]
            //

            /*
             text = text.replace(/
             (                           // wrap whole match in $1
             \[
             (
             (?:
             \[[^\]]*\]      // allow brackets nested one level
             |
             [^\[]           // or anything else
             )*
             )
             \]
              [ ]?                    // one optional space
             (?:\n[ ]*)?             // one optional newline followed by spaces
              \[
             (.*?)                   // id = $3
             \]
             )
             ()()()()                    // pad remaining backreferences
             /g, writeAnchorTag);
             */
            text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, writeAnchorTag);

            //
            // Next, inline-style links: [link text](url "optional title")
            //

            /*
             text = text.replace(/
             (                           // wrap whole match in $1
             \[
             (
             (?:
             \[[^\]]*\]      // allow brackets nested one level
             |
             [^\[\]]         // or anything else
             )*
             )
             \]
             \(                      // literal paren
             [ \t]*
             ()                      // no id, so leave $3 empty
             <?(                     // href = $4
             (?:
             \([^)]*\)       // allow one level of (correctly nested) parens (think MSDN)
             |
             [^()\s]
             )*?
             )>?
             [ \t]*
             (                       // $5
             (['"])              // quote char = $6
             (.*?)               // Title = $7
             \6                  // matching quote
             [ \t]*              // ignore any spaces/tabs between closing quote and )
             )?                      // title is optional
             \)
             )
             /g, writeAnchorTag);
             */

            text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?((?:\([^)]*\)|[^()\s])*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, writeAnchorTag);

            //
            // Last, handle reference-style shortcuts: [link text]
            // These must come last in case you've also got [link test][1]
            // or [link test](/foo)
            //

            /*
             text = text.replace(/
             (                   // wrap whole match in $1
             \[
             ([^\[\]]+)      // link text = $2; can't contain '[' or ']'
             \]
             )
             ()()()()()          // pad rest of backreferences
             /g, writeAnchorTag);
             */
            text = text.replace(/(\[([^\[\]]+)\])()()()()()/g, writeAnchorTag);

            return text;
        }

        function writeAnchorTag(wholeMatch, m1, m2, m3, m4, m5, m6, m7) {
            if (m7 == undefined) m7 = "";
            var whole_match = m1;
            var link_text = m2.replace(/:\/\//g, "~P"); // to prevent auto-linking withing the link. will be converted back after the auto-linker runs
            var link_id = m3.toLowerCase();
            var url = m4;
            var title = m7;

            if (url == "") {
                if (link_id == "") {
                    // lower-case and turn embedded newlines into spaces
                    link_id = link_text.toLowerCase().replace(/ ?\n/g, " ");
                }
                url = "#" + link_id;

                if (g_urls.get(link_id) != undefined) {
                    url = g_urls.get(link_id);
                    if (g_titles.get(link_id) != undefined) {
                        title = g_titles.get(link_id);
                    }
                } else {
                    if (whole_match.search(/\(\s*\)$/m) > -1) {
                        // Special case for explicit empty url
                        url = "";
                    } else {
                        return whole_match;
                    }
                }
            }
            url = attributeSafeUrl(url);

            var result = "<a href=\"" + url + "\"";

            if (title != "") {
                title = attributeEncode(title);
                title = escapeCharacters(title, "*_");
                result += " title=\"" + title + "\"";
            }

            result += ">" + link_text + "</a>";

            return result;
        }

        function _DoImages(text) {

            if (text.indexOf("![") === -1) return text;

            //
            // Turn Markdown image shortcuts into <img> tags.
            //

            //
            // First, handle reference-style labeled images: ![alt text][id]
            //

            /*
             text = text.replace(/
             (                   // wrap whole match in $1
             !\[
             (.*?)           // alt text = $2
             \]
              [ ]?            // one optional space
             (?:\n[ ]*)?     // one optional newline followed by spaces
              \[
             (.*?)           // id = $3
             \]
             )
             ()()()()            // pad rest of backreferences
             /g, writeImageTag);
             */
            text = text.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, writeImageTag);

            //
            // Next, handle inline images:  ![alt text](url "optional title")
            // Don't forget: encode * and _

            /*
             text = text.replace(/
             (                   // wrap whole match in $1
             !\[
             (.*?)           // alt text = $2
             \]
             \s?             // One optional whitespace character
             \(              // literal paren
             [ \t]*
             ()              // no id, so leave $3 empty
             <?(\S+?)>?      // src url = $4
             [ \t]*
             (               // $5
             (['"])      // quote char = $6
             (.*?)       // title = $7
             \6          // matching quote
             [ \t]*
             )?              // title is optional
             \)
             )
             /g, writeImageTag);
             */
            text = text.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, writeImageTag);

            return text;
        }

        function attributeEncode(text) {
            // unconditionally replace angle brackets here -- what ends up in an attribute (e.g. alt or title)
            // never makes sense to have verbatim HTML in it (and the sanitizer would totally break it)
            return text.replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        }

        function writeImageTag(wholeMatch, m1, m2, m3, m4, m5, m6, m7) {
            var whole_match = m1;
            var alt_text = m2;
            var link_id = m3.toLowerCase();
            var url = m4;
            var title = m7;

            if (!title) title = "";

            if (url == "") {
                if (link_id == "") {
                    // lower-case and turn embedded newlines into spaces
                    link_id = alt_text.toLowerCase().replace(/ ?\n/g, " ");
                }
                url = "#" + link_id;

                if (g_urls.get(link_id) != undefined) {
                    url = g_urls.get(link_id);
                    if (g_titles.get(link_id) != undefined) {
                        title = g_titles.get(link_id);
                    }
                } else {
                    return whole_match;
                }
            }

            alt_text = escapeCharacters(attributeEncode(alt_text), "*_[]()");
            url = escapeCharacters(url, "*_");
            var result = "<img src=\"" + url + "\" alt=\"" + alt_text + "\"";

            // attacklab: Markdown.pl adds empty title attributes to images.
            // Replicate this bug.

            //if (title != "") {
            title = attributeEncode(title);
            title = escapeCharacters(title, "*_");
            result += " title=\"" + title + "\"";
            //}

            result += " />";

            return result;
        }

        function _DoHeaders(text) {

            // Setext-style headers:
            //  Header 1
            //  ========
            //  
            //  Header 2
            //  --------
            //
            text = text.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm, function (wholeMatch, m1) {
                return "<h1>" + _RunSpanGamut(m1) + "</h1>\n\n";
            });

            text = text.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm, function (matchFound, m1) {
                return "<h2>" + _RunSpanGamut(m1) + "</h2>\n\n";
            });

            // atx-style headers:
            //  # Header 1
            //  ## Header 2
            //  ## Header 2 with closing hashes ##
            //  ...
            //  ###### Header 6
            //

            /*
             text = text.replace(/
             ^(\#{1,6})      // $1 = string of #'s
             [ \t]*
             (.+?)           // $2 = Header text
             [ \t]*
             \#*             // optional closing #'s (not counted)
             \n+
             /gm, function() {...});
             */

            text = text.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm, function (wholeMatch, m1, m2) {
                var h_level = m1.length;
                return "<h" + h_level + ">" + _RunSpanGamut(m2) + "</h" + h_level + ">\n\n";
            });

            return text;
        }

        function _DoLists(text, isInsideParagraphlessListItem) {
            //
            // Form HTML ordered (numbered) and unordered (bulleted) lists.
            //

            // attacklab: add sentinel to hack around khtml/safari bug:
            // http://bugs.webkit.org/show_bug.cgi?id=11231
            text += "~0";

            // Re-usable pattern to match any entirel ul or ol list:

            /*
             var whole_list = /
             (                                   // $1 = whole list
             (                               // $2
             [ ]{0,3}                    // attacklab: g_tab_width - 1
             ([*+-]|\d+[.])              // $3 = first list item marker
             [ \t]+
             )
             [^\r]+?
             (                               // $4
             ~0                          // sentinel for workaround; should be $
             |
             \n{2,}
             (?=\S)
             (?!                         // Negative lookahead for another list item marker
             [ \t]*
             (?:[*+-]|\d+[.])[ \t]+
             )
             )
             )
             /g
             */
            var whole_list = /^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
            if (g_list_level) {
                text = text.replace(whole_list, function (wholeMatch, m1, m2) {
                    var list = m1;
                    var list_type = m2.search(/[*+-]/g) > -1 ? "ul" : "ol";
                    var first_number;
                    if (list_type === "ol") first_number = parseInt(m2, 10);

                    var result = _ProcessListItems(list, list_type, isInsideParagraphlessListItem);

                    // Trim any trailing whitespace, to put the closing `</$list_type>`
                    // up on the preceding line, to get it past the current stupid
                    // HTML block parser. This is a hack to work around the terrible
                    // hack that is the HTML block parser.
                    result = result.replace(/\s+$/, "");
                    var opening = "<" + list_type;
                    if (first_number && first_number !== 1) opening += " start=\"" + first_number + "\"";
                    result = opening + ">" + result + "</" + list_type + ">\n";
                    return result;
                });
            } else {
                whole_list = /(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g;
                text = text.replace(whole_list, function (wholeMatch, m1, m2, m3) {
                    var runup = m1;
                    var list = m2;

                    var list_type = m3.search(/[*+-]/g) > -1 ? "ul" : "ol";

                    var first_number;
                    if (list_type === "ol") first_number = parseInt(m3, 10);

                    var result = _ProcessListItems(list, list_type);
                    var opening = "<" + list_type;
                    if (first_number && first_number !== 1) opening += " start=\"" + first_number + "\"";

                    result = runup + opening + ">\n" + result + "</" + list_type + ">\n";
                    return result;
                });
            }

            // attacklab: strip sentinel
            text = text.replace(/~0/, "");

            return text;
        }

        var _listItemMarkers = { ol: "\\d+[.]", ul: "[*+-]" };

        function _ProcessListItems(list_str, list_type, isInsideParagraphlessListItem) {
            //
            //  Process the contents of a single ordered or unordered list, splitting it
            //  into individual list items.
            //
            //  list_type is either "ul" or "ol".

            // The $g_list_level global keeps track of when we're inside a list.
            // Each time we enter a list, we increment it; when we leave a list,
            // we decrement. If it's zero, we're not in a list anymore.
            //
            // We do this because when we're not inside a list, we want to treat
            // something like this:
            //
            //    I recommend upgrading to version
            //    8. Oops, now this line is treated
            //    as a sub-list.
            //
            // As a single paragraph, despite the fact that the second line starts
            // with a digit-period-space sequence.
            //
            // Whereas when we're inside a list (or sub-list), that line will be
            // treated as the start of a sub-list. What a kludge, huh? This is
            // an aspect of Markdown's syntax that's hard to parse perfectly
            // without resorting to mind-reading. Perhaps the solution is to
            // change the syntax rules such that sub-lists must start with a
            // starting cardinal number; e.g. "1." or "a.".

            g_list_level++;

            // trim trailing blank lines:
            list_str = list_str.replace(/\n{2,}$/, "\n");

            // attacklab: add sentinel to emulate \z
            list_str += "~0";

            // In the original attacklab showdown, list_type was not given to this function, and anything
            // that matched /[*+-]|\d+[.]/ would just create the next <li>, causing this mismatch:
            //
            //  Markdown          rendered by WMD        rendered by MarkdownSharp
            //  ------------------------------------------------------------------
            //  1. first          1. first               1. first
            //  2. second         2. second              2. second
            //  - third           3. third                   * third
            //
            // We changed this to behave identical to MarkdownSharp. This is the constructed RegEx,
            // with {MARKER} being one of \d+[.] or [*+-], depending on list_type:

            /*
             list_str = list_str.replace(/
             (^[ \t]*)                       // leading whitespace = $1
             ({MARKER}) [ \t]+               // list marker = $2
             ([^\r]+?                        // list item text   = $3
             (\n+)
             )
             (?=
             (~0 | \2 ({MARKER}) [ \t]+)
             )
             /gm, function(){...});
             */

            var marker = _listItemMarkers[list_type];
            var re = new RegExp("(^[ \\t]*)(" + marker + ")[ \\t]+([^\\r]+?(\\n+))(?=(~0|\\1(" + marker + ")[ \\t]+))", "gm");
            var last_item_had_a_double_newline = false;
            list_str = list_str.replace(re, function (wholeMatch, m1, m2, m3) {
                var item = m3;
                var leading_space = m1;
                var ends_with_double_newline = /\n\n$/.test(item);
                var contains_double_newline = ends_with_double_newline || item.search(/\n{2,}/) > -1;

                var loose = contains_double_newline || last_item_had_a_double_newline;
                item = _RunBlockGamut(_Outdent(item), /* doNotUnhash = */true, /* doNotCreateParagraphs = */!loose);

                last_item_had_a_double_newline = ends_with_double_newline;
                return "<li>" + item + "</li>\n";
            });

            // attacklab: strip sentinel
            list_str = list_str.replace(/~0/g, "");

            g_list_level--;
            return list_str;
        }

        function _DoCodeBlocks(text) {
            //
            //  Process Markdown `<pre><code>` blocks.
            //  

            /*
             text = text.replace(/
             (?:\n\n|^)
             (                               // $1 = the code block -- one or more lines, starting with a space/tab
             (?:
             (?:[ ]{4}|\t)           // Lines must start with a tab or a tab-width of spaces - attacklab: g_tab_width
             .*\n+
             )+
             )
             (\n*[ ]{0,3}[^ \t\n]|(?=~0))    // attacklab: g_tab_width
             /g ,function(){...});
             */

            // attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
            text += "~0";

            text = text.replace(/(?:\n\n|^\n?)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g, function (wholeMatch, m1, m2) {
                var codeblock = m1;
                var nextChar = m2;

                codeblock = _EncodeCode(_Outdent(codeblock));
                codeblock = _Detab(codeblock);
                codeblock = codeblock.replace(/^\n+/g, ""); // trim leading newlines
                codeblock = codeblock.replace(/\n+$/g, ""); // trim trailing whitespace

                codeblock = "<pre><code>" + codeblock + "\n</code></pre>";

                return "\n\n" + codeblock + "\n\n" + nextChar;
            });

            // attacklab: strip sentinel
            text = text.replace(/~0/, "");

            return text;
        }

        function _DoCodeSpans(text) {
            //
            // * Backtick quotes are used for <code></code> spans.
            // 
            // * You can use multiple backticks as the delimiters if you want to
            //   include literal backticks in the code span. So, this input:
            //     
            //      Just type ``foo `bar` baz`` at the prompt.
            //     
            //   Will translate to:
            //     
            //      <p>Just type <code>foo `bar` baz</code> at the prompt.</p>
            //     
            //   There's no arbitrary limit to the number of backticks you
            //   can use as delimters. If you need three consecutive backticks
            //   in your code, use four for delimiters, etc.
            //
            // * You can use spaces to get literal backticks at the edges:
            //     
            //      ... type `` `bar` `` ...
            //     
            //   Turns to:
            //     
            //      ... type <code>`bar`</code> ...
            //

            /*
             text = text.replace(/
             (^|[^\\`])      // Character before opening ` can't be a backslash or backtick
             (`+)            // $2 = Opening run of `
             (?!`)           // and no more backticks -- match the full run
             (               // $3 = The code block
             [^\r]*?
             [^`]        // attacklab: work around lack of lookbehind
             )
             \2              // Matching closer
             (?!`)
             /gm, function(){...});
             */

            text = text.replace(/(^|[^\\`])(`+)(?!`)([^\r]*?[^`])\2(?!`)/gm, function (wholeMatch, m1, m2, m3, m4) {
                var c = m3;
                c = c.replace(/^([ \t]*)/g, ""); // leading whitespace
                c = c.replace(/[ \t]*$/g, ""); // trailing whitespace
                c = _EncodeCode(c);
                c = c.replace(/:\/\//g, "~P"); // to prevent auto-linking. Not necessary in code *blocks*, but in code spans. Will be converted back after the auto-linker runs.
                return m1 + "<code>" + c + "</code>";
            });

            return text;
        }

        function _EncodeCode(text) {
            //
            // Encode/escape certain characters inside Markdown code runs.
            // The point is that in code, these characters are literals,
            // and lose their special Markdown meanings.
            //
            // Encode all ampersands; HTML entities are not
            // entities within a Markdown code span.
            text = text.replace(/&/g, "&amp;");

            // Do the angle bracket song and dance:
            text = text.replace(/</g, "&lt;");
            text = text.replace(/>/g, "&gt;");

            // Now, escape characters that are magic in Markdown:
            text = escapeCharacters(text, "\*_{}[]\\", false);

            // jj the line above breaks this:
            //---

            //* Item

            //   1. Subitem

            //            special char: *
            //---

            return text;
        }

        function _DoItalicsAndBoldStrict(text) {

            if (text.indexOf("*") === -1 && text.indexOf("_") === -1) return text;

            text = asciify(text);

            // <strong> must go first:

            // (^|[\W_])           Start with a non-letter or beginning of string. Store in \1.
            // (?:(?!\1)|(?=^))    Either the next character is *not* the same as the previous,
            //                     or we started at the end of the string (in which case the previous
            //                     group had zero width, so we're still there). Because the next
            //                     character is the marker, this means that if there are e.g. multiple
            //                     underscores in a row, we can only match the left-most ones (which
            //                     prevents foo___bar__ from getting bolded)
            // (\*|_)              The marker character itself, asterisk or underscore. Store in \2.
            // \2                  The marker again, since bold needs two.
            // (?=\S)              The first bolded character cannot be a space.
            // ([^\r]*?\S)         The actual bolded string. At least one character, and it cannot *end*
            //                     with a space either. Note that like in many other places, [^\r] is
            //                     just a workaround for JS' lack of single-line regexes; it's equivalent
            //                     to a . in an /s regex, because the string cannot contain any \r (they
            //                     are removed in the normalizing step).
            // \2\2                The marker character, twice -- end of bold.
            // (?!\2)              Not followed by another marker character (ensuring that we match the
            //                     rightmost two in a longer row)...
            // (?=[\W_]|$)         ...but by any other non-word character or the end of string.
            text = text.replace(/(^|[\W_])(?:(?!\1)|(?=^))(\*|_)\2(?=\S)([^\r]*?\S)\2\2(?!\2)(?=[\W_]|$)/g, "$1<strong>$3</strong>");

            // This is almost identical to the <strong> regex, except 1) there's obviously just one marker
            // character, and 2) the italicized string cannot contain the marker character.
            text = text.replace(/(^|[\W_])(?:(?!\1)|(?=^))(\*|_)(?=\S)((?:(?!\2)[^\r])*?\S)\2(?!\2)(?=[\W_]|$)/g, "$1<em>$3</em>");

            return deasciify(text);
        }

        function _DoItalicsAndBold_AllowIntrawordWithAsterisk(text) {

            if (text.indexOf("*") === -1 && text.indexOf("_") === -1) return text;

            text = asciify(text);

            // <strong> must go first:
            // (?=[^\r][*_]|[*_])               Optimization only, to find potentially relevant text portions faster. Minimally slower in Chrome, but much faster in IE.
            // (                                Store in \1. This is the last character before the delimiter
            //     ^                            Either we're at the start of the string (i.e. there is no last character)...
            //     |                            ... or we allow one of the following:
            //     (?=                          (lookahead; we're not capturing this, just listing legal possibilities)
            //         \W__                     If the delimiter is __, then this last character must be non-word non-underscore (extra-word emphasis only)
            //         |
            //         (?!\*)[\W_]\*\*          If the delimiter is **, then this last character can be non-word non-asterisk (extra-word emphasis)...
            //         |
            //         \w\*\*\w                 ...or it can be word/underscore, but only if the first bolded character is such a character as well (intra-word emphasis)
            //     )
            //     [^\r]                        actually capture the character (can't use `.` since it could be \n)
            // )
            // (\*\*|__)                        Store in \2: the actual delimiter
            // (?!\2)                           not followed by the delimiter again (at most one more asterisk/underscore is allowed)
            // (?=\S)                           the first bolded character can't be a space
            // (                                Store in \3: the bolded string
            //                                  
            //     (?:|                         Look at all bolded characters except for the last one. Either that's empty, meaning only a single character was bolded...
            //       [^\r]*?                    ... otherwise take arbitrary characters, minimally matching; that's all bolded characters except for the last *two*
            //       (?!\2)                       the last two characters cannot be the delimiter itself (because that would mean four underscores/asterisks in a row)
            //       [^\r]                        capture the next-to-last bolded character
            //     )
            //     (?=                          lookahead at the very last bolded char and what comes after
            //         \S_                      for underscore-bolding, it can be any non-space
            //         |
            //         \w                       for asterisk-bolding (otherwise the previous alternative would've matched, since \w implies \S), either the last char is word/underscore...
            //         |
            //         \S\*\*(?:[\W_]|$)        ... or it's any other non-space, but in that case the character *after* the delimiter may not be a word character
            //     )
            //     .                            actually capture the last character (can use `.` this time because the lookahead ensures \S in all cases)
            // )
            // (?=                              lookahead; list the legal possibilities for the closing delimiter and its following character
            //     __(?:\W|$)                   for underscore-bolding, the following character (if any) must be non-word non-underscore
            //     |
            //     \*\*(?:[^*]|$)               for asterisk-bolding, any non-asterisk is allowed (note we already ensured above that it's not a word character if the last bolded character wasn't one)
            // )
            // \2                               actually capture the closing delimiter (and make sure that it matches the opening one)

            text = text.replace(/(?=[^\r][*_]|[*_])(^|(?=\W__|(?!\*)[\W_]\*\*|\w\*\*\w)[^\r])(\*\*|__)(?!\2)(?=\S)((?:|[^\r]*?(?!\2)[^\r])(?=\S_|\w|\S\*\*(?:[\W_]|$)).)(?=__(?:\W|$)|\*\*(?:[^*]|$))\2/g, "$1<strong>$3</strong>");

            // now <em>:
            // (?=[^\r][*_]|[*_])               Optimization, see above.
            // (                                Store in \1. This is the last character before the delimiter
            //     ^                            Either we're at the start of the string (i.e. there is no last character)...
            //     |                            ... or we allow one of the following:
            //     (?=                          (lookahead; we're not capturing this, just listing legal possibilities)
            //         \W_                      If the delimiter is _, then this last character must be non-word non-underscore (extra-word emphasis only)
            //         |
            //         (?!\*)                   otherwise, we list two possiblities for * as the delimiter; in either case, the last characters cannot be an asterisk itself
            //         (?:
            //             [\W_]\*              this last character can be non-word (extra-word emphasis)...
            //             |
            //             \D\*(?=\w)\D         ...or it can be word (otherwise the first alternative would've matched), but only if
            //                                      a) the first italicized character is such a character as well (intra-word emphasis), and
            //                                      b) neither character on either side of the asterisk is a digit            
            //         )
            //     )
            //     [^\r]                        actually capture the character (can't use `.` since it could be \n)
            // )
            // (\*|_)                           Store in \2: the actual delimiter
            // (?!\2\2\2)                       not followed by more than two more instances of the delimiter
            // (?=\S)                           the first italicized character can't be a space
            // (                                Store in \3: the italicized string
            //     (?:(?!\2)[^\r])*?            arbitrary characters except for the delimiter itself, minimally matching
            //     (?=                          lookahead at the very last italicized char and what comes after
            //         [^\s_]_                  for underscore-italicizing, it can be any non-space non-underscore
            //         |
            //         (?=\w)\D\*\D             for asterisk-italicizing, either the last char is word/underscore *and* neither character on either side of the asterisk is a digit...
            //         |
            //         [^\s*]\*(?:[\W_]|$)      ... or that last char is any other non-space non-asterisk, but then the character after the delimiter (if any) must be non-word
            //     )
            //     .                            actually capture the last character (can use `.` this time because the lookahead ensures \S in all cases)
            // )
            // (?=                              lookahead; list the legal possibilities for the closing delimiter and its following character
            //     _(?:\W|$)                    for underscore-italicizing, the following character (if any) must be non-word non-underscore
            //     |
            //     \*(?:[^*]|$)                 for asterisk-italicizing, any non-asterisk is allowed; all other restrictions have already been ensured in the previous lookahead
            // )
            // \2                               actually capture the closing delimiter (and make sure that it matches the opening one)

            text = text.replace(/(?=[^\r][*_]|[*_])(^|(?=\W_|(?!\*)(?:[\W_]\*|\D\*(?=\w)\D))[^\r])(\*|_)(?!\2\2\2)(?=\S)((?:(?!\2)[^\r])*?(?=[^\s_]_|(?=\w)\D\*\D|[^\s*]\*(?:[\W_]|$)).)(?=_(?:\W|$)|\*(?:[^*]|$))\2/g, "$1<em>$3</em>");

            return deasciify(text);
        }

        function _DoBlockQuotes(text) {

            /*
             text = text.replace(/
             (                           // Wrap whole match in $1
             (
             ^[ \t]*>[ \t]?      // '>' at the start of a line
             .+\n                // rest of the first line
             (.+\n)*             // subsequent consecutive lines
             \n*                 // blanks
             )+
             )
             /gm, function(){...});
             */

            text = text.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm, function (wholeMatch, m1) {
                var bq = m1;

                // attacklab: hack around Konqueror 3.5.4 bug:
                // "----------bug".replace(/^-/g,"") == "bug"

                bq = bq.replace(/^[ \t]*>[ \t]?/gm, "~0"); // trim one level of quoting

                // attacklab: clean up hack
                bq = bq.replace(/~0/g, "");

                bq = bq.replace(/^[ \t]+$/gm, ""); // trim whitespace-only lines
                bq = _RunBlockGamut(bq); // recurse

                bq = bq.replace(/(^|\n)/g, "$1  ");
                // These leading spaces screw with <pre> content, so we need to fix that:
                bq = bq.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function (wholeMatch, m1) {
                    var pre = m1;
                    // attacklab: hack around Konqueror 3.5.4 bug:
                    pre = pre.replace(/^  /mg, "~0");
                    pre = pre.replace(/~0/g, "");
                    return pre;
                });

                return hashBlock("<blockquote>\n" + bq + "\n</blockquote>");
            });
            return text;
        }

        function _FormParagraphs(text, doNotUnhash, doNotCreateParagraphs) {
            //
            //  Params:
            //    $text - string to process with html <p> tags
            //

            // Strip leading and trailing lines:
            text = text.replace(/^\n+/g, "");
            text = text.replace(/\n+$/g, "");

            var grafs = text.split(/\n{2,}/g);
            var grafsOut = [];

            var markerRe = /~K(\d+)K/;

            //
            // Wrap <p> tags.
            //
            var end = grafs.length;
            for (var i = 0; i < end; i++) {
                var str = grafs[i];

                // if this is an HTML marker, copy it
                if (markerRe.test(str)) {
                    grafsOut.push(str);
                } else if (/\S/.test(str)) {
                    str = _RunSpanGamut(str);
                    str = str.replace(/^([ \t]*)/g, doNotCreateParagraphs ? "" : "<p>");
                    if (!doNotCreateParagraphs) str += "</p>";
                    grafsOut.push(str);
                }
            }
            //
            // Unhashify HTML blocks
            //
            if (!doNotUnhash) {
                end = grafsOut.length;
                for (var i = 0; i < end; i++) {
                    var foundAny = true;
                    while (foundAny) {
                        // we may need several runs, since the data may be nested
                        foundAny = false;
                        grafsOut[i] = grafsOut[i].replace(/~K(\d+)K/g, function (wholeMatch, id) {
                            foundAny = true;
                            return g_html_blocks[id];
                        });
                    }
                }
            }
            return grafsOut.join("\n\n");
        }

        function _EncodeAmpsAndAngles(text) {
            // Smart processing for ampersands and angle brackets that need to be encoded.

            // Ampersand-encoding based entirely on Nat Irons's Amputator MT plugin:
            //   http://bumppo.net/projects/amputator/
            text = text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;");

            // Encode naked <'s
            text = text.replace(/<(?![a-z\/?!]|~D)/gi, "&lt;");

            return text;
        }

        function _EncodeBackslashEscapes(text) {
            //
            //   Parameter:  String.
            //   Returns:    The string, with after processing the following backslash
            //               escape sequences.
            //

            // attacklab: The polite way to do this is with the new
            // escapeCharacters() function:
            //
            //     text = escapeCharacters(text,"\\",true);
            //     text = escapeCharacters(text,"`*_{}[]()>#+-.!",true);
            //
            // ...but we're sidestepping its use of the (slow) RegExp constructor
            // as an optimization for Firefox.  This function gets called a LOT.

            text = text.replace(/\\(\\)/g, escapeCharacters_callback);
            text = text.replace(/\\([`*_{}\[\]()>#+-.!])/g, escapeCharacters_callback);
            return text;
        }

        var charInsideUrl = "[-A-Z0-9+&@#/%?=~_|[\\]()!:,.;]",
            charEndingUrl = "[-A-Z0-9+&@#/%=~_|[\\])]",
            autoLinkRegex = new RegExp("(=\"|<)?\\b(https?|ftp)(://" + charInsideUrl + "*" + charEndingUrl + ")(?=$|\\W)", "gi"),
            endCharRegex = new RegExp(charEndingUrl, "i");

        function handleTrailingParens(wholeMatch, lookbehind, protocol, link) {
            if (lookbehind) return wholeMatch;
            if (link.charAt(link.length - 1) !== ")") return "<" + protocol + link + ">";
            var parens = link.match(/[()]/g);
            var level = 0;
            for (var i = 0; i < parens.length; i++) {
                if (parens[i] === "(") {
                    if (level <= 0) level = 1;else level++;
                } else {
                    level--;
                }
            }
            var tail = "";
            if (level < 0) {
                var re = new RegExp("\\){1," + -level + "}$");
                link = link.replace(re, function (trailingParens) {
                    tail = trailingParens;
                    return "";
                });
            }
            if (tail) {
                var lastChar = link.charAt(link.length - 1);
                if (!endCharRegex.test(lastChar)) {
                    tail = lastChar + tail;
                    link = link.substr(0, link.length - 1);
                }
            }
            return "<" + protocol + link + ">" + tail;
        }

        function _DoAutoLinks(text) {

            // note that at this point, all other URL in the text are already hyperlinked as <a href=""></a>
            // *except* for the <http://www.foo.com> case

            // automatically add < and > around unadorned raw hyperlinks
            // must be preceded by a non-word character (and not by =" or <) and followed by non-word/EOF character
            // simulating the lookbehind in a consuming way is okay here, since a URL can neither and with a " nor
            // with a <, so there is no risk of overlapping matches.
            text = text.replace(autoLinkRegex, handleTrailingParens);

            //  autolink anything like <http://example.com>


            var replacer = function (wholematch, m1) {
                var url = attributeSafeUrl(m1);

                return "<a href=\"" + url + "\">" + pluginHooks.plainLinkText(m1) + "</a>";
            };
            text = text.replace(/<((https?|ftp):[^'">\s]+)>/gi, replacer);

            // Email addresses: <address@domain.foo>
            /*
             text = text.replace(/
             <
             (?:mailto:)?
             (
             [-.\w]+
             \@
             [-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+
             )
             >
             /gi, _DoAutoLinks_callback());
             */

            /* disabling email autolinking, since we don't do that on the server, either
             text = text.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,
             function(wholeMatch,m1) {
             return _EncodeEmailAddress( _UnescapeSpecialChars(m1) );
             }
             );
             */
            return text;
        }

        function _UnescapeSpecialChars(text) {
            //
            // Swap back in all the special characters we've hidden.
            //
            text = text.replace(/~E(\d+)E/g, function (wholeMatch, m1) {
                var charCodeToReplace = parseInt(m1);
                return String.fromCharCode(charCodeToReplace);
            });
            return text;
        }

        function _Outdent(text) {
            //
            // Remove one level of line-leading tabs or spaces
            //

            // attacklab: hack around Konqueror 3.5.4 bug:
            // "----------bug".replace(/^-/g,"") == "bug"

            text = text.replace(/^(\t|[ ]{1,4})/gm, "~0"); // attacklab: g_tab_width

            // attacklab: clean up hack
            text = text.replace(/~0/g, "");

            return text;
        }

        function _Detab(text) {
            if (!/\t/.test(text)) return text;

            var spaces = ["    ", "   ", "  ", " "],
                skew = 0,
                v;

            return text.replace(/[\n\t]/g, function (match, offset) {
                if (match === "\n") {
                    skew = offset + 1;
                    return match;
                }
                v = (offset - skew) % 4;
                skew = offset + 1;
                return spaces[v];
            });
        }

        //
        //  attacklab: Utility functions
        //

        function attributeSafeUrl(url) {
            url = attributeEncode(url);
            url = escapeCharacters(url, "*_:()[]");
            return url;
        }

        function escapeCharacters(text, charsToEscape, afterBackslash) {
            // First we have to escape the escape characters so that
            // we can build a character class out of them
            var regexString = "([" + charsToEscape.replace(/([\[\]\\])/g, "\\$1") + "])";

            if (afterBackslash) {
                regexString = "\\\\" + regexString;
            }

            var regex = new RegExp(regexString, "g");
            text = text.replace(regex, escapeCharacters_callback);

            return text;
        }

        function escapeCharacters_callback(wholeMatch, m1) {
            var charCodeToEscape = m1.charCodeAt(0);
            return "~E" + charCodeToEscape + "E";
        }
    }; // end of the Markdown.Converter constructor
})();
module.exports = Markdown;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// needs Markdown.Converter.js at the moment

module.exports = function (Markdown) {
    var util = {},
        position = {},
        ui = {},
        doc = window.document,
        re = window.RegExp,
        nav = window.navigator,
        SETTINGS = {
        lineLength: 72
    },


    // Used to work around some browser bugs where we can't use feature testing.
    uaSniffed = {
        isIE: /msie/.test(nav.userAgent.toLowerCase()),
        isIE_5or6: /msie 6/.test(nav.userAgent.toLowerCase()) || /msie 5/.test(nav.userAgent.toLowerCase()),
        isOpera: /opera/.test(nav.userAgent.toLowerCase())
    };

    var defaultsStrings = {
        bold: "加粗 <strong> Ctrl+B",
        boldexample: '加粗文字',

        italic: "斜体 <em> Ctrl+I",
        italicexample: '斜体文字',

        link: "链接 <a> Ctrl+L",
        linkdescription: '链接描述',
        linkdialog: '<input type="text" id="editorLinkText" class="form-control text-28" placeholder="请输入链接地址">',

        quote: "引用 <blockquote> Ctrl+Q",
        quoteexample: "引用文字",

        code: "代码 <pre><code> Ctrl+K",
        codeexample: '请输入代码',

        image: "图片 <img> Ctrl+G",
        imagedescription: "图片描述",
        imagedialog: '<ul class="nav nav-tabs" role="tablist"><li class="active"><a href="#localPic" role="tab" data-toggle="tab">本地上传</a></li>    <li><a href="#remotePic" role="tab" data-toggle="tab">远程地址获取</a></li></ul><div class="tab-content">    <div class="tab-pane fade active in pt20 form-horizontal" id="localPic">        <span class="text-muted">图片体积不得大于 4 MB</span>        <br>        <div class="widget-upload form-group">        <input type="file" id="editorUpload" name="image" class="widget-upload__file">        <div class="col-sm-8">        <input type="text" id="fileName" class="form-control col-sm-10 widget-upload__text" placeholder="拖动图片到这里" readonly="">        </div>        <a href="javascript:void(0);" class="btn col-sm-2 btn-default">选择图片</a>        </div>    </div>    <div class="tab-pane fade pt20" id="remotePic">    <input type="url" name="img" id="remotePicUrl" class="form-control text-28" placeholder="请输入图片所在网址">    </div></div>',

        olist: "数字列表 <ol> Ctrl+O",
        ulist: "普通列表 <ul> Ctrl+U",
        litem: "列表项目",

        heading: "标题 <h1>/<h2> Ctrl+H",
        headingexample: "标题文字",

        hr: "分割线 <hr> Ctrl+R",

        undo: "撤销 - Ctrl+Z",
        redo: "重做 - Ctrl+Y",
        redomac: "重做 - Ctrl+Shift+Z",
        zen: '全屏',

        help: "Markdown 语法"
    };

    // -------------------------------------------------------------------
    //  YOUR CHANGES GO HERE
    //
    // I've tried to localize the things you are likely to change to
    // this area.
    // -------------------------------------------------------------------

    // The default text that appears in the dialog input box when entering
    // links.
    var imageDefaultText = "http://";
    var linkDefaultText = "http://";

    // -------------------------------------------------------------------
    //  END OF YOUR CHANGES
    // -------------------------------------------------------------------

    // options, if given, can have the following properties:
    //   options.helpButton = { handler: yourEventHandler }
    //   options.strings = { italicexample: "slanted text" }
    // `yourEventHandler` is the click handler for the help button.
    // If `options.helpButton` isn't given, not help button is created.
    // `options.strings` can have any or all of the same properties as
    // `defaultStrings` above, so you can just override some string displayed
    // to the user on a case-by-case basis, or translate all strings to
    // a different language.
    //
    // For backwards compatibility reasons, the `options` argument can also
    // be just the `helpButton` object, and `strings.help` can also be set via
    // `helpButton.title`. This should be considered legacy.
    //
    // The constructed editor object has the methods:
    // - getConverter() returns the markdown converter object that was passed to the constructor
    // - run() actually starts the editor; should be called after all necessary plugins are registered. Calling this more than once is a no-op.
    // - refreshPreview() forces the preview to be updated. This method is only available after run() was called.
    Markdown.Editor = function (markdownConverter, idPostfix, options) {

        options = options || {};

        if (typeof options.handler === "function") {
            //backwards compatible behavior
            options = {
                helpButton: options
            };
        }
        options.strings = options.strings || {};
        if (options.helpButton) {
            options.strings.help = options.strings.help || options.helpButton.title;
        }
        var getString = function (identifier) {
            return options.strings[identifier] || defaultsStrings[identifier];
        };

        idPostfix = idPostfix || "";

        var hooks = this.hooks = new Markdown.HookCollection();
        hooks.addNoop("onPreviewRefresh"); // called with no arguments after the preview has been refreshed
        hooks.addNoop("postBlockquoteCreation"); // called with the user's selection *after* the blockquote was created; should return the actual to-be-inserted text
        hooks.addFalse("insertImageDialog");
        /* called with one parameter: a callback to be called with the URL of the image. If the application creates
         * its own image insertion dialog, this hook should return true, and the callback should be called with the chosen
         * image url (or null if the user cancelled). If this hook returns false, the default dialog will be used.
         */

        this.getConverter = function () {
            return markdownConverter;
        };

        var that = this,
            panels;

        this.run = function (inputId) {
            if (panels) return; // already initialized

            panels = new PanelCollection(idPostfix, inputId);
            var commandManager = new CommandManager(hooks, getString);
            var previewManager = new PreviewManager(markdownConverter, panels, function () {
                hooks.onPreviewRefresh();
            });
            var undoManager, uiManager;

            if (!/\?noundo/.test(doc.location.href)) {
                undoManager = new UndoManager(function () {
                    previewManager.refresh();
                    if (uiManager) // not available on the first call
                        uiManager.setUndoRedoButtonStates();
                }, panels);
                this.textOperation = function (f) {
                    undoManager.setCommandMode();
                    f();
                    that.refreshPreview();
                };
            }

            uiManager = new UIManager(idPostfix, panels, undoManager, previewManager, commandManager, options.helpButton, getString);
            uiManager.setUndoRedoButtonStates();

            var forceRefresh = that.refreshPreview = function () {
                previewManager.refresh(true);
            };

            forceRefresh();
        };
    };

    // before: contains all the text in the input box BEFORE the selection.
    // after: contains all the text in the input box AFTER the selection.
    function Chunks() {}

    // startRegex: a regular expression to find the start tag
    // endRegex: a regular expresssion to find the end tag
    Chunks.prototype.findTags = function (startRegex, endRegex) {

        var chunkObj = this;
        var regex;

        if (startRegex) {

            regex = util.extendRegExp(startRegex, "", "$");

            this.before = this.before.replace(regex, function (match) {
                chunkObj.startTag = chunkObj.startTag + match;
                return "";
            });

            regex = util.extendRegExp(startRegex, "^", "");

            this.selection = this.selection.replace(regex, function (match) {
                chunkObj.startTag = chunkObj.startTag + match;
                return "";
            });
        }

        if (endRegex) {

            regex = util.extendRegExp(endRegex, "", "$");

            this.selection = this.selection.replace(regex, function (match) {
                chunkObj.endTag = match + chunkObj.endTag;
                return "";
            });

            regex = util.extendRegExp(endRegex, "^", "");

            this.after = this.after.replace(regex, function (match) {
                chunkObj.endTag = match + chunkObj.endTag;
                return "";
            });
        }
    };

    // If remove is false, the whitespace is transferred
    // to the before/after regions.
    //
    // If remove is true, the whitespace disappears.
    Chunks.prototype.trimWhitespace = function (remove) {
        var beforeReplacer,
            afterReplacer,
            that = this;
        if (remove) {
            beforeReplacer = afterReplacer = "";
        } else {
            beforeReplacer = function (s) {
                that.before += s;
                return "";
            };
            afterReplacer = function (s) {
                that.after = s + that.after;
                return "";
            };
        }

        this.selection = this.selection.replace(/^(\s*)/, beforeReplacer).replace(/(\s*)$/, afterReplacer);
    };

    Chunks.prototype.skipLines = function (nLinesBefore, nLinesAfter, findExtraNewlines) {

        if (nLinesBefore === undefined) {
            nLinesBefore = 1;
        }

        if (nLinesAfter === undefined) {
            nLinesAfter = 1;
        }

        nLinesBefore++;
        nLinesAfter++;

        var regexText;
        var replacementText;

        // chrome bug ... documented at: http://meta.stackoverflow.com/questions/63307/blockquote-glitch-in-editor-in-chrome-6-and-7/65985#65985
        if (navigator.userAgent.match(/Chrome/)) {
            "X".match(/()./);
        }

        this.selection = this.selection.replace(/(^\n*)/, "");

        this.startTag = this.startTag + re.$1;

        this.selection = this.selection.replace(/(\n*$)/, "");
        this.endTag = this.endTag + re.$1;
        this.startTag = this.startTag.replace(/(^\n*)/, "");
        this.before = this.before + re.$1;
        this.endTag = this.endTag.replace(/(\n*$)/, "");
        this.after = this.after + re.$1;

        if (this.before) {

            regexText = replacementText = "";

            while (nLinesBefore--) {
                regexText += "\\n?";
                replacementText += "\n";
            }

            if (findExtraNewlines) {
                regexText = "\\n*";
            }
            this.before = this.before.replace(new re(regexText + "$", ""), replacementText);
        }

        if (this.after) {

            regexText = replacementText = "";

            while (nLinesAfter--) {
                regexText += "\\n?";
                replacementText += "\n";
            }
            if (findExtraNewlines) {
                regexText = "\\n*";
            }

            this.after = this.after.replace(new re(regexText, ""), replacementText);
        }
    };

    // end of Chunks

    // A collection of the important regions on the page.
    // Cached so we don't have to keep traversing the DOM.
    // Also holds ieCachedRange and ieCachedScrollTop, where necessary; working around
    // this issue:
    // Internet explorer has problems with CSS sprite buttons that use HTML
    // lists.  When you click on the background image "button", IE will
    // select the non-existent link text and discard the selection in the
    // textarea.  The solution to this is to cache the textarea selection
    // on the button's mousedown event and set a flag.  In the part of the
    // code where we need to grab the selection, we check for the flag
    // and, if it's set, use the cached area instead of querying the
    // textarea.
    //
    // This ONLY affects Internet Explorer (tested on versions 6, 7
    // and 8) and ONLY on button clicks.  Keyboard shortcuts work
    // normally since the focus never leaves the textarea.
    function PanelCollection(postfix, inputId) {
        inputId = inputId || 'wmd-input';
        this.buttonBar = doc.getElementById("wmd-button-bar" + postfix);
        this.preview = doc.getElementById("wmd-preview" + postfix);
        this.input = doc.getElementById(inputId + postfix);
    };

    // Returns true if the DOM element is visible, false if it's hidden.
    // Checks if display is anything other than none.
    util.isVisible = function (elem) {

        if (window.getComputedStyle) {
            // Most browsers
            return window.getComputedStyle(elem, null).getPropertyValue("display") !== "none";
        } else if (elem.currentStyle) {
            // IE
            return elem.currentStyle["display"] !== "none";
        }
    };

    // Adds a listener callback to a DOM element which is fired on a specified
    // event.
    util.addEvent = function (elem, event, listener) {
        if (elem.attachEvent) {
            // IE only.  The "on" is mandatory.
            elem.attachEvent("on" + event, listener);
        } else {
            // Other browsers.
            elem.addEventListener(event, listener, false);
        }
    };

    // Removes a listener callback from a DOM element which is fired on a specified
    // event.
    util.removeEvent = function (elem, event, listener) {
        if (elem.detachEvent) {
            // IE only.  The "on" is mandatory.
            elem.detachEvent("on" + event, listener);
        } else {
            // Other browsers.
            elem.removeEventListener(event, listener, false);
        }
    };

    // Converts \r\n and \r to \n.
    util.fixEolChars = function (text) {
        text = text.replace(/\r\n/g, "\n");
        text = text.replace(/\r/g, "\n");
        return text;
    };

    // Extends a regular expression.  Returns a new RegExp
    // using pre + regex + post as the expression.
    // Used in a few functions where we have a base
    // expression and we want to pre- or append some
    // conditions to it (e.g. adding "$" to the end).
    // The flags are unchanged.
    //
    // regex is a RegExp, pre and post are strings.
    util.extendRegExp = function (regex, pre, post) {

        if (pre === null || pre === undefined) {
            pre = "";
        }
        if (post === null || post === undefined) {
            post = "";
        }

        var pattern = regex.toString();
        var flags;

        // Replace the flags with empty space and store them.
        pattern = pattern.replace(/\/([gim]*)$/, function (wholeMatch, flagsPart) {
            flags = flagsPart;
            return "";
        });

        // Remove the slash delimiters on the regular expression.
        pattern = pattern.replace(/(^\/|\/$)/g, "");
        pattern = pre + pattern + post;

        return new re(pattern, flags);
    };

    // UNFINISHED
    // The assignment in the while loop makes jslint cranky.
    // I'll change it to a better loop later.
    position.getTop = function (elem, isInner) {
        var result = elem.offsetTop;
        if (!isInner) {
            while (elem = elem.offsetParent) {
                result += elem.offsetTop;
            }
        }
        return result;
    };

    position.getHeight = function (elem) {
        return elem.offsetHeight || elem.scrollHeight;
    };

    position.getWidth = function (elem) {
        return elem.offsetWidth || elem.scrollWidth;
    };

    position.getPageSize = function () {

        var scrollWidth, scrollHeight;
        var innerWidth, innerHeight;

        // It's not very clear which blocks work with which browsers.
        if (self.innerHeight && self.scrollMaxY) {
            scrollWidth = doc.body.scrollWidth;
            scrollHeight = self.innerHeight + self.scrollMaxY;
        } else if (doc.body.scrollHeight > doc.body.offsetHeight) {
            scrollWidth = doc.body.scrollWidth;
            scrollHeight = doc.body.scrollHeight;
        } else {
            scrollWidth = doc.body.offsetWidth;
            scrollHeight = doc.body.offsetHeight;
        }

        if (self.innerHeight) {
            // Non-IE browser
            innerWidth = self.innerWidth;
            innerHeight = self.innerHeight;
        } else if (doc.documentElement && doc.documentElement.clientHeight) {
            // Some versions of IE (IE 6 w/ a DOCTYPE declaration)
            innerWidth = doc.documentElement.clientWidth;
            innerHeight = doc.documentElement.clientHeight;
        } else if (doc.body) {
            // Other versions of IE
            innerWidth = doc.body.clientWidth;
            innerHeight = doc.body.clientHeight;
        }

        var maxWidth = Math.max(scrollWidth, innerWidth);
        var maxHeight = Math.max(scrollHeight, innerHeight);
        return [maxWidth, maxHeight, innerWidth, innerHeight];
    };

    // Handles pushing and popping TextareaStates for undo/redo commands.
    // I should rename the stack variables to list.
    function UndoManager(callback, panels) {

        var undoObj = this;
        var undoStack = []; // A stack of undo states
        var stackPtr = 0; // The index of the current state
        var mode = "none";
        var lastState; // The last state
        var timer; // The setTimeout handle for cancelling the timer
        var inputStateObj;

        // Set the mode for later logic steps.
        var setMode = function (newMode, noSave) {
            if (mode != newMode) {
                mode = newMode;
                if (!noSave) {
                    saveState();
                }
            }

            if (!uaSniffed.isIE || mode != "moving") {
                timer = setTimeout(refreshState, 1);
            } else {
                inputStateObj = null;
            }
        };

        var refreshState = function (isInitialState) {
            inputStateObj = new TextareaState(panels, isInitialState);
            timer = undefined;
        };

        this.setCommandMode = function () {
            mode = "command";
            saveState();
            timer = setTimeout(refreshState, 0);
        };

        this.canUndo = function () {
            return stackPtr > 1;
        };

        this.canRedo = function () {
            if (undoStack[stackPtr + 1]) {
                return true;
            }
            return false;
        };

        // Removes the last state and restores it.
        this.undo = function () {

            if (undoObj.canUndo()) {
                if (lastState) {
                    // What about setting state -1 to null or checking for undefined?
                    lastState.restore();
                    lastState = null;
                } else {
                    undoStack[stackPtr] = new TextareaState(panels);
                    undoStack[--stackPtr].restore();

                    if (callback) {
                        callback();
                    }
                }
            }

            mode = "none";
            panels.input.focus();
            refreshState();
        };

        // Redo an action.
        this.redo = function () {

            if (undoObj.canRedo()) {

                undoStack[++stackPtr].restore();

                if (callback) {
                    callback();
                }
            }

            mode = "none";
            panels.input.focus();
            refreshState();
        };

        // Push the input area state to the stack.
        var saveState = function () {
            var currState = inputStateObj || new TextareaState(panels);

            if (!currState) {
                return false;
            }
            if (mode == "moving") {
                if (!lastState) {
                    lastState = currState;
                }
                return;
            }
            if (lastState) {
                if (undoStack[stackPtr - 1].text != lastState.text) {
                    undoStack[stackPtr++] = lastState;
                }
                lastState = null;
            }
            undoStack[stackPtr++] = currState;
            undoStack[stackPtr + 1] = null;
            if (callback) {
                callback();
            }
        };

        var handleCtrlYZ = function (event) {

            var handled = false;

            if ((event.ctrlKey || event.metaKey) && !event.altKey) {

                // IE and Opera do not support charCode.
                var keyCode = event.charCode || event.keyCode;
                var keyCodeChar = String.fromCharCode(keyCode);

                switch (keyCodeChar.toLowerCase()) {

                    case "y":
                        undoObj.redo();
                        handled = true;
                        break;

                    case "z":
                        if (!event.shiftKey) {
                            undoObj.undo();
                        } else {
                            undoObj.redo();
                        }
                        handled = true;
                        break;
                }
            }

            if (handled) {
                if (event.preventDefault) {
                    event.preventDefault();
                }
                if (window.event) {
                    window.event.returnValue = false;
                }
                return;
            }
        };

        // Set the mode depending on what is going on in the input area.
        var handleModeChange = function (event) {

            if (!event.ctrlKey && !event.metaKey) {

                var keyCode = event.keyCode;

                if (keyCode >= 33 && keyCode <= 40 || keyCode >= 63232 && keyCode <= 63235) {
                    // 33 - 40: page up/dn and arrow keys
                    // 63232 - 63235: page up/dn and arrow keys on safari
                    setMode("moving");
                } else if (keyCode == 8 || keyCode == 46 || keyCode == 127) {
                    // 8: backspace
                    // 46: delete
                    // 127: delete
                    setMode("deleting");
                } else if (keyCode == 13) {
                    // 13: Enter
                    setMode("newlines");
                } else if (keyCode == 27) {
                    // 27: escape
                    setMode("escape");
                } else if ((keyCode < 16 || keyCode > 20 || keyCode === 9) && keyCode != 91) {
                    // 16-20 are shift, etc. 9: tab.
                    // 91: left window key
                    // I think this might be a little messed up since there are
                    // a lot of nonprinting keys above 20.
                    setMode("typing");
                }
            }
        };

        var setEventHandlers = function () {
            util.addEvent(panels.input, "keypress", function (event) {
                // keyCode 89: y
                // keyCode 90: z
                if ((event.ctrlKey || event.metaKey) && !event.altKey && (event.keyCode == 89 || event.keyCode == 90)) {
                    event.preventDefault();
                }
            });

            var handlePaste = function () {
                if (uaSniffed.isIE || inputStateObj && inputStateObj.text != panels.input.value) {
                    if (timer == undefined) {
                        mode = "paste";
                        saveState();
                        refreshState();
                    }
                }
            };

            util.addEvent(panels.input, "keydown", handleCtrlYZ);
            util.addEvent(panels.input, "keydown", handleModeChange);
            util.addEvent(panels.input, "mousedown", function () {
                setMode("moving");
            });

            panels.input.onpaste = handlePaste;
            panels.input.ondrop = handlePaste;
        };

        var init = function () {
            setEventHandlers();
            refreshState(true);
            saveState();
        };

        init();
    }

    // end of UndoManager

    // The input textarea state/contents.
    // This is used to implement undo/redo by the undo manager.
    function TextareaState(panels, isInitialState) {

        // Aliases
        var stateObj = this;
        var inputArea = panels.input;
        this.init = function () {
            if (!util.isVisible(inputArea)) {
                return;
            }
            if (!isInitialState && doc.activeElement && doc.activeElement !== inputArea) {
                // this happens when tabbing out of the input box
                return;
            }

            this.setInputAreaSelectionStartEnd();
            this.scrollTop = inputArea.scrollTop;
            if (!this.text && inputArea.selectionStart || inputArea.selectionStart === 0) {
                this.text = inputArea.value;
            }
        };

        // Sets the selected text in the input box after we've performed an
        // operation.
        this.setInputAreaSelection = function () {

            if (!util.isVisible(inputArea)) {
                return;
            }

            if (inputArea.selectionStart !== undefined && !uaSniffed.isOpera) {

                inputArea.focus();
                inputArea.selectionStart = stateObj.start;
                inputArea.selectionEnd = stateObj.end;
                inputArea.scrollTop = stateObj.scrollTop;
            } else if (doc.selection) {

                if (doc.activeElement && doc.activeElement !== inputArea) {
                    return;
                }

                inputArea.focus();
                var range = inputArea.createTextRange();
                range.moveStart("character", -inputArea.value.length);
                range.moveEnd("character", -inputArea.value.length);
                range.moveEnd("character", stateObj.end);
                range.moveStart("character", stateObj.start);
                range.select();
            }
        };

        this.setInputAreaSelectionStartEnd = function () {

            if (!panels.ieCachedRange && (inputArea.selectionStart || inputArea.selectionStart === 0)) {

                stateObj.start = inputArea.selectionStart;
                stateObj.end = inputArea.selectionEnd;
            } else if (doc.selection) {

                stateObj.text = util.fixEolChars(inputArea.value);

                // IE loses the selection in the textarea when buttons are
                // clicked.  On IE we cache the selection. Here, if something is cached,
                // we take it.
                var range = panels.ieCachedRange || doc.selection.createRange();

                var fixedRange = util.fixEolChars(range.text);
                var marker = "\x07";
                var markedRange = marker + fixedRange + marker;
                range.text = markedRange;
                var inputText = util.fixEolChars(inputArea.value);

                range.moveStart("character", -markedRange.length);
                range.text = fixedRange;

                stateObj.start = inputText.indexOf(marker);
                stateObj.end = inputText.lastIndexOf(marker) - marker.length;

                var len = stateObj.text.length - util.fixEolChars(inputArea.value).length;

                if (len) {
                    range.moveStart("character", -fixedRange.length);
                    while (len--) {
                        fixedRange += "\n";
                        stateObj.end += 1;
                    }
                    range.text = fixedRange;
                }

                if (panels.ieCachedRange) stateObj.scrollTop = panels.ieCachedScrollTop; // this is set alongside with ieCachedRange

                panels.ieCachedRange = null;

                this.setInputAreaSelection();
            }
        };

        // Restore this state into the input area.
        this.restore = function () {

            if (stateObj.text != undefined && stateObj.text != inputArea.value) {
                inputArea.value = stateObj.text;
            }
            this.setInputAreaSelection();
            inputArea.scrollTop = stateObj.scrollTop;
        };

        // Gets a collection of HTML chunks from the inptut textarea.
        this.getChunks = function () {

            var chunk = new Chunks();
            chunk.before = util.fixEolChars(stateObj.text.substring(0, stateObj.start));
            chunk.startTag = "";
            chunk.selection = util.fixEolChars(stateObj.text.substring(stateObj.start, stateObj.end));
            chunk.endTag = "";
            chunk.after = util.fixEolChars(stateObj.text.substring(stateObj.end));
            chunk.scrollTop = stateObj.scrollTop;

            return chunk;
        };

        // Sets the TextareaState properties given a chunk of markdown.
        this.setChunks = function (chunk) {

            chunk.before = chunk.before + chunk.startTag;
            chunk.after = chunk.endTag + chunk.after;

            this.start = chunk.before.length;
            this.end = chunk.before.length + chunk.selection.length;
            this.text = chunk.before + chunk.selection + chunk.after;
            this.scrollTop = chunk.scrollTop;
        };
        this.init();
    };

    function PreviewManager(converter, panels, previewRefreshCallback) {

        var managerObj = this;
        var timeout;
        var elapsedTime;
        var oldInputText;
        var maxDelay = 3000;
        var startType = "delayed"; // The other legal value is "manual"

        // Adds event listeners to elements
        var setupEvents = function (inputElem, listener) {

            util.addEvent(inputElem, "input", listener);
            inputElem.onpaste = listener;
            inputElem.ondrop = listener;

            util.addEvent(inputElem, "keypress", listener);
            util.addEvent(inputElem, "keydown", listener);
        };

        var getDocScrollTop = function () {

            var result = 0;

            if (window.innerHeight) {
                result = window.pageYOffset;
            } else if (doc.documentElement && doc.documentElement.scrollTop) {
                result = doc.documentElement.scrollTop;
            } else if (doc.body) {
                result = doc.body.scrollTop;
            }

            return result;
        };

        var makePreviewHtml = function () {

            // If there is no registered preview panel
            // there is nothing to do.
            if (!panels.preview) return;

            var text = panels.input.value;
            if (text && text == oldInputText) {
                return; // Input text hasn't changed.
            } else {
                oldInputText = text;
            }

            var prevTime = new Date().getTime();

            text = converter.makeHtml(text);

            // Calculate the processing time of the HTML creation.
            // It's used as the delay time in the event listener.
            var currTime = new Date().getTime();
            elapsedTime = currTime - prevTime;

            pushPreviewHtml(text);
        };

        // setTimeout is already used.  Used as an event listener.
        var applyTimeout = function () {

            if (timeout) {
                clearTimeout(timeout);
                timeout = undefined;
            }

            if (startType !== "manual") {

                var delay = 0;

                if (startType === "delayed") {
                    delay = elapsedTime;
                }

                if (delay > maxDelay) {
                    delay = maxDelay;
                }
                timeout = setTimeout(makePreviewHtml, delay);
            }
        };

        var getScaleFactor = function (panel) {
            if (panel.scrollHeight <= panel.clientHeight) {
                return 1;
            }
            return panel.scrollTop / (panel.scrollHeight - panel.clientHeight);
        };

        var setPanelScrollTops = function () {
            if (panels.preview) {
                panels.preview.scrollTop = (panels.preview.scrollHeight - panels.preview.clientHeight) * getScaleFactor(panels.preview);
            }
        };

        this.refresh = function (requiresRefresh) {

            if (requiresRefresh) {
                oldInputText = "";
                makePreviewHtml();
            } else {
                applyTimeout();
            }
        };

        this.processingTime = function () {
            return elapsedTime;
        };

        var isFirstTimeFilled = true;

        // IE doesn't let you use innerHTML if the element is contained somewhere in a table
        // (which is the case for inline editing) -- in that case, detach the element, set the
        // value, and reattach. Yes, that *is* ridiculous.
        var ieSafePreviewSet = function (text) {
            var preview = panels.preview;
            var parent = preview.parentNode;
            var sibling = preview.nextSibling;
            parent.removeChild(preview);
            preview.innerHTML = text;
            if (!sibling) parent.appendChild(preview);else parent.insertBefore(preview, sibling);
        };

        var nonSuckyBrowserPreviewSet = function (text) {
            panels.preview.innerHTML = text;
        };

        var previewSetter;

        var previewSet = function (text) {
            if (previewSetter) return previewSetter(text);

            try {
                nonSuckyBrowserPreviewSet(text);
                previewSetter = nonSuckyBrowserPreviewSet;
            } catch (e) {
                previewSetter = ieSafePreviewSet;
                previewSetter(text);
            }
        };

        var pushPreviewHtml = function (text) {

            var emptyTop = position.getTop(panels.input) - getDocScrollTop();

            if (panels.preview) {
                previewSet(text);
                previewRefreshCallback();
            }

            setPanelScrollTops();

            if (isFirstTimeFilled) {
                isFirstTimeFilled = false;
                return;
            }

            var fullTop = position.getTop(panels.input) - getDocScrollTop();

            if (uaSniffed.isIE) {
                setTimeout(function () {
                    window.scrollBy(0, fullTop - emptyTop);
                }, 0);
            } else {
                window.scrollBy(0, fullTop - emptyTop);
            }
        };

        var init = function () {

            setupEvents(panels.input, applyTimeout);
            makePreviewHtml();

            if (panels.preview) {
                panels.preview.scrollTop = 0;
            }
        };

        init();
    };

    // Creates the background behind the hyperlink text entry box.
    // And download dialog
    // Most of this has been moved to CSS but the div creation and
    // browser-specific hacks remain here.
    ui.createBackground = function () {

        var background = doc.createElement("div"),
            style = background.style;

        background.className = "modal-backdrop wmd-prompt-background";

        style.position = "absolute";
        style.top = "0";

        style.zIndex = "1000";

        if (uaSniffed.isIE) {
            style.filter = "alpha(opacity=50)";
        } else {
            style.opacity = "0.5";
        }

        var pageSize = position.getPageSize();
        style.height = pageSize[1] + "px";

        if (uaSniffed.isIE) {
            style.left = doc.documentElement.scrollLeft;
            style.width = doc.documentElement.clientWidth;
        } else {
            style.left = "0";
            style.width = "100%";
        }

        doc.body.appendChild(background);
        return background;
    };

    // This simulates a modal dialog box and asks for the URL when you
    // click the hyperlink or image buttons.
    //
    // text: The html for the input box.
    // defaultInputText: The default value that appears in the input box.
    // callback: The function which is executed when the prompt is dismissed, either via OK or Cancel.
    //      It receives a single argument; either the entered text (if OK was chosen) or null (if Cancel
    //      was chosen).
    ui.prompt = function (_title, text, defaultInputText, callback) {

        // These variables need to be declared at this level since they are used
        // in multiple functions.
        var dialog; // The dialog box.
        var input; // The text box where you enter the hyperlink.


        if (defaultInputText === undefined) {
            defaultInputText = "";
        }

        // Used as a keydown event handler. Esc dismisses the prompt.
        // Key code 27 is ESC.
        var checkEscape = function (key) {
            var code = key.charCode || key.keyCode;
            if (code === 27) {
                close(true);
            }
        };

        // Dismisses the hyperlink input box.
        // isCancel is true if we don't care about the input text.
        // isCancel is false if we are going to keep the text.
        var close = function (isCancel) {
            util.removeEvent(doc.body, "keydown", checkEscape);
            var text = input.value;

            if (isCancel) {
                text = null;
            } else {
                // Fixes common pasting errors.
                text = text.replace(/^http:\/\/(https?|ftp):\/\//, '$1://');
                if (!/^(?:https?|ftp):\/\//.test(text)) text = 'http://' + text;
            }

            dialog.parentNode.removeChild(dialog);

            callback(text);
            return false;
        };

        // Create the text input box form/window.
        var createDialog = function () {

            // The main dialog box.
            dialog = doc.createElement("div");
            dialog.className = "modal-content wmd-prompt-dialog";
            dialog.style.padding = "10px;";
            dialog.style.position = "fixed";
            dialog.style.width = "600px";
            dialog.style.zIndex = "1001";

            // The dialog title.
            var title = doc.createElement("div");
            title.className = 'modal-header';
            title.innerHTML = '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><h4 class="ml20">' + _title + '</h4>';
            dialog.appendChild(title);

            // The dialog text.
            var question = doc.createElement("div");
            question.innerHTML = text;
            question.style.padding = "5px";
            question.style.margin = '20px';
            dialog.appendChild(question);

            // The web form container for the text box and buttons.
            var form = doc.createElement("form"),
                style = form.style;
            form.onsubmit = function () {
                return close(false);
            };
            style.padding = "0";
            style.margin = "0 0 20px";
            style.cssFloat = "left";
            style.width = "100%";
            style.textAlign = "center";
            style.position = "relative";
            dialog.appendChild(form);

            // The input text box
            input = doc.createElement("input");
            input.className = "form-control text-28";
            input.type = "text";
            input.value = defaultInputText;
            style = input.style;
            style.display = "block";
            style.width = "80%";
            style.marginLeft = style.marginRight = "auto";
            form.appendChild(input);

            // The ok button
            var okButton = doc.createElement("input");
            okButton.className = 'btn btn-primary';
            okButton.type = "button";
            okButton.onclick = function () {
                return close(false);
            };
            okButton.value = "确定";
            style = okButton.style;
            style.margin = "10px";
            style.display = "inline";
            style.width = "7em";

            // The cancel button
            var cancelButton = doc.createElement("input");
            cancelButton.className = 'btn btn-default';
            cancelButton.type = "button";
            cancelButton.onclick = function () {
                return close(true);
            };
            cancelButton.value = "取消";
            style = cancelButton.style;
            style.margin = "10px";
            style.display = "inline";
            style.width = "7em";

            form.appendChild(okButton);
            form.appendChild(cancelButton);

            util.addEvent(doc.body, "keydown", checkEscape);
            dialog.style.top = "50%";
            dialog.style.left = "50%";
            dialog.style.display = "block";
            if (uaSniffed.isIE_5or6) {
                dialog.style.position = "absolute";
                dialog.style.top = doc.documentElement.scrollTop + 200 + "px";
                dialog.style.left = "50%";
            }
            doc.body.appendChild(dialog);

            // This has to be done AFTER adding the dialog to the form if you
            // want it to be centered.
            dialog.style.marginTop = -(position.getHeight(dialog) / 2) + "px";
            dialog.style.marginLeft = -(position.getWidth(dialog) / 2) + "px";
        };

        // Why is this in a zero-length timeout?
        // Is it working around a browser bug?
        setTimeout(function () {

            createDialog();

            var defTextLen = defaultInputText.length;
            if (input.selectionStart !== undefined) {
                input.selectionStart = 0;
                input.selectionEnd = defTextLen;
            } else if (input.createTextRange) {
                var range = input.createTextRange();
                range.collapse(false);
                range.moveStart("character", -defTextLen);
                range.moveEnd("character", defTextLen);
                range.select();
            }

            input.focus();
        }, 0);
    };

    function UIManager(postfix, panels, undoManager, previewManager, commandManager, helpOptions, getString) {

        var inputBox = panels.input,
            buttons = {}; // buttons.undo, buttons.link, etc. The actual DOM elements.

        makeSpritedButtonRow();

        var keyEvent = "keydown";
        if (uaSniffed.isOpera) {
            keyEvent = "keypress";
        }

        util.addEvent(inputBox, keyEvent, function (key) {

            // Check to see if we have a button key and, if so execute the callback.
            if ((key.ctrlKey || key.metaKey) && !key.altKey && !key.shiftKey) {

                var keyCode = key.charCode || key.keyCode;
                var keyCodeStr = String.fromCharCode(keyCode).toLowerCase();

                switch (keyCodeStr) {
                    case "b":
                        doClick(buttons.bold);
                        break;
                    case "i":
                        doClick(buttons.italic);
                        break;
                    case "l":
                        key.preventDefault();
                        doClick(buttons.link);
                        break;
                    case "q":
                        doClick(buttons.quote);
                        break;
                    case "k":
                        doClick(buttons.code);
                        break;
                    case "g":
                        doClick(buttons.image);
                        break;
                    case "o":
                        doClick(buttons.olist);
                        break;
                    case "u":
                        doClick(buttons.ulist);
                        break;
                    case "h":
                        key.preventDefault();
                        doClick(buttons.heading);
                        break;
                    case "r":
                        key.preventDefault();
                        doClick(buttons.hr);
                        break;
                    case "y":
                        doClick(buttons.redo);
                        break;
                    case "z":
                        if (key.shiftKey) {
                            doClick(buttons.redo);
                        } else {
                            doClick(buttons.undo);
                        }
                        break;
                    default:
                        return;
                }

                // if (key.preventDefault) {
                //     key.preventDefault();
                // }

                // if (window.event) {
                //     window.event.returnValue = false;
                // }
            }
        });

        // Auto-indent on shift-enter
        util.addEvent(inputBox, "keyup", function (key) {
            if (key.shiftKey && !key.ctrlKey && !key.metaKey) {
                var keyCode = key.charCode || key.keyCode;
                // Character 13 is Enter
                if (keyCode === 13) {
                    var fakeButton = {};
                    fakeButton.textOp = bindCommand("doAutoindent");
                    doClick(fakeButton);
                }
            }
        });

        // special handler because IE clears the context of the textbox on ESC
        if (uaSniffed.isIE) {
            util.addEvent(inputBox, "keydown", function (key) {
                var code = key.keyCode;
                if (code === 27) {
                    return false;
                }
            });
        }

        // Perform the button's action.
        function doClick(button) {

            inputBox.focus();

            if (button.textOp) {

                if (undoManager) {
                    undoManager.setCommandMode();
                }

                var state = new TextareaState(panels);

                if (!state) {
                    return;
                }

                var chunks = state.getChunks();

                // Some commands launch a "modal" prompt dialog.  Javascript
                // can't really make a modal dialog box and the WMD code
                // will continue to execute while the dialog is displayed.
                // This prevents the dialog pattern I'm used to and means
                // I can't do something like this:
                //
                // var link = CreateLinkDialog();
                // makeMarkdownLink(link);
                //
                // Instead of this straightforward method of handling a
                // dialog I have to pass any code which would execute
                // after the dialog is dismissed (e.g. link creation)
                // in a function parameter.
                //
                // Yes this is awkward and I think it sucks, but there's
                // no real workaround.  Only the image and link code
                // create dialogs and require the function pointers.
                var fixupInputArea = function () {

                    inputBox.focus();

                    if (chunks) {
                        state.setChunks(chunks);
                    }

                    state.restore();
                    previewManager.refresh();
                };

                var noCleanup = button.textOp(chunks, fixupInputArea);

                if (!noCleanup) {
                    fixupInputArea();
                }
            }

            if (button.execute) {
                button.execute(undoManager);
            }
        };

        function setupButton(button, isEnabled) {

            var normalYShift = "0px";
            var disabledYShift = "-20px";
            var highlightYShift = "-40px";
            var image = button.getElementsByTagName("a")[0];
            if (isEnabled) {
                image.style.backgroundPosition = button.XShift + " " + normalYShift;
                button.onmouseover = function () {
                    image.style.backgroundPosition = this.XShift + " " + highlightYShift;
                };

                button.onmouseout = function () {
                    image.style.backgroundPosition = this.XShift + " " + normalYShift;
                };

                // IE tries to select the background image "button" text (it's
                // implemented in a list item) so we have to cache the selection
                // on mousedown.
                if (uaSniffed.isIE) {
                    button.onmousedown = function () {
                        if (doc.activeElement && doc.activeElement !== panels.input) {
                            // we're not even in the input box, so there's no selection
                            return;
                        }
                        panels.ieCachedRange = document.selection.createRange();
                        panels.ieCachedScrollTop = panels.input.scrollTop;
                    };
                }

                if (!button.isHelp) {
                    button.onclick = function () {
                        if (this.onmouseout) {
                            this.onmouseout();
                        }
                        doClick(this);
                        return false;
                    };
                }
            } else {
                image.style.backgroundPosition = button.XShift + " " + disabledYShift;
                button.onmouseover = button.onmouseout = button.onclick = function () {};
            }
        }

        function bindCommand(method) {
            if (typeof method === "string") method = commandManager[method];
            return function () {
                method.apply(commandManager, arguments);
            };
        }

        function makeSpritedButtonRow() {

            var buttonBar = panels.buttonBar;

            var normalYShift = "0px";
            var disabledYShift = "-20px";
            var highlightYShift = "-40px";

            var buttonRow = document.createElement("ul");
            buttonRow.id = "wmd-button-row" + postfix;
            buttonRow.className = 'editor__menu clearfix';
            buttonRow = buttonBar.appendChild(buttonRow);
            var xPosition = 0;
            var makeButton = function (id, title, XShift, textOp) {
                var button = document.createElement("li");
                button.className = "wmd-button";
                button.style.left = xPosition + "px";
                xPosition += 25;
                var buttonImage = document.createElement("a");
                buttonImage.className = 'editor__menu--bold';
                button.id = id + postfix;
                button.appendChild(buttonImage);
                button.title = title;
                button.XShift = XShift;
                if (textOp) button.textOp = textOp;
                setupButton(button, true);
                buttonRow.appendChild(button);
                return button;
            };
            var makeSpacer = function (num) {
                var spacer = document.createElement("li");
                spacer.className = "editor__menu--divider wmd-spacer" + num;
                spacer.id = "wmd-spacer" + num + postfix;
                buttonRow.appendChild(spacer);
                xPosition += 25;
            };

            buttons.bold = makeButton("wmd-bold-button", getString("bold"), "0px", bindCommand("doBold"));
            buttons.italic = makeButton("wmd-italic-button", getString("italic"), "-20px", bindCommand("doItalic"));
            makeSpacer(1);
            buttons.link = makeButton("wmd-link-button", getString("link"), "-40px", bindCommand(function (chunk, postProcessing) {
                return this.doLinkOrImage(chunk, postProcessing, false);
            }));
            buttons.quote = makeButton("wmd-quote-button", getString("quote"), "-60px", bindCommand("doBlockquote"));
            buttons.code = makeButton("wmd-code-button", getString("code"), "-80px", bindCommand("doCode"));
            buttons.image = makeButton("wmd-image-button", getString("image"), "-100px", bindCommand(function (chunk, postProcessing) {
                return this.doLinkOrImage(chunk, postProcessing, true);
            }));
            makeSpacer(2);
            buttons.olist = makeButton("wmd-olist-button", getString("olist"), "-120px", bindCommand(function (chunk, postProcessing) {
                this.doList(chunk, postProcessing, true);
            }));
            buttons.ulist = makeButton("wmd-ulist-button", getString("ulist"), "-140px", bindCommand(function (chunk, postProcessing) {
                this.doList(chunk, postProcessing, false);
            }));
            buttons.heading = makeButton("wmd-heading-button", getString("heading"), "-160px", bindCommand("doHeading"));
            buttons.hr = makeButton("wmd-hr-button", getString("hr"), "-180px", bindCommand("doHorizontalRule"));
            makeSpacer(3);
            buttons.undo = makeButton("wmd-undo-button", getString("undo"), "-200px", null);
            buttons.undo.execute = function (manager) {
                if (manager) manager.undo();
            };

            var redoTitle = /win/.test(nav.platform.toLowerCase()) ? getString("redo") : getString("redomac"); // mac and other non-Windows platforms

            buttons.redo = makeButton("wmd-redo-button", redoTitle, "-220px", null);
            buttons.redo.execute = function (manager) {
                if (manager) manager.redo();
            };

            if (helpOptions) {
                var helpButton = document.createElement("li");
                var helpButtonImage = document.createElement("span");
                helpButton.appendChild(helpButtonImage);
                helpButton.className = "wmd-button wmd-help-button";
                helpButton.id = "wmd-help-button" + postfix;
                helpButton.XShift = "-240px";
                helpButton.isHelp = true;
                helpButton.style.right = "0px";
                helpButton.title = getString("help");
                helpButton.onclick = helpOptions.handler;

                setupButton(helpButton, true);
                buttonRow.appendChild(helpButton);
                buttons.help = helpButton;
            }

            setUndoRedoButtonStates();
            makeSpacer(4);
            // buttons.zen = makeButton("wmd-zen-button", getString('zen'), "-240px", null);
            buttons.help = makeButton('wmd-help-button', getString('help'), '-300px');
        }

        function setUndoRedoButtonStates() {
            if (undoManager) {
                setupButton(buttons.undo, undoManager.canUndo());
                setupButton(buttons.redo, undoManager.canRedo());
            }
        };

        this.setUndoRedoButtonStates = setUndoRedoButtonStates;
    }

    function CommandManager(pluginHooks, getString) {
        this.hooks = pluginHooks;
        this.getString = getString;
    }

    var commandProto = CommandManager.prototype;

    // The markdown symbols - 4 spaces = code, > = blockquote, etc.
    commandProto.prefixes = "(?:\\s{4,}|\\s*>|\\s*-\\s+|\\s*\\d+\\.|=|\\+|-|_|\\*|#|\\s*\\[[^\n]]+\\]:)";

    // Remove markdown symbols from the chunk selection.
    commandProto.unwrap = function (chunk) {
        var txt = new re("([^\\n])\\n(?!(\\n|" + this.prefixes + "))", "g");
        chunk.selection = chunk.selection.replace(txt, "$1 $2");
    };

    commandProto.wrap = function (chunk, len) {
        this.unwrap(chunk);
        var regex = new re("(.{1," + len + "})( +|$\\n?)", "gm"),
            that = this;

        chunk.selection = chunk.selection.replace(regex, function (line, marked) {
            if (new re("^" + that.prefixes, "").test(line)) {
                return line;
            }
            return marked + "\n";
        });

        chunk.selection = chunk.selection.replace(/\s+$/, "");
    };

    commandProto.doBold = function (chunk, postProcessing) {
        return this.doBorI(chunk, postProcessing, 2, this.getString("boldexample"));
    };

    commandProto.doItalic = function (chunk, postProcessing) {
        return this.doBorI(chunk, postProcessing, 1, this.getString("italicexample"));
    };

    // chunk: The selected region that will be enclosed with */**
    // nStars: 1 for italics, 2 for bold
    // insertText: If you just click the button without highlighting text, this gets inserted
    commandProto.doBorI = function (chunk, postProcessing, nStars, insertText) {

        // Get rid of whitespace and fixup newlines.
        chunk.trimWhitespace();
        chunk.selection = chunk.selection.replace(/\n{2,}/g, "\n");

        // Look for stars before and after.  Is the chunk already marked up?
        // note that these regex matches cannot fail
        var starsBefore = /(\**$)/.exec(chunk.before)[0];
        var starsAfter = /(^\**)/.exec(chunk.after)[0];

        var prevStars = Math.min(starsBefore.length, starsAfter.length);

        // Remove stars if we have to since the button acts as a toggle.
        if (prevStars >= nStars && (prevStars != 2 || nStars != 1)) {
            chunk.before = chunk.before.replace(re("[*]{" + nStars + "}$", ""), "");
            chunk.after = chunk.after.replace(re("^[*]{" + nStars + "}", ""), "");
        } else if (!chunk.selection && starsAfter) {
            // It's not really clear why this code is necessary.  It just moves
            // some arbitrary stuff around.
            chunk.after = chunk.after.replace(/^([*_]*)/, "");
            chunk.before = chunk.before.replace(/(\s?)$/, "");
            var whitespace = re.$1;
            chunk.before = chunk.before + starsAfter + whitespace;
        } else {

            // In most cases, if you don't have any selected text and click the button
            // you'll get a selected, marked up region with the default text inserted.
            if (!chunk.selection && !starsAfter) {
                chunk.selection = insertText;
            }

            // Add the true markup.
            var markup = nStars <= 1 ? "*" : "**"; // shouldn't the test be = ?
            chunk.before = chunk.before + markup;
            chunk.after = markup + chunk.after;
        }

        return;
    };

    commandProto.stripLinkDefs = function (text, defsToAdd) {

        text = text.replace(/^[ ]{0,3}\[(\d+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|$)/gm, function (totalMatch, id, link, newlines, title) {
            defsToAdd[id] = totalMatch.replace(/\s*$/, "");
            if (newlines) {
                // Strip the title and return that separately.
                defsToAdd[id] = totalMatch.replace(/["(](.+?)[")]$/, "");
                return newlines + title;
            }
            return "";
        });

        return text;
    };

    commandProto.addLinkDef = function (chunk, linkDef) {

        var refNumber = 0; // The current reference number
        var defsToAdd = {}; //
        // Start with a clean slate by removing all previous link definitions.
        chunk.before = this.stripLinkDefs(chunk.before, defsToAdd);
        chunk.selection = this.stripLinkDefs(chunk.selection, defsToAdd);
        chunk.after = this.stripLinkDefs(chunk.after, defsToAdd);

        var defs = "";
        var regex = /(\[)((?:\[[^\]]*\]|[^\[\]])*)(\][ ]?(?:\n[ ]*)?\[)(\d+)(\])/g;

        var addDefNumber = function (def) {
            refNumber++;
            def = def.replace(/^[ ]{0,3}\[(\d+)\]:/, "  [" + refNumber + "]:");
            defs += "\n" + def;
        };

        // note that
        // a) the recursive call to getLink cannot go infinite, because by definition
        //    of regex, inner is always a proper substring of wholeMatch, and
        // b) more than one level of nesting is neither supported by the regex
        //    nor making a lot of sense (the only use case for nesting is a linked image)
        var getLink = function (wholeMatch, before, inner, afterInner, id, end) {
            inner = inner.replace(regex, getLink);
            if (defsToAdd[id]) {
                addDefNumber(defsToAdd[id]);
                return before + inner + afterInner + refNumber + end;
            }
            return wholeMatch;
        };

        chunk.before = chunk.before.replace(regex, getLink);

        if (linkDef) {
            addDefNumber(linkDef);
        } else {
            chunk.selection = chunk.selection.replace(regex, getLink);
        }

        var refOut = refNumber;

        chunk.after = chunk.after.replace(regex, getLink);

        if (chunk.after) {
            chunk.after = chunk.after.replace(/\n*$/, "");
        }
        if (!chunk.after) {
            chunk.selection = chunk.selection.replace(/\n*$/, "");
        }

        chunk.after += "\n\n" + defs;

        return refOut;
    };

    // takes the line as entered into the add link/as image dialog and makes
    // sure the URL and the optinal title are "nice".
    function properlyEncoded(linkdef) {
        return linkdef.replace(/^\s*(.*?)(?:\s+"(.+)")?\s*$/, function (wholematch, link, title) {
            link = link.replace(/\?.*$/, function (querypart) {
                return querypart.replace(/\+/g, " "); // in the query string, a plus and a space are identical
            });
            link = decodeURIComponent(link); // unencode first, to prevent double encoding
            link = encodeURI(link).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
            link = link.replace(/\?.*$/, function (querypart) {
                return querypart.replace(/\+/g, "%2b"); // since we replaced plus with spaces in the query part, all pluses that now appear where originally encoded
            });
            if (title) {
                title = title.trim ? title.trim() : title.replace(/^\s*/, "").replace(/\s*$/, "");
                title = title.replace(/"/g, "quot;").replace(/\(/g, "&#40;").replace(/\)/g, "&#41;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            }
            return title ? link + ' "' + title + '"' : link;
        });
    }

    commandProto.doLinkOrImage = function (chunk, postProcessing, isImage) {

        chunk.trimWhitespace();
        chunk.findTags(/\s*!?\[/, /\][ ]?(?:\n[ ]*)?(\[.*?\])?/);
        var background;

        if (chunk.endTag.length > 1 && chunk.startTag.length > 0) {

            chunk.startTag = chunk.startTag.replace(/!?\[/, "");
            chunk.endTag = "";
            this.addLinkDef(chunk, null);
        } else {

            // We're moving start and end tag back into the selection, since (as we're in the else block) we're not
            // *removing* a link, but *adding* one, so whatever findTags() found is now back to being part of the
            // link text. linkEnteredCallback takes care of escaping any brackets.
            chunk.selection = chunk.startTag + chunk.selection + chunk.endTag;
            chunk.startTag = chunk.endTag = "";

            if (/\n\n/.test(chunk.selection)) {
                this.addLinkDef(chunk, null);
                return;
            }
            var that = this;
            // The function to be executed when you enter a link and press OK or Cancel.
            // Marks up the link and adds the ref.
            var linkEnteredCallback = function (link, imgName) {

                // background.parentNode.removeChild(background);
                sfModal('hide');

                if (link !== null) {
                    // (                          $1
                    //     [^\\]                  anything that's not a backslash
                    //     (?:\\\\)*              an even number (this includes zero) of backslashes
                    // )
                    // (?=                        followed by
                    //     [[\]]                  an opening or closing bracket
                    // )
                    //
                    // In other words, a non-escaped bracket. These have to be escaped now to make sure they
                    // don't count as the end of the link or similar.
                    // Note that the actual bracket has to be a lookahead, because (in case of to subsequent brackets),
                    // the bracket in one match may be the "not a backslash" character in the next match, so it
                    // should not be consumed by the first match.
                    // The "prepend a space and finally remove it" steps makes sure there is a "not a backslash" at the
                    // start of the string, so this also works if the selection begins with a bracket. We cannot solve
                    // this by anchoring with ^, because in the case that the selection starts with two brackets, this
                    // would mean a zero-width match at the start. Since zero-width matches advance the string position,
                    // the first bracket could then not act as the "not a backslash" for the second.
                    chunk.selection = (" " + chunk.selection).replace(/([^\\](?:\\\\)*)(?=[[\]])/g, "$1\\").substr(1);

                    var linkDef = " [999]: " + properlyEncoded(link);

                    var num = that.addLinkDef(chunk, linkDef);
                    chunk.startTag = isImage ? "![" : "[";
                    chunk.endTag = "][" + num + "]";

                    if (!chunk.selection) {
                        if (isImage) {
                            chunk.selection = imgName || that.getString("imagedescription");
                        } else {
                            chunk.selection = that.getString("linkdescription");
                        }
                    }
                }
                postProcessing();
            };

            // background = ui.createBackground();
            if (isImage) {
                if (!this.hooks.insertImageDialog(linkEnteredCallback)) {
                    // ui.prompt('插入图片', this.getString("imagedialog"), imageDefaultText, linkEnteredCallback);
                    var _tmpl = this.getString("imagedialog");
                    var _fileName, imgLink;
                    sfModal({
                        title: '插入图片',
                        content: _tmpl,
                        closeText: '取消',
                        doneText: '插入',
                        // wrapper: _isFull ? '.editor' : null,
                        hidden: function () {
                            $('.wmd-input').focus();
                        },
                        show: function () {
                            $('#editorUpload').fileUpload({
                                url: '/img/upload/image',
                                type: 'POST',
                                dataType: 'json',
                                beforeSend: function () {
                                    // 下面这句神奇的话会影响到拖动图片上传的成功与否，有待研究
                                    // 这句话在拖动图片上传时会报错，但是不影响功能。任何修改都有很大可能导致此功能失败。
                                    var _fileName = $('#editorUpload').val();
                                    if (_fileName.indexOf('\\fakepath') !== -1) {
                                        _fileName = _fileName.split('\\fakepath\\')[1];
                                    }
                                    $('#fileName').addClass('loading');
                                    $('.done-btn').attr('disabled', 'disabled');
                                    console.log('before');
                                },
                                complete: function () {
                                    $('#fileName').removeClass('loading');
                                    $('.done-btn').attr('disabled', false);
                                },
                                success: function (result) {
                                    var status = result[0];
                                    var data = result[1];
                                    if (status) {
                                        sfModal('对不起，上传图片失败，请联系管理员或稍后再试。');
                                    } else {
                                        imgLink = data;
                                        linkEnteredCallback(imgLink, _fileName);
                                    }
                                }
                            });
                        },
                        doneFn: function (e) {
                            e.preventDefault();
                            //远程图片
                            if ($('#remotePic').hasClass('active') && $('#remotePicUrl').val()) {
                                $('#remotePicUrl').addClass('loading');
                                $('.done-btn').attr('disabled', 'disabled');
                                _fileName = $('#remotePicUrl').val().match(/\/([^/]+)$/)[1];
                                $.post('/img/fetch/image', {
                                    src: $('#remotePicUrl').val()
                                }, function (result) {
                                    $('.done-btn').attr('disabled', false);
                                    $('#remotePicUrl').removeClass('loading');
                                    var status = result.match(/\[(\d),/)[1];
                                    var data = result.match(/\[\d,"(\S*)"\]/)[1];
                                    data = data.replace(/\\/g, '');
                                    if (status !== '0') {
                                        sfModal(data);
                                    } else {
                                        imgLink = data;
                                        linkEnteredCallback(imgLink, _fileName);
                                    }
                                }, 'text');
                            } else {}
                        }
                    });
                }
            } else {
                // ui.prompt('插入链接', this.getString("linkdialog"), linkDefaultText, linkEnteredCallback);
                var _tmpl = this.getString("linkdialog");
                sfModal({
                    title: '插入链接',
                    content: _tmpl,
                    closeText: '取消',
                    // wrapper: _isFull ? '.editor' : null,
                    doneText: '插入',
                    doneFn: function () {
                        linkEnteredCallback($('#editorLinkText').val());
                    },
                    show: function () {
                        setTimeout(function () {
                            $('#editorLinkText').focus();
                        }, 100);
                        $('#editorLinkText').keydown(function (e) {
                            if (e.which === 13) {
                                e.preventDefault();
                                linkEnteredCallback($(this).val());
                            }
                        });
                    },
                    hidden: function () {
                        $('.wmd-input').focus();
                    }
                });
            }
            return true;
        }
    };

    // When making a list, hitting shift-enter will put your cursor on the next line
    // at the current indent level.
    commandProto.doAutoindent = function (chunk, postProcessing) {

        var commandMgr = this,
            fakeSelection = false;

        chunk.before = chunk.before.replace(/(\n|^)[ ]{0,3}([*+-]|\d+[.])[ \t]*\n$/, "\n\n");
        chunk.before = chunk.before.replace(/(\n|^)[ ]{0,3}>[ \t]*\n$/, "\n\n");
        chunk.before = chunk.before.replace(/(\n|^)[ \t]+\n$/, "\n\n");

        // There's no selection, end the cursor wasn't at the end of the line:
        // The user wants to split the current list item / code line / blockquote line
        // (for the latter it doesn't really matter) in two. Temporarily select the
        // (rest of the) line to achieve this.
        if (!chunk.selection && !/^[ \t]*(?:\n|$)/.test(chunk.after)) {
            chunk.after = chunk.after.replace(/^[^\n]*/, function (wholeMatch) {
                chunk.selection = wholeMatch;
                return "";
            });
            fakeSelection = true;
        }

        if (/(\n|^)[ ]{0,3}([*+-]|\d+[.])[ \t]+.*\n$/.test(chunk.before)) {
            if (commandMgr.doList) {
                commandMgr.doList(chunk);
            }
        }
        if (/(\n|^)[ ]{0,3}>[ \t]+.*\n$/.test(chunk.before)) {
            if (commandMgr.doBlockquote) {
                commandMgr.doBlockquote(chunk);
            }
        }
        if (/(\n|^)(\t|[ ]{4,}).*\n$/.test(chunk.before)) {
            if (commandMgr.doCode) {
                commandMgr.doCode(chunk);
            }
        }

        if (fakeSelection) {
            chunk.after = chunk.selection + chunk.after;
            chunk.selection = "";
        }
    };

    commandProto.doBlockquote = function (chunk, postProcessing) {

        chunk.selection = chunk.selection.replace(/^(\n*)([^\r]+?)(\n*)$/, function (totalMatch, newlinesBefore, text, newlinesAfter) {
            chunk.before += newlinesBefore;
            chunk.after = newlinesAfter + chunk.after;
            return text;
        });

        chunk.before = chunk.before.replace(/(>[ \t]*)$/, function (totalMatch, blankLine) {
            chunk.selection = blankLine + chunk.selection;
            return "";
        });

        chunk.selection = chunk.selection.replace(/^(\s|>)+$/, "");
        chunk.selection = chunk.selection || this.getString("quoteexample");

        // The original code uses a regular expression to find out how much of the
        // text *directly before* the selection already was a blockquote:

        /*
         if (chunk.before) {
         chunk.before = chunk.before.replace(/\n?$/, "\n");
         }
         chunk.before = chunk.before.replace(/(((\n|^)(\n[ \t]*)*>(.+\n)*.*)+(\n[ \t]*)*$)/,
         function (totalMatch) {
         chunk.startTag = totalMatch;
         return "";
         });
         */

        // This comes down to:
        // Go backwards as many lines a possible, such that each line
        //  a) starts with ">", or
        //  b) is almost empty, except for whitespace, or
        //  c) is preceeded by an unbroken chain of non-empty lines
        //     leading up to a line that starts with ">" and at least one more character
        // and in addition
        //  d) at least one line fulfills a)
        //
        // Since this is essentially a backwards-moving regex, it's susceptible to
        // catstrophic backtracking and can cause the browser to hang;
        // see e.g. http://meta.stackoverflow.com/questions/9807.
        //
        // Hence we replaced this by a simple state machine that just goes through the
        // lines and checks for a), b), and c).

        var match = "",
            leftOver = "",
            line;
        if (chunk.before) {
            var lines = chunk.before.replace(/\n$/, "").split("\n");
            var inChain = false;
            for (var i = 0; i < lines.length; i++) {
                var good = false;
                line = lines[i];
                inChain = inChain && line.length > 0; // c) any non-empty line continues the chain
                if (/^>/.test(line)) {
                    // a)
                    good = true;
                    if (!inChain && line.length > 1) // c) any line that starts with ">" and has at least one more character starts the chain
                        inChain = true;
                } else if (/^[ \t]*$/.test(line)) {
                    // b)
                    good = true;
                } else {
                    good = inChain; // c) the line is not empty and does not start with ">", so it matches if and only if we're in the chain
                }
                if (good) {
                    match += line + "\n";
                } else {
                    leftOver += match + line;
                    match = "\n";
                }
            }
            if (!/(^|\n)>/.test(match)) {
                // d)
                leftOver += match;
                match = "";
            }
        }

        chunk.startTag = match;
        chunk.before = leftOver;

        // end of change

        if (chunk.after) {
            chunk.after = chunk.after.replace(/^\n?/, "\n");
        }

        chunk.after = chunk.after.replace(/^(((\n|^)(\n[ \t]*)*>(.+\n)*.*)+(\n[ \t]*)*)/, function (totalMatch) {
            chunk.endTag = totalMatch;
            return "";
        });

        var replaceBlanksInTags = function (useBracket) {

            var replacement = useBracket ? "> " : "";

            if (chunk.startTag) {
                chunk.startTag = chunk.startTag.replace(/\n((>|\s)*)\n$/, function (totalMatch, markdown) {
                    return "\n" + markdown.replace(/^[ ]{0,3}>?[ \t]*$/gm, replacement) + "\n";
                });
            }
            if (chunk.endTag) {
                chunk.endTag = chunk.endTag.replace(/^\n((>|\s)*)\n/, function (totalMatch, markdown) {
                    return "\n" + markdown.replace(/^[ ]{0,3}>?[ \t]*$/gm, replacement) + "\n";
                });
            }
        };

        if (/^(?![ ]{0,3}>)/m.test(chunk.selection)) {
            this.wrap(chunk, SETTINGS.lineLength - 2);
            chunk.selection = chunk.selection.replace(/^/gm, "> ");
            replaceBlanksInTags(true);
            chunk.skipLines();
        } else {
            chunk.selection = chunk.selection.replace(/^[ ]{0,3}> ?/gm, "");
            this.unwrap(chunk);
            replaceBlanksInTags(false);

            if (!/^(\n|^)[ ]{0,3}>/.test(chunk.selection) && chunk.startTag) {
                chunk.startTag = chunk.startTag.replace(/\n{0,2}$/, "\n\n");
            }

            if (!/(\n|^)[ ]{0,3}>.*$/.test(chunk.selection) && chunk.endTag) {
                chunk.endTag = chunk.endTag.replace(/^\n{0,2}/, "\n\n");
            }
        }

        chunk.selection = this.hooks.postBlockquoteCreation(chunk.selection);

        if (!/\n/.test(chunk.selection)) {
            chunk.selection = chunk.selection.replace(/^(> *)/, function (wholeMatch, blanks) {
                chunk.startTag += blanks;
                return "";
            });
        }
    };

    commandProto.doCode = function (chunk, postProcessing) {

        var hasTextBefore = /\S[ ]*$/.test(chunk.before);
        var hasTextAfter = /^[ ]*\S/.test(chunk.after);

        // Use 'four space' markdown if the selection is on its own
        // line or is multiline.
        if (!hasTextAfter && !hasTextBefore || /\n/.test(chunk.selection)) {

            chunk.before = chunk.before.replace(/[ ]{4}$/, function (totalMatch) {
                chunk.selection = totalMatch + chunk.selection;
                return "";
            });

            var nLinesBack = 1;
            var nLinesForward = 1;

            if (/(\n|^)(\t|[ ]{4,}).*\n$/.test(chunk.before)) {
                nLinesBack = 0;
            }
            if (/^\n(\t|[ ]{4,})/.test(chunk.after)) {
                nLinesForward = 0;
            }

            chunk.skipLines(nLinesBack, nLinesForward);

            if (!chunk.selection) {
                chunk.startTag = "```\n";
                chunk.selection = this.getString("codeexample");
                chunk.endTag = "\n```";
            } else {
                if (/^[ ]{0,3}\S/m.test(chunk.selection)) {
                    if (/\n/.test(chunk.selection)) chunk.selection = chunk.selection.replace(/^/gm, "    ");else // if it's not multiline, do not select the four added spaces; this is more consistent with the doList behavior
                        chunk.before += "    ";
                } else {
                    chunk.selection = chunk.selection.replace(/^(?:[ ]{4}|[ ]{0,3}\t)/gm, "");
                }
            }
        } else {
            // Use backticks (`) to delimit the code block.

            chunk.trimWhitespace();
            chunk.findTags(/`/, /`/);

            if (!chunk.startTag && !chunk.endTag) {
                chunk.startTag = chunk.endTag = "`";
                if (!chunk.selection) {
                    chunk.selection = this.getString("codeexample");
                }
            } else if (chunk.endTag && !chunk.startTag) {
                chunk.before += chunk.endTag;
                chunk.endTag = "";
            } else {
                chunk.startTag = chunk.endTag = "";
            }
        }
    };

    commandProto.doList = function (chunk, postProcessing, isNumberedList) {

        // These are identical except at the very beginning and end.
        // Should probably use the regex extension function to make this clearer.
        var previousItemsRegex = /(\n|^)(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*$/;
        var nextItemsRegex = /^\n*(([ ]{0,3}([*+-]|\d+[.])[ \t]+.*)(\n.+|\n{2,}([*+-].*|\d+[.])[ \t]+.*|\n{2,}[ \t]+\S.*)*)\n*/;

        // The default bullet is a dash but others are possible.
        // This has nothing to do with the particular HTML bullet,
        // it's just a markdown bullet.
        var bullet = "-";

        // The number in a numbered list.
        var num = 1;

        // Get the item prefix - e.g. " 1. " for a numbered list, " - " for a bulleted list.
        var getItemPrefix = function () {
            var prefix;
            if (isNumberedList) {
                prefix = " " + num + ". ";
                num++;
            } else {
                prefix = " " + bullet + " ";
            }
            return prefix;
        };

        // Fixes the prefixes of the other list items.
        var getPrefixedItem = function (itemText) {

            // The numbering flag is unset when called by autoindent.
            if (isNumberedList === undefined) {
                isNumberedList = /^\s*\d/.test(itemText);
            }

            // Renumber/bullet the list element.
            itemText = itemText.replace(/^[ ]{0,3}([*+-]|\d+[.])\s/gm, function (_) {
                return getItemPrefix();
            });

            return itemText;
        };

        chunk.findTags(/(\n|^)*[ ]{0,3}([*+-]|\d+[.])\s+/, null);

        if (chunk.before && !/\n$/.test(chunk.before) && !/^\n/.test(chunk.startTag)) {
            chunk.before += chunk.startTag;
            chunk.startTag = "";
        }

        if (chunk.startTag) {

            var hasDigits = /\d+[.]/.test(chunk.startTag);
            chunk.startTag = "";
            chunk.selection = chunk.selection.replace(/\n[ ]{4}/g, "\n");
            this.unwrap(chunk);
            chunk.skipLines();

            if (hasDigits) {
                // Have to renumber the bullet points if this is a numbered list.
                chunk.after = chunk.after.replace(nextItemsRegex, getPrefixedItem);
            }
            if (isNumberedList == hasDigits) {
                return;
            }
        }

        var nLinesUp = 1;

        chunk.before = chunk.before.replace(previousItemsRegex, function (itemText) {
            if (/^\s*([*+-])/.test(itemText)) {
                bullet = re.$1;
            }
            nLinesUp = /[^\n]\n\n[^\n]/.test(itemText) ? 1 : 0;
            return getPrefixedItem(itemText);
        });

        if (!chunk.selection) {
            chunk.selection = this.getString("litem");
        }

        var prefix = getItemPrefix();

        var nLinesDown = 1;

        chunk.after = chunk.after.replace(nextItemsRegex, function (itemText) {
            nLinesDown = /[^\n]\n\n[^\n]/.test(itemText) ? 1 : 0;
            return getPrefixedItem(itemText);
        });

        chunk.trimWhitespace(true);
        chunk.skipLines(nLinesUp, nLinesDown, true);
        chunk.startTag = prefix;
        var spaces = prefix.replace(/./g, " ");
        this.wrap(chunk, SETTINGS.lineLength - spaces.length);
        chunk.selection = chunk.selection.replace(/\n/g, "\n" + spaces);
    };

    commandProto.doHeading = function (chunk, postProcessing) {

        // Remove leading/trailing whitespace and reduce internal spaces to single spaces.
        chunk.selection = chunk.selection.replace(/\s+/g, " ");
        chunk.selection = chunk.selection.replace(/(^\s+|\s+$)/g, "");

        // If we clicked the button with no selected text, we just
        // make a level 2 hash header around some default text.
        if (!chunk.selection) {
            chunk.startTag = "## ";
            chunk.selection = this.getString("headingexample");
            chunk.endTag = " ##";
            return;
        }

        var headerLevel = 0; // The existing header level of the selected text.

        // Remove any existing hash heading markdown and save the header level.
        chunk.findTags(/#+[ ]*/, /[ ]*#+/);
        if (/#+/.test(chunk.startTag)) {
            headerLevel = re.lastMatch.length;
        }
        chunk.startTag = chunk.endTag = "";

        // Try to get the current header level by looking for - and = in the line
        // below the selection.
        chunk.findTags(null, /\s?(-+|=+)/);
        if (/=+/.test(chunk.endTag)) {
            headerLevel = 1;
        }
        if (/-+/.test(chunk.endTag)) {
            headerLevel = 2;
        }

        // Skip to the next line so we can create the header markdown.
        chunk.startTag = chunk.endTag = "";
        chunk.skipLines(1, 1);

        // We make a level 2 header if there is no current header.
        // If there is a header level, we substract one from the header level.
        // If it's already a level 1 header, it's removed.
        var headerLevelToCreate = headerLevel == 0 ? 2 : headerLevel - 1;

        if (headerLevelToCreate > 0) {

            // The button only creates level 1 and 2 underline headers.
            // Why not have it iterate over hash header levels?  Wouldn't that be easier and cleaner?
            var headerChar = headerLevelToCreate >= 2 ? "-" : "=";
            var len = chunk.selection.length;
            if (len > SETTINGS.lineLength) {
                len = SETTINGS.lineLength;
            }
            chunk.endTag = "\n";
            while (len--) {
                chunk.endTag += headerChar;
            }
        }
    };

    commandProto.doHorizontalRule = function (chunk, postProcessing) {
        chunk.startTag = "----------\n";
        chunk.selection = "";
        chunk.skipLines(2, 1, true);
    };
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function (Markdown) {
    // 'use strict';
    // A quick way to make sure we're only keeping span-level tags when we need to.
    // This isn't supposed to be foolproof. It's just a quick way to make sure we
    // keep all span-level tags returned by a pagedown converter. It should allow
    // all span-level tags through, with or without attributes.
    var inlineTags = new RegExp(['^(<\\/?(a|abbr|acronym|applet|area|b|basefont|', 'bdo|big|button|cite|code|del|dfn|em|figcaption|', 'font|i|iframe|img|input|ins|kbd|label|map|', 'mark|meter|object|param|progress|q|ruby|rp|rt|s|', 'samp|script|select|small|span|strike|strong|', 'sub|sup|textarea|time|tt|u|var|wbr)[^>]*>|', '<(br)\\s?\\/?>)$'].join(''), 'i');

    /******************************************************************
     * Utility Functions                                              *
     *****************************************************************/

    // patch for ie7
    if (!Array.indexOf) {
        Array.prototype.indexOf = function (obj) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == obj) {
                    return i;
                }
            }
            return -1;
        };
    }

    function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    function rtrim(str) {
        return str.replace(/\s+$/g, '');
    }

    // Remove one level of indentation from text. Indent is 4 spaces.
    function outdent(text) {
        return text.replace(new RegExp('^(\\t|[ ]{1,4})', 'gm'), '');
    }

    function contains(str, substr) {
        return str.indexOf(substr) != -1;
    }

    // Sanitize html, removing tags that aren't in the whitelist
    function sanitizeHtml(html, whitelist) {
        return html.replace(/<[^>]*>?/gi, function (tag) {
            return tag.match(whitelist) ? tag : '';
        });
    }

    // Merge two arrays, keeping only unique elements.
    function union(x, y) {
        var obj = {};
        for (var i = 0; i < x.length; i++) obj[x[i]] = x[i];
        for (i = 0; i < y.length; i++) obj[y[i]] = y[i];
        var res = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) res.push(obj[k]);
        }
        return res;
    }

    // JS regexes don't support \A or \Z, so we add sentinels, as Pagedown
    // does. In this case, we add the ascii codes for start of text (STX) and
    // end of text (ETX), an idea borrowed from:
    // https://github.com/tanakahisateru/js-markdown-extra
    function addAnchors(text) {
        if (text.charAt(0) != '\x02') text = '\x02' + text;
        if (text.charAt(text.length - 1) != '\x03') text = text + '\x03';
        return text;
    }

    // Remove STX and ETX sentinels.
    function removeAnchors(text) {
        if (text.charAt(0) == '\x02') text = text.substr(1);
        if (text.charAt(text.length - 1) == '\x03') text = text.substr(0, text.length - 1);
        return text;
    }

    // Convert markdown within an element, retaining only span-level tags
    function convertSpans(text, extra) {
        return sanitizeHtml(convertAll(text, extra), inlineTags);
    }

    // Convert internal markdown using the stock pagedown converter
    function convertAll(text, extra) {
        var result = extra.blockGamutHookCallback(text);
        // We need to perform these operations since we skip the steps in the converter
        result = unescapeSpecialChars(result);
        result = result.replace(/~D/g, "$$").replace(/~T/g, "~");
        result = extra.previousPostConversion(result);
        return result;
    }

    // Convert escaped special characters
    function processEscapesStep1(text) {
        // Markdown extra adds two escapable characters, `:` and `|`
        return text.replace(/\\\|/g, '~I').replace(/\\:/g, '~i');
    }
    function processEscapesStep2(text) {
        return text.replace(/~I/g, '|').replace(/~i/g, ':');
    }

    // Duplicated from PageDown converter
    function unescapeSpecialChars(text) {
        // Swap back in all the special characters we've hidden.
        text = text.replace(/~E(\d+)E/g, function (wholeMatch, m1) {
            var charCodeToReplace = parseInt(m1);
            return String.fromCharCode(charCodeToReplace);
        });
        return text;
    }

    function slugify(text) {
        return text.toLowerCase().replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
    }

    /*****************************************************************************
     * Markdown.Extra *
     ****************************************************************************/

    Markdown.Extra = function () {
        // For converting internal markdown (in tables for instance).
        // This is necessary since these methods are meant to be called as
        // preConversion hooks, and the Markdown converter passed to init()
        // won't convert any markdown contained in the html tags we return.
        this.converter = null;

        // Stores html blocks we generate in hooks so that
        // they're not destroyed if the user is using a sanitizing converter
        this.hashBlocks = [];

        // Stores footnotes
        this.footnotes = {};
        this.usedFootnotes = [];

        // Special attribute blocks for fenced code blocks and headers enabled.
        this.attributeBlocks = false;

        // Fenced code block options
        this.googleCodePrettify = false;
        this.highlightJs = false;

        // Table options
        this.tableClass = '';

        this.tabWidth = 4;
    };

    Markdown.Extra.init = function (converter, options) {
        // Each call to init creates a new instance of Markdown.Extra so it's
        // safe to have multiple converters, with different options, on a single page
        var extra = new Markdown.Extra();
        var postNormalizationTransformations = [];
        var preBlockGamutTransformations = [];
        var postSpanGamutTransformations = [];
        var postConversionTransformations = ["unHashExtraBlocks"];

        options = options || {};
        options.extensions = options.extensions || ["all"];
        if (contains(options.extensions, "all")) {
            options.extensions = ["tables", "fenced_code_gfm", "def_list", "attr_list", "footnotes", "smartypants", "strikethrough", "newlines"];
        }
        preBlockGamutTransformations.push("wrapHeaders");
        if (contains(options.extensions, "attr_list")) {
            postNormalizationTransformations.push("hashFcbAttributeBlocks");
            preBlockGamutTransformations.push("hashHeaderAttributeBlocks");
            postConversionTransformations.push("applyAttributeBlocks");
            extra.attributeBlocks = true;
        }
        if (contains(options.extensions, "fenced_code_gfm")) {
            // This step will convert fcb inside list items and blockquotes
            preBlockGamutTransformations.push("fencedCodeBlocks");
            // This extra step is to prevent html blocks hashing and link definition/footnotes stripping inside fcb
            postNormalizationTransformations.push("fencedCodeBlocks");
        }
        if (contains(options.extensions, "tables")) {
            preBlockGamutTransformations.push("tables");
        }
        if (contains(options.extensions, "def_list")) {
            preBlockGamutTransformations.push("definitionLists");
        }
        if (contains(options.extensions, "footnotes")) {
            postNormalizationTransformations.push("stripFootnoteDefinitions");
            preBlockGamutTransformations.push("doFootnotes");
            postConversionTransformations.push("printFootnotes");
        }
        if (contains(options.extensions, "smartypants")) {
            postConversionTransformations.push("runSmartyPants");
        }
        if (contains(options.extensions, "strikethrough")) {
            postSpanGamutTransformations.push("strikethrough");
        }
        if (contains(options.extensions, "newlines")) {
            postSpanGamutTransformations.push("newlines");
        }

        converter.hooks.chain("postNormalization", function (text) {
            return extra.doTransform(postNormalizationTransformations, text) + '\n';
        });

        converter.hooks.chain("preBlockGamut", function (text, blockGamutHookCallback) {
            // Keep a reference to the block gamut callback to run recursively
            extra.blockGamutHookCallback = blockGamutHookCallback;
            text = processEscapesStep1(text);
            text = extra.doTransform(preBlockGamutTransformations, text) + '\n';
            text = processEscapesStep2(text);
            return text;
        });

        converter.hooks.chain("postSpanGamut", function (text) {
            return extra.doTransform(postSpanGamutTransformations, text);
        });

        // Keep a reference to the hook chain running before doPostConversion to apply on hashed extra blocks
        extra.previousPostConversion = converter.hooks.postConversion;
        converter.hooks.chain("postConversion", function (text) {
            text = extra.doTransform(postConversionTransformations, text);
            // Clear state vars that may use unnecessary memory
            extra.hashBlocks = [];
            extra.footnotes = {};
            extra.usedFootnotes = [];
            return text;
        });

        if ("highlighter" in options) {
            extra.googleCodePrettify = options.highlighter === 'prettify';
            extra.highlightJs = options.highlighter === 'highlight';
        }

        if ("table_class" in options) {
            extra.tableClass = options.table_class;
        }

        extra.converter = converter;

        // Caller usually won't need this, but it's handy for testing.
        return extra;
    };

    // Do transformations
    Markdown.Extra.prototype.doTransform = function (transformations, text) {
        for (var i = 0; i < transformations.length; i++) text = this[transformations[i]](text);
        return text;
    };

    // Return a placeholder containing a key, which is the block's index in the
    // hashBlocks array. We wrap our output in a <p> tag here so Pagedown won't.
    Markdown.Extra.prototype.hashExtraBlock = function (block) {
        return '\n<p>~X' + (this.hashBlocks.push(block) - 1) + 'X</p>\n';
    };
    Markdown.Extra.prototype.hashExtraInline = function (block) {
        return '~X' + (this.hashBlocks.push(block) - 1) + 'X';
    };

    // Replace placeholder blocks in `text` with their corresponding
    // html blocks in the hashBlocks array.
    Markdown.Extra.prototype.unHashExtraBlocks = function (text) {
        var self = this;
        function recursiveUnHash() {
            var hasHash = false;
            text = text.replace(/(?:<p>)?~X(\d+)X(?:<\/p>)?/g, function (wholeMatch, m1) {
                hasHash = true;
                var key = parseInt(m1, 10);
                return self.hashBlocks[key];
            });
            if (hasHash === true) {
                recursiveUnHash();
            }
        }
        recursiveUnHash();
        return text;
    };

    // Wrap headers to make sure they won't be in def lists
    Markdown.Extra.prototype.wrapHeaders = function (text) {
        function wrap(text) {
            return '\n' + text + '\n';
        }
        text = text.replace(/^.+[ \t]*\n=+[ \t]*\n+/gm, wrap);
        text = text.replace(/^.+[ \t]*\n-+[ \t]*\n+/gm, wrap);
        text = text.replace(/^\#{1,6}[ \t]*.+?[ \t]*\#*\n+/gm, wrap);
        return text;
    };

    /******************************************************************
     * Attribute Blocks                                               *
     *****************************************************************/

    // TODO: use sentinels. Should we just add/remove them in doConversion?
    // TODO: better matches for id / class attributes
    var attrBlock = "\\{[ \\t]*((?:[#.][-_:a-zA-Z0-9]+[ \\t]*)+)\\}";
    var hdrAttributesA = new RegExp("^(#{1,6}.*#{0,6})[ \\t]+" + attrBlock + "[ \\t]*(?:\\n|0x03)", "gm");
    var hdrAttributesB = new RegExp("^(.*)[ \\t]+" + attrBlock + "[ \\t]*\\n" + "(?=[\\-|=]+\\s*(?:\\n|0x03))", "gm"); // underline lookahead
    var fcbAttributes = new RegExp("^(```[ \\t]*[^{\\s]*)[ \\t]+" + attrBlock + "[ \\t]*\\n" + "(?=([\\s\\S]*?)\\n```[ \\t]*(\\n|0x03))", "gm");

    // Extract headers attribute blocks, move them above the element they will be
    // applied to, and hash them for later.
    Markdown.Extra.prototype.hashHeaderAttributeBlocks = function (text) {

        var self = this;
        function attributeCallback(wholeMatch, pre, attr) {
            return '<p>~XX' + (self.hashBlocks.push(attr) - 1) + 'XX</p>\n' + pre + "\n";
        }

        text = text.replace(hdrAttributesA, attributeCallback); // ## headers
        text = text.replace(hdrAttributesB, attributeCallback); // underline headers
        return text;
    };

    // Extract FCB attribute blocks, move them above the element they will be
    // applied to, and hash them for later.
    Markdown.Extra.prototype.hashFcbAttributeBlocks = function (text) {
        // TODO: use sentinels. Should we just add/remove them in doConversion?
        // TODO: better matches for id / class attributes

        var self = this;
        function attributeCallback(wholeMatch, pre, attr) {
            return '<p>~XX' + (self.hashBlocks.push(attr) - 1) + 'XX</p>\n' + pre + "\n";
        }

        return text.replace(fcbAttributes, attributeCallback);
    };

    Markdown.Extra.prototype.applyAttributeBlocks = function (text) {
        var self = this;
        var blockRe = new RegExp('<p>~XX(\\d+)XX</p>[\\s]*' + '(?:<(h[1-6]|pre)(?: +class="(\\S+)")?(>[\\s\\S]*?</\\2>))', "gm");
        text = text.replace(blockRe, function (wholeMatch, k, tag, cls, rest) {
            if (!tag) // no following header or fenced code block.
                return '';

            // get attributes list from hash
            var key = parseInt(k, 10);
            var attributes = self.hashBlocks[key];

            // get id
            var id = attributes.match(/#[^\s#.]+/g) || [];
            var idStr = id[0] ? ' id="' + id[0].substr(1, id[0].length - 1) + '"' : '';

            // get classes and merge with existing classes
            var classes = attributes.match(/\.[^\s#.]+/g) || [];
            for (var i = 0; i < classes.length; i++) // Remove leading dot
            classes[i] = classes[i].substr(1, classes[i].length - 1);

            var classStr = '';
            if (cls) classes = union(classes, [cls]);

            if (classes.length > 0) classStr = ' class="' + classes.join(' ') + '"';

            return "<" + tag + idStr + classStr + rest;
        });

        return text;
    };

    /******************************************************************
     * Tables                                                         *
     *****************************************************************/

    // Find and convert Markdown Extra tables into html.
    Markdown.Extra.prototype.tables = function (text) {
        var self = this;

        var leadingPipe = new RegExp(['^', '[ ]{0,3}', // Allowed whitespace
        '[|]', // Initial pipe
        '(.+)\\n', // $1: Header Row

        '[ ]{0,3}', // Allowed whitespace
        '[|]([ ]*[-:]+[-| :]*)\\n', // $2: Separator

        '(', // $3: Table Body
        '(?:[ ]*[|].*\\n?)*', // Table rows
        ')', '(?:\\n|$)' // Stop at final newline
        ].join(''), 'gm');

        var noLeadingPipe = new RegExp(['^', '[ ]{0,3}', // Allowed whitespace
        '(\\S.*[|].*)\\n', // $1: Header Row

        '[ ]{0,3}', // Allowed whitespace
        '([-:]+[ ]*[|][-| :]*)\\n', // $2: Separator

        '(', // $3: Table Body
        '(?:.*[|].*\\n?)*', // Table rows
        ')', '(?:\\n|$)' // Stop at final newline
        ].join(''), 'gm');

        text = text.replace(leadingPipe, doTable);
        text = text.replace(noLeadingPipe, doTable);

        // $1 = header, $2 = separator, $3 = body
        function doTable(match, header, separator, body, offset, string) {
            // remove any leading pipes and whitespace
            header = header.replace(/^ *[|]/m, '');
            separator = separator.replace(/^ *[|]/m, '');
            body = body.replace(/^ *[|]/gm, '');

            // remove trailing pipes and whitespace
            header = header.replace(/[|] *$/m, '');
            separator = separator.replace(/[|] *$/m, '');
            body = body.replace(/[|] *$/gm, '');

            // determine column alignments
            alignspecs = separator.split(/ *[|] */);
            align = [];
            for (var i = 0; i < alignspecs.length; i++) {
                var spec = alignspecs[i];
                if (spec.match(/^ *-+: *$/m)) align[i] = ' style="text-align:right;"';else if (spec.match(/^ *:-+: *$/m)) align[i] = ' style="text-align:center;"';else if (spec.match(/^ *:-+ *$/m)) align[i] = ' style="text-align:left;"';else align[i] = '';
            }

            // TODO: parse spans in header and rows before splitting, so that pipes
            // inside of tags are not interpreted as separators
            var headers = header.split(/ *[|] */);
            var colCount = headers.length;

            // build html
            var cls = self.tableClass ? ' class="' + self.tableClass + '"' : '';
            var html = ['<table', cls, '>\n', '<thead>\n', '<tr>\n'].join('');

            // build column headers.
            for (i = 0; i < colCount; i++) {
                var headerHtml = convertSpans(trim(headers[i]), self);
                html += ["  <th", align[i], ">", headerHtml, "</th>\n"].join('');
            }
            html += "</tr>\n</thead>\n";

            // build rows
            var rows = body.split('\n');
            for (i = 0; i < rows.length; i++) {
                if (rows[i].match(/^\s*$/)) // can apply to final row
                    continue;

                // ensure number of rowCells matches colCount
                var rowCells = rows[i].split(/ *[|] */);
                var lenDiff = colCount - rowCells.length;
                for (var j = 0; j < lenDiff; j++) rowCells.push('');

                html += "<tr>\n";
                for (j = 0; j < colCount; j++) {
                    var colHtml = convertSpans(trim(rowCells[j]), self);
                    html += ["  <td", align[j], ">", colHtml, "</td>\n"].join('');
                }
                html += "</tr>\n";
            }

            html += "</table>\n";

            // replace html with placeholder until postConversion step
            return self.hashExtraBlock(html);
        }

        return text;
    };

    /******************************************************************
     * Footnotes                                                      *
     *****************************************************************/

    // Strip footnote, store in hashes.
    Markdown.Extra.prototype.stripFootnoteDefinitions = function (text) {
        var self = this;

        text = text.replace(/\n[ ]{0,3}\[\^(.+?)\]\:[ \t]*\n?([\s\S]*?)\n{1,2}((?=\n[ ]{0,3}\S)|$)/g, function (wholeMatch, m1, m2) {
            m1 = slugify(m1);
            m2 += "\n";
            m2 = m2.replace(/^[ ]{0,3}/g, "");
            self.footnotes[m1] = m2;
            return "\n";
        });

        return text;
    };

    // Find and convert footnotes references.
    Markdown.Extra.prototype.doFootnotes = function (text) {
        var self = this;
        if (self.isConvertingFootnote === true) {
            return text;
        }

        var footnoteCounter = 0;
        text = text.replace(/\[\^(.+?)\]/g, function (wholeMatch, m1) {
            var id = slugify(m1);
            var footnote = self.footnotes[id];
            if (footnote === undefined) {
                return wholeMatch;
            }
            footnoteCounter++;
            self.usedFootnotes.push(id);
            var html = '<a href="#fn:' + id + '" id="fnref:' + id + '" title="See footnote" class="footnote">' + footnoteCounter + '</a>';
            return self.hashExtraInline(html);
        });

        return text;
    };

    // Print footnotes at the end of the document
    Markdown.Extra.prototype.printFootnotes = function (text) {
        var self = this;

        if (self.usedFootnotes.length === 0) {
            return text;
        }

        text += '\n\n<div class="footnotes">\n<hr>\n<ol>\n\n';
        for (var i = 0; i < self.usedFootnotes.length; i++) {
            var id = self.usedFootnotes[i];
            var footnote = self.footnotes[id];
            self.isConvertingFootnote = true;
            var formattedfootnote = convertSpans(footnote, self);
            delete self.isConvertingFootnote;
            text += '<li id="fn:' + id + '">' + formattedfootnote + ' <a href="#fnref:' + id + '" title="Return to article" class="reversefootnote">&#8617;</a></li>\n\n';
        }
        text += '</ol>\n</div>';
        return text;
    };

    /******************************************************************
     * Fenced Code Blocks  (gfm)                                       *
     ******************************************************************/

    // Find and convert gfm-inspired fenced code blocks into html.
    Markdown.Extra.prototype.fencedCodeBlocks = function (text) {
        function encodeCode(code) {
            code = code.replace(/&/g, "&amp;");
            code = code.replace(/</g, "&lt;");
            code = code.replace(/>/g, "&gt;");
            // These were escaped by PageDown before postNormalization
            code = code.replace(/~D/g, "$$");
            code = code.replace(/~T/g, "~");
            return code;
        }

        var self = this;
        text = text.replace(/(?:^|\n)```[ \t]*(\S*)[ \t]*\n([\s\S]*?)\n```[ \t]*(?=\n)/g, function (match, m1, m2) {
            var language = m1,
                codeblock = m2;

            // adhere to specified options
            var preclass = self.googleCodePrettify ? ' class="prettyprint"' : '';
            var codeclass = '';
            if (language) {
                if (self.googleCodePrettify || self.highlightJs) {
                    // use html5 language- class names. supported by both prettify and highlight.js
                    codeclass = ' class="language-' + language + '"';
                } else {
                    codeclass = ' class="' + language + '"';
                }
            }

            var html = ['<pre', preclass, '><code', codeclass, '>', encodeCode(codeblock), '</code></pre>'].join('');

            // replace codeblock with placeholder until postConversion step
            return self.hashExtraBlock(html);
        });

        return text;
    };

    /******************************************************************
     * SmartyPants                                                     *
     ******************************************************************/

    Markdown.Extra.prototype.educatePants = function (text) {
        var self = this;
        var result = '';
        var blockOffset = 0;
        // Here we parse HTML in a very bad manner
        text.replace(/(?:<!--[\s\S]*?-->)|(<)([a-zA-Z1-6]+)([^\n]*?>)([\s\S]*?)(<\/\2>)/g, function (wholeMatch, m1, m2, m3, m4, m5, offset) {
            var token = text.substring(blockOffset, offset);
            result += self.applyPants(token);
            self.smartyPantsLastChar = result.substring(result.length - 1);
            blockOffset = offset + wholeMatch.length;
            if (!m1) {
                // Skip commentary
                result += wholeMatch;
                return;
            }
            // Skip special tags
            if (!/code|kbd|pre|script|noscript|iframe|math|ins|del|pre/i.test(m2)) {
                m4 = self.educatePants(m4);
            } else {
                self.smartyPantsLastChar = m4.substring(m4.length - 1);
            }
            result += m1 + m2 + m3 + m4 + m5;
        });
        var lastToken = text.substring(blockOffset);
        result += self.applyPants(lastToken);
        self.smartyPantsLastChar = result.substring(result.length - 1);
        return result;
    };

    function revertPants(wholeMatch, m1) {
        var blockText = m1;
        blockText = blockText.replace(/&\#8220;/g, "\"");
        blockText = blockText.replace(/&\#8221;/g, "\"");
        blockText = blockText.replace(/&\#8216;/g, "'");
        blockText = blockText.replace(/&\#8217;/g, "'");
        blockText = blockText.replace(/&\#8212;/g, "---");
        blockText = blockText.replace(/&\#8211;/g, "--");
        blockText = blockText.replace(/&\#8230;/g, "...");
        return blockText;
    }

    Markdown.Extra.prototype.applyPants = function (text) {
        // Dashes
        text = text.replace(/---/g, "&#8212;").replace(/--/g, "&#8211;");
        // Ellipses
        text = text.replace(/\.\.\./g, "&#8230;").replace(/\.\s\.\s\./g, "&#8230;");
        // Backticks
        text = text.replace(/``/g, "&#8220;").replace(/''/g, "&#8221;");

        if (/^'$/.test(text)) {
            // Special case: single-character ' token
            if (/\S/.test(this.smartyPantsLastChar)) {
                return "&#8217;";
            }
            return "&#8216;";
        }
        if (/^"$/.test(text)) {
            // Special case: single-character " token
            if (/\S/.test(this.smartyPantsLastChar)) {
                return "&#8221;";
            }
            return "&#8220;";
        }

        // Special case if the very first character is a quote
        // followed by punctuation at a non-word-break. Close the quotes by brute force:
        text = text.replace(/^'(?=[!"#\$\%'()*+,\-.\/:;<=>?\@\[\\]\^_`{|}~]\B)/, "&#8217;");
        text = text.replace(/^"(?=[!"#\$\%'()*+,\-.\/:;<=>?\@\[\\]\^_`{|}~]\B)/, "&#8221;");

        // Special case for double sets of quotes, e.g.:
        //   <p>He said, "'Quoted' words in a larger quote."</p>
        text = text.replace(/"'(?=\w)/g, "&#8220;&#8216;");
        text = text.replace(/'"(?=\w)/g, "&#8216;&#8220;");

        // Special case for decade abbreviations (the '80s):
        text = text.replace(/'(?=\d{2}s)/g, "&#8217;");

        // Get most opening single quotes:
        text = text.replace(/(\s|&nbsp;|--|&[mn]dash;|&\#8211;|&\#8212;|&\#x201[34];)'(?=\w)/g, "$1&#8216;");

        // Single closing quotes:
        text = text.replace(/([^\s\[\{\(\-])'/g, "$1&#8217;");
        text = text.replace(/'(?=\s|s\b)/g, "&#8217;");

        // Any remaining single quotes should be opening ones:
        text = text.replace(/'/g, "&#8216;");

        // Get most opening double quotes:
        text = text.replace(/(\s|&nbsp;|--|&[mn]dash;|&\#8211;|&\#8212;|&\#x201[34];)"(?=\w)/g, "$1&#8220;");

        // Double closing quotes:
        text = text.replace(/([^\s\[\{\(\-])"/g, "$1&#8221;");
        text = text.replace(/"(?=\s)/g, "&#8221;");

        // Any remaining quotes should be opening ones.
        text = text.replace(/"/ig, "&#8220;");
        return text;
    };

    // Find and convert markdown extra definition lists into html.
    Markdown.Extra.prototype.runSmartyPants = function (text) {
        this.smartyPantsLastChar = '';
        text = this.educatePants(text);
        // Clean everything inside html tags (some of them may have been converted due to our rough html parsing)
        text = text.replace(/(<([a-zA-Z1-6]+)\b([^\n>]*?)(\/)?>)/g, revertPants);
        return text;
    };

    /******************************************************************
     * Definition Lists                                                *
     ******************************************************************/

    // Find and convert markdown extra definition lists into html.
    Markdown.Extra.prototype.definitionLists = function (text) {
        var wholeList = new RegExp(['(\\x02\\n?|\\n\\n)', '(?:', '(', // $1 = whole list
        '(', // $2
        '[ ]{0,3}', '((?:[ \\t]*\\S.*\\n)+)', // $3 = defined term
        '\\n?', '[ ]{0,3}:[ ]+', // colon starting definition
        ')', '([\\s\\S]+?)', '(', // $4
        '(?=\\0x03)', // \z
        '|', '(?=', '\\n{2,}', '(?=\\S)', '(?!', // Negative lookahead for another term
        '[ ]{0,3}', '(?:\\S.*\\n)+?', // defined term
        '\\n?', '[ ]{0,3}:[ ]+', // colon starting definition
        ')', '(?!', // Negative lookahead for another definition
        '[ ]{0,3}:[ ]+', // colon starting definition
        ')', ')', ')', ')', ')'].join(''), 'gm');

        var self = this;
        text = addAnchors(text);

        text = text.replace(wholeList, function (match, pre, list) {
            var result = trim(self.processDefListItems(list));
            result = "<dl>\n" + result + "\n</dl>";
            return pre + self.hashExtraBlock(result) + "\n\n";
        });

        return removeAnchors(text);
    };

    // Process the contents of a single definition list, splitting it
    // into individual term and definition list items.
    Markdown.Extra.prototype.processDefListItems = function (listStr) {
        var self = this;

        var dt = new RegExp(['(\\x02\\n?|\\n\\n+)', // leading line
        '(', // definition terms = $1
        '[ ]{0,3}', // leading whitespace
        '(?![:][ ]|[ ])', // negative lookahead for a definition
        //   mark (colon) or more whitespace
        '(?:\\S.*\\n)+?', // actual term (not whitespace)
        ')', '(?=\\n?[ ]{0,3}:[ ])' // lookahead for following line feed
        ].join(''), //   with a definition mark
        'gm');

        var dd = new RegExp(['\\n(\\n+)?', // leading line = $1
        '(', // marker space = $2
        '[ ]{0,3}', // whitespace before colon
        '[:][ ]+', // definition mark (colon)
        ')', '([\\s\\S]+?)', // definition text = $3
        '(?=\\n*', // stop at next definition mark,
        '(?:', // next term or end of text
        '\\n[ ]{0,3}[:][ ]|', '<dt>|\\x03', // \z
        ')', ')'].join(''), 'gm');

        listStr = addAnchors(listStr);
        // trim trailing blank lines:
        listStr = listStr.replace(/\n{2,}(?=\\x03)/, "\n");

        // Process definition terms.
        listStr = listStr.replace(dt, function (match, pre, termsStr) {
            var terms = trim(termsStr).split("\n");
            var text = '';
            for (var i = 0; i < terms.length; i++) {
                var term = terms[i];
                // process spans inside dt
                term = convertSpans(trim(term), self);
                text += "\n<dt>" + term + "</dt>";
            }
            return text + "\n";
        });

        // Process actual definitions.
        listStr = listStr.replace(dd, function (match, leadingLine, markerSpace, def) {
            if (leadingLine || def.match(/\n{2,}/)) {
                // replace marker with the appropriate whitespace indentation
                def = Array(markerSpace.length + 1).join(' ') + def;
                // process markdown inside definition
                // TODO?: currently doesn't apply extensions
                def = outdent(def) + "\n\n";
                def = "\n" + convertAll(def, self) + "\n";
            } else {
                // convert span-level markdown inside definition
                def = rtrim(def);
                def = convertSpans(outdent(def), self);
            }

            return "\n<dd>" + def + "</dd>\n";
        });

        return removeAnchors(listStr);
    };

    /***********************************************************
     * Strikethrough                                            *
     ************************************************************/

    Markdown.Extra.prototype.strikethrough = function (text) {
        // Pretty much duplicated from _DoItalicsAndBold
        return text.replace(/([\W_]|^)~T~T(?=\S)([^\r]*?\S[\*_]*)~T~T([\W_]|$)/g, "$1<del>$2</del>$3");
    };

    /***********************************************************
     * New lines                                                *
     ************************************************************/

    Markdown.Extra.prototype.newlines = function (text) {
        // We have to ignore already converted newlines and line breaks in sub-list items
        return text.replace(/(<(?:br|\/li)>)?\n/g, function (wholeMatch, previousTag) {
            return previousTag ? wholeMatch : " <br>\n";
        });
    };
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function (Markdown) {
    var output, Converter;
    output = Markdown;
    Converter = output.Converter;

    output.getSanitizingConverter = function () {
        var converter = new Converter();
        converter.hooks.chain("postConversion", sanitizeHtml);
        converter.hooks.chain("postConversion", balanceTags);
        return converter;
    };

    function sanitizeHtml(html) {
        return html.replace(/<[^>]*>?/gi, sanitizeTag);
    }

    // (tags that can be opened/closed) | (tags that stand alone)
    var basic_tag_whitelist = /^(<\/?(b|blockquote|code|del|dd|dl|dt|em|h1|h2|h3|i|kbd|li|ol(?: start="\d+")?|p|pre|s|sup|sub|strong|strike|ul)>|<(br|hr)\s?\/?>)$/i;
    // <a href="url..." optional title>|</a>
    var a_white = /^(<a\shref="((https?|ftp):\/\/|\/)[-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)*[\]$]+"(\stitle="[^"<>]+")?\s?>|<\/a>)$/i;

    // <img src="url..." optional width  optional height  optional alt  optional title
    var img_white = /^(<img\ssrc="(https?:\/\/|\/)[-A-Za-z0-9+&@#\/%?=~_|!:,.;\(\)*[\]$]+"(\swidth="\d{1,3}")?(\sheight="\d{1,3}")?(\salt="[^"<>]*")?(\stitle="[^"<>]*")?\s?\/?>)$/i;

    function sanitizeTag(tag) {
        if (tag.match(basic_tag_whitelist) || tag.match(a_white) || tag.match(img_white)) return tag;else return "";
    }

    /// <summary>
    /// attempt to balance HTML tags in the html string
    /// by removing any unmatched opening or closing tags
    /// IMPORTANT: we *assume* HTML has *already* been
    /// sanitized and is safe/sane before balancing!
    ///
    /// adapted from CODESNIPPET: A8591DBA-D1D3-11DE-947C-BA5556D89593
    /// </summary>
    function balanceTags(html) {

        if (html == "") return "";

        var re = /<\/?\w+[^>]*(\s|$|>)/g;
        // convert everything to lower case; this makes
        // our case insensitive comparisons easier
        var tags = html.toLowerCase().match(re);

        // no HTML tags present? nothing to do; exit now
        var tagcount = (tags || []).length;
        if (tagcount == 0) return html;

        var tagname, tag;
        var ignoredtags = "<p><img><br><li><hr>";
        var match;
        var tagpaired = [];
        var tagremove = [];
        var needsRemoval = false;

        // loop through matched tags in forward order
        for (var ctag = 0; ctag < tagcount; ctag++) {
            tagname = tags[ctag].replace(/<\/?(\w+).*/, "$1");
            // skip any already paired tags
            // and skip tags in our ignore list; assume they're self-closed
            if (tagpaired[ctag] || ignoredtags.search("<" + tagname + ">") > -1) continue;

            tag = tags[ctag];
            match = -1;

            if (!/^<\//.test(tag)) {
                // this is an opening tag
                // search forwards (next tags), look for closing tags
                for (var ntag = ctag + 1; ntag < tagcount; ntag++) {
                    if (!tagpaired[ntag] && tags[ntag] == "</" + tagname + ">") {
                        match = ntag;
                        break;
                    }
                }
            }

            if (match == -1) needsRemoval = tagremove[ctag] = true; // mark for removal
            else tagpaired[match] = true; // mark paired
        }

        if (!needsRemoval) return html;

        // delete all orphaned tags from the string

        var ctag = 0;
        html = html.replace(re, function (match) {
            var res = tagremove[ctag] ? "" : match;
            ctag++;
            return res;
        });
        return html;
    }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(5)
var ieee754 = __webpack_require__(9)
var isArray = __webpack_require__(10)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)(undefined);
// imports


// module
exports.push([module.i, ".editor {\n  position: relative;\n  z-index: 1;\n  min-height: 300px;\n  overflow: hidden;\n  border: 1px solid #ccc;\n  border-radius: 3px; }\n\n.editor .wmd-input.mono.form-control {\n  margin-top: 31px;\n  resize: none;\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n  tab-size: 4; }\n\n.editor__resize {\n  position: absolute;\n  width: 120px;\n  height: 4px;\n  left: 50%;\n  -webkit-transform: translateX(-50%);\n  transform: translateX(-50%);\n  margin-top: 2px;\n  border-top: 1px solid #ccc;\n  border-bottom: 1px solid #ccc;\n  cursor: row-resize;\n  text-indent: 110%;\n  white-space: nowrap;\n  overflow: hidden;\n  text-transform: capitalize; }\n\n.editor .form-control {\n  border-radius: 0;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); }\n\n.editor_fullscreen {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 999;\n  margin-top: 0;\n  border: none;\n  width: 100%;\n  height: 100vh;\n  background-color: #f6f6f6; }\n\n.editor_fullscreen .wmd {\n  height: 100%; }\n\n.editor_fullscreen .wmd .editor-toolbar {\n  position: fixed;\n  top: 0;\n  width: 100%; }\n\n.editor_fullscreen .wmd .wmd-input {\n  height: 100%; }\n\n.editor_fullscreen .editor-mode a.editor__menu--live {\n  display: block; }\n\n.editor.liveMode .wmd {\n  width: 50%; }\n\n.editor.liveMode .editor-preview {\n  overflow: auto;\n  left: 50%;\n  width: 50%; }\n\n.editor.liveMode .editor-line {\n  left: 50%; }\n\n.editor.editMode .wmd {\n  width: 100%; }\n\n.editor.editMode .editor-line, .editor.editMode .editor-preview {\n  left: 100%; }\n\n.editor.previewMode .editor-mode, .editor.previewMode .editor-preview {\n  left: 0;\n  width: 100%; }\n\n.editor.previewMode .editor-preview {\n  border-left: none; }\n\n.editor.previewMode .editor-mode {\n  left: 1px; }\n\n.editor.previewMode .editor-line {\n  left: -1px; }\n\n.editor.previewMode .editor__menu li {\n  display: none; }\n\n.editor-toolbar {\n  position: absolute;\n  top: 0;\n  width: 100%;\n  z-index: 106;\n  border-bottom: 1px solid #ccc; }\n\n.editor-mode, .editor__menu {\n  list-style: none;\n  margin: 0;\n  padding: 0 5px;\n  background-color: #fff; }\n\n.editor-mode li, .editor__menu li {\n  float: left;\n  margin: 0 2px;\n  vertical-align: text-top; }\n\n.editor-mode a, .editor__menu a {\n  cursor: pointer;\n  display: block;\n  border: 5px solid #fff;\n  width: 20px;\n  height: 20px;\n  background-repeat: no-repeat;\n  background-size: 380px 60px;\n  background-image: url(" + __webpack_require__(14) + ");\n  text-indent: 110%;\n  white-space: nowrap;\n  overflow: hidden;\n  text-transform: capitalize;\n  box-sizing: content-box; }\n\n.editor-mode a.muted, .editor-mode a.muted:hover, .editor__menu a.muted, .editor__menu a.muted:hover {\n  background-position-y: -20px;\n  background-color: #f6f6f6;\n  border-color: #f6f6f6;\n  cursor: default; }\n\n.editor-mode a.active, .editor-mode a:hover, .editor__menu a.active, .editor__menu a:hover {\n  border-color: #f6f6f6;\n  background-color: #f6f6f6;\n  background-position-y: -40px;\n  text-decoration: none; }\n\n.editor-mode .active, .editor__menu .active {\n  color: #999; }\n\n.editor-mode--bold, .editor__menu--bold {\n  background-position: -1px 0; }\n\n.editor-mode--italic, .editor__menu--italic {\n  background-position: -21px 0; }\n\n.editor-mode--link, .editor__menu--link {\n  background-position: -40px 0; }\n\n.editor-mode--quote, .editor__menu--quote {\n  background-position: -60px 0; }\n\n.editor-mode--code, .editor__menu--code {\n  background-position: -80px 0; }\n\n.editor-mode--img, .editor__menu--img {\n  background-position: -100px 0; }\n\n.editor-mode--ol, .editor__menu--ol {\n  background-position: -120px 0; }\n\n.editor-mode--ul, .editor__menu--ul {\n  background-position: -140px 0; }\n\n.editor-mode--title, .editor__menu--title {\n  background-position: -160px 0; }\n\n.editor-mode--hr, .editor__menu--hr {\n  background-position: -180px 0; }\n\n.editor-mode--undo, .editor__menu--undo {\n  background-position: -200px 0; }\n\n.editor-mode--redo, .editor__menu--redo {\n  background-position: -220px 0; }\n\n.editor-mode--zen, .editor__menu--zen {\n  background-position: -240px 0; }\n\n.editor-mode--unzen, .editor__menu--unzen {\n  background-position: -260px 0; }\n\n.editor-mode--two, .editor__menu--two {\n  background-position: -280px 0; }\n\n.editor-mode--help, .editor__menu--help {\n  background-position: -300px 0; }\n\n.editor-mode .editor__menu--divider, .editor__menu .editor__menu--divider {\n  margin: 5px 4px;\n  width: 0;\n  height: 20px;\n  padding-left: 0;\n  padding-right: 0;\n  border-right: 1px solid #ddd;\n  text-indent: 110%;\n  white-space: nowrap;\n  overflow: hidden;\n  text-transform: capitalize; }\n\n.editor-mode--edit, .editor__menu--edit {\n  background-position: -320px 0; }\n\n.editor-mode--live, .editor__menu--live {\n  background-position: -340px 0; }\n\n.editor-mode--preview, .editor__menu--preview {\n  background-position: -360px 0; }\n\n.editor-help {\n  border-bottom: none;\n  background-color: #faf2cc;\n  font-size: 13px; }\n\n.editor-help .nav-tabs {\n  position: fixed;\n  top: 0;\n  width: 100%;\n  border-bottom: none;\n  background-color: #fcf8e3; }\n\n.editor-help .nav > li {\n  margin: 0; }\n\n.editor-help .nav > li > a {\n  margin: 0;\n  padding: 6px 10px;\n  border: none;\n  color: #8a6d3b;\n  border-radius: 0; }\n\n.editor-help .nav > li.active > a, .editor-help .nav > li > a:hover {\n  border: none;\n  background-color: #faf2cc;\n  color: #8a6d3b;\n  cursor: pointer; }\n\n.editor-help .nav > li.active > a {\n  font-weight: 700; }\n\n.editor-help-content {\n  margin-top: 30px;\n  padding: 10px; }\n\n.editor-help-content pre {\n  padding: 5px 8px;\n  border: none;\n  background-color: #fcf8e3;\n  font-size: 12px; }\n\n.editor-help-content code {\n  white-space: normal; }\n\n.widget-editor__wrap {\n  background: #f6f6f6;\n  border-top: 1px solid #ddd; }\n\n.widget-editor .widget-editor__help {\n  margin-top: 40px; }\n\n.wmd {\n  position: relative;\n  overflow: hidden;\n  background-color: #fff;\n  height: auto;\n  min-height: 420px;\n  padding: 0;\n  font-family: Helvetica Neue,Helvetica,Arial,PingFang SC,Hiragino Sans GB,WenQuanYi Micro Hei,Microsoft Yahei,sans-serif;\n  border-right: none;\n  -webkit-transition: width .3s ease;\n  transition: width .3s ease; }\n\n.wmd .wmd-input {\n  height: 100%;\n  min-height: 420px;\n  border: none; }\n\n.editor-line {\n  left: 50%;\n  height: 100%;\n  z-index: 105; }\n\n.editor-line, .editor-preview {\n  position: absolute;\n  top: 0;\n  border-left: 1px solid #ccc;\n  -webkit-transition: all .3s ease;\n  transition: all .3s ease; }\n\n.editor-preview {\n  padding: 10px 20px;\n  margin-top: 31px;\n  background-color: #f6f6f6;\n  bottom: 0;\n  z-index: 100;\n  overflow: auto;\n  overflow-x: hidden; }\n\n.editor-preview > p {\n  margin-top: 0; }\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap) {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
  var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

  return '/*# ' + data + ' */';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6).Buffer))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 10 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(12);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(11)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAvgAAAB4CAYAAACHDYYSAAAhFElEQVR42u2dC5AcVbmANwoanpfHRRQBIyhEBESw5HmBiAbwQsIj4ZXszizBWypqAYJSKlWrVQqphAT2PUs2aNSosQqkEKooX6ggqCivKgQRQSCKUtESVN7J/f/Znt0zvT09s9PndJ/u+b6qrt2d7ek+ffo8vj59Hl1dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN5QqVS2mBsxkiz+wvHY6O9W9wcAoJwtZrlIeQ8ACD6CDwCA4HNd2TE6Ovpko0osYntO9n9Ytu/J76f19fVtlXFk39hiuJ8ly0ESAXS1uS5o0g6flAlvkPLhKvnun3XT3/WzvBTUtj4HaOcB09fj+iZGrvKd6/w8MjLyXjn+sGx3Stn4uPx8QX4+LT9vl59rZDs2j/Vb0ni0fV5X9Zzt87ryg0mGh4ePkANdLtsToYM/JNt5kuAWSaI8S36/TH6/wdxH/v69/Nw7w8JyXwlbt/y8NSJyVC4ukes7rr+/f0+qFkDw3YcvkPstoXLiKgQfAMHvVMHXxlA57oaIe6Te9aiUka8Zn/1AtoMQfATf2o2/5pprdpcD/tuolH/UoAL/kGyvmAl0YGBgDw8Kzt8YYXpJxP+tVCfgWwuOrfP4KpZBy/20h+2sHzzyJvjNjttuReP6/q9evXonqR/W5zX/a9j1Gjq9fEHwrR93ZSgvfnNwcHDX2v9XrFixnaS9q+XzzYF//SUPDpNVw0ennddW4XZfM8EPLmYglFhXepDQHjHCfjOqCgg+go/gpyf4cvx5tS6fec7/wTXMQ/ARfItu9ZiRD2+L2e87hsf8Mutu0Ih2sQT/160Ivvzv1FDFcWeW4dYn4VCXgM+iqtEELWxjEk8XtrK/dnGS/e+Qnzs7LiiulPPcMjIycmCr35EwHabpVLuYdUoFnFXL7AzKkI7sopN214h2KxoX6aW/v/+NQQvl5rx3WTLuoV7LSr02l+nO1St938qXrLooenTcjbVjSx13Ylx9Gyo7T0LwOW+qgj80NHRIKBHekWW4JVMsCBUcx6DykfF0sr76C+LoH3HS3tfXN1v2rRiV9rUu5d5IS9oXcTzu9aT8b46+SjeFwpbkI/jJ6NRBtp0q+NpXWLYHijK7U8S9fMBmf2gEvzMFX8rBZXLcl/XY2h260X7a3dmMH6nrvozgc95UBV+fQEMZ9dqME9lys/+9yqmL8+hg3UAsN8YUsht1n6iBvUm/n/DeXmIM5PmT3MPTG+2rBZDse5eRFr7tqj+gKffG+f4uPw+N+c4xss/zEXF3uasMnJeKBIpBDgR/lhzn05IPX/T5gdOGiAbX+Gm9Zl/LgbTEJvPBgo4ejNJIv1qHBvXurLjGq1DaG0HwOW+qgq8z6oReZc7LOJH93Aj3L1zJvRx/0wwKiU2mpCf9frssXrz49XKs64z4WT80NLR9TAFzoD4ABPs+L9tCh/dtxnLvWvKTZlSJ23fphuBDUQVf0vdecowfZzmYNyOR/bFeO4KP4LtC6t/jQ/XhpQg+501N8FUO5f/PGPt9JcswB10CXjTCs8JR3KwPznFrXCEfVH631mTa1vcTJMgrjALjyrjWA3mg2FH2+WNtYKTO2euj3LuU/CQZVbtABQ+8m/V3F+cpmlBBMoGZ6fcslIPnavc+38XKofz9Q+OgUwXft3AVMN9fSR98zpuJ4MtnB8j/flVb9EoE8BMi2K/LOMxHhjLEQkc3ttqtppUWnEDSq91tbH2/zTAfbkxp+s0W4vLrwb6v6voIPsu9K8lvN6PqYLxgwZLa9TwdN0APwQcEH8FH8KFGMFXm34065K/a6Ibgc15bgb/HKMieCqbDHJCE9t1gsNHLOnWTbJ+MGyiSsuBfahbAkiF286GASzroKWmC0cJCvv+H2oNCs1lw5GHtnDTeytiUexeSn2CBp49GXNdHs67YWck234Jvu6LxtYuOL9Mo0kUHwc8IHdPy1dAA2+68llMIvoeYLfiy/Uv+/q0Kvfx+d60FWv7+Z7DS2udWrVq1iwcJ7EYjzI/4UsBlLfjBqP2aaH6hhf0fDPZ/2dVCLy7k3rbktxPvOldxsOx4+NoebzSPcVEFPy/TZCL4VoTE2iBbnwWfQbYIfgru1R9Kc+vzXE4h+J4LflQXHe1/L0+VFweSXx2EqdM4ZdlNR8LxNyPMa7OucG0JlAXB/6FxnsPj9g0G1tbi8K68yb1NyY+Ld307JP/7vm7mmyL5uxRzj0su7i8LXSWLt7S2Agt+7XhWpsn0WPCtTpOJ4NsJR7PpRm1/7jBe54bqaq0Xv+jiYRLRRvBbmkVncHBwP23hN/Ydyyi87wxljGUI/uT3nzJe9X1ex0voAmVRXavkf2caYdJuWhfJvr0qzLYe3lSyIwT/eZtrFgTTt74QcZ6P27jPuhCXccxb9DONH/n94Ub3V/8XFYcIPoJfBMEPHnwTL3TloeA7WegKwUfwjXNdZExdrdu9vg+qRfA7QPADmbo46+mcJAxlMwzDw8P7+1LAedBF58UGwvmf8L2K6j8easGa67vk25D7uHgPT18WPDgdL8c/u5nk6T4OWxhZybaA5EnwjWPPk3v9ZN4FP7iGeT7cZwS/0Hn82iB+npA0d0ZXTlrtEfwOEHyV6VBF/lQGies64/zP+lQQZy34Zgt+xLZZ5dSQ1zObSOq9FuPRuuTbkvsmGfj2iHjRz+5voSX3/nDhzUq2UDTBV3T8Tjv9h30RfA27qzFICD5ECb6kua8VrZxC8HMu+EHXhNdCLeg7p5y4HjLOf5Pjc+VqmkxzJdoG20ojbIc3k1SbK+valHybct8oo0a13s90k7yxgIrPnwqpaAvkFP2BpqhiyUJXCD6Cz3m9E3yRnjdFZOS3pBVWncHH7PMp4fmM47jJ1UJX8v3lTQrddca+27Ywt/WhljNKYsm3LfeNMmqD1vuZbr9C8BF8QPARfEDwOa/Xgh9u9dW+3WnOpiNyd0qoP/TRLs+nLdhynk0zKNQ2ma3eSb/fRvzMCb9hCW0Xhu791TH7Pif3draDzNK25LuQ+6iMaqP13tjmJy0QqEABwc+v4Dcb1GlLpH0rX/I2WD6ltHC5Tk+tMxEi+JzXK8EPC2HaT6HmtIs6oNT1bAc1SQ9a4jfGFA4bdZ8oOU/6/Tbu5ycbSP4D4X7Rg4ODu8Z06/mYy0JuppLvSu4bVMC326o0JHw/Q/ABEHwEH8Evcr5F8P28Wb8zZOTBRvsF02S+ZOz7WJrdc4Kw3t2o+wPUxdN8XR8gmILrPn0tuHz58h2i9tVWevn/FbLfzfLzUV3QTAfgptGSYQ4A1gecgYGBt8elP9nnBttyn2ZGTWuaTFayTVcMbM0H7/s0ngh+scsXX4/jOh4RfES7kIIfTPn3Wmge4E+ZK3FqRR0s6mP21/7z8PDwPimHNTzryzNpP2CAfcnXt0aSlg5r9TtDQ0NHyXfusCX3CH7xV7JF8BF8BB/Bz/r+BJOULNWxcsE0yrmbIhPBz4HgBy2hv4vpVqCrjd4TLObzqvE/XUH2Ch3smlJCukwHhjbqRhLM7/5TXdQJXYaiCqDvBYvvC12R/tzGoy/h8TV95aULDILv3LsuTasbbBrlS9J4tH1eV/nd9nmdl0NykFUz2L4UtOAfI2K/TZoVnw5EaTGMJTQVEHwEn/SH4CP4CL6P5amc47bQvbopz+ULgs9YEADwtCK32DLVUV10SJEA2eXjHAv+jaGy5FvcH64LAKjYWMkWwQdA8HMqcDrNt5SNrwTne0l+P4H7w3UBAAAAQL5lcW+d8tnmKvEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4Jbrrrvu/8yNGEkWf+F4bPR3q/sDAFDOFrNcpLwHAAQfwQcAQPC5ruwYGRlZ0qgSC2+jo6O9sp0t3znx+uuvn9PX1/e6LMNeqVTmtxj2HrIcJBFAV5vrgibt8G3YsOH1ki8Pl+8u1U1/18/yUlDb+hygnQdMX4/rmxi5yneu87OUh/8t2zFyjoXy8zz5uUycaqlsp46NjR0nn70lj/Vb0ni0fV5X9Zzt87ryAzNgu0vCOiRIbJMHls/OWrNmzTuGh4f3kf/tKwnwPWGhFtE/Ryrv7bMqLL/xjW/sODg4uJ+E9eSIyFHBOHhgYGCPoaGh7bsAEHzn4Qvkvu4Y+hmCD4Dgd6rga2OoeMoHI8rG8+Tzc+Sn+dn/invtguAj+DafLLeVhHa+IfinNLjAPUXsP2Im0BUrVmznQcF5hhGmC9atW7ddF4BnLTi2zuOrWAYP1tMetrN+8Mib4Dc7brsVjev739/f/8bR0dET8pr/Nex6DZ1eviD41o97RCgvfuD666+fbfjX1pL2jqyJvvhXdx4cJquGj047r63CbVEzwVfk6fLoUGI9woOwn210JToJVQUEH8FH8NMT/PHx8T1qXT7znP/1GvRaEHwE36KfnGvkww832s9s5Zd0eHrW3aAR7WIJ/hktCv7bQhXHwizDrU/Coe5Fh6Cq0QQtbMdKHL27lf21i5Psv9Blq1aQpt6vXa1m8mpSwrSbplOb99v3CjirltlW6dQuOml3jWi3onGRXnSMhTbymN0M8v6AH1zLEbbHj7Q6iDvpg69v5UtWXRQ9EvzJho+hoaG94upbM37Wrl27F4LPeVMVfB0oEhp8m6ngy5PuHDM8IvxvRuUj79ve+uovuL/lOGnv6+vbSh8EjFeGR7mUe7Ni1cFGca8nx8fHd9BX6aZQ2JJ8BD+57HXiINtOFXx9IJfjLSrK7E4R93KRzf7QCH5nCr6Ug3O163BQx23baD/t7hwa5/h+BJ/zpir4+gQaajE/Kstwm62GmolUTl2cRwfrqliaT+MRMw3piPgTogb2Jv1+woR5cE2IgwHVb4+Jz21lO60WpuHh4Q+66g9oyr1RqJX1IbLRd/QBTvY5P/w9G5Kft1foUExyIPizgjLlAp8fOG2IaHCNB+s1+1oOpCU2mQ8WdPRglEb61To0qHdnxTVemeGQuvd/EHzOm6rg64w6Zourq/6KrSJhXWCE5zRXci/HLrVaQOi+pqQn/X67aB8+kehjjQcIbfneOq5Frjajkkq0vh1xdd/akXvXkp80o0qBvLNuCD4UVfC1XNL6IcvBvFmIrF6zg4YXBL9DBL8V1KVCDX7vQfA5b2qCr3JY6+bhwyukoEvABa4H/KoYB/FyclwhH1R+J9dk2tb320Xi5tBa3KhQx7UeSFy+QfarDQZa2opoZyH3LiU/SUbVLlD6wBtse7s4T9GECpIJzEy/ZyHfvkO79/kuVq7Cp9eucdCpgu9buIpGuF6kDz7nTU3wtWVSPj+9tuiVyNWBW7ZsmZVxAts9JIlzHMXN0mCATNMWHN2n1t3G1vfbYd26dW8ypjT9QLP9Zd8PBPdev7O7z3LvSvKTLPBkdr3S3+P6niP4gOAj+Ag+GA1EW2s9aNQhPdrohuBzXheCv0Snw9RNPv+QDjbSlnKduknFPm6gSMphfo9ZAK9atWobHwq4pIOekiaY4E3LOTXZbDYLjjxUvCONtzI25d6F5Lcb7xLHB0SMpzgg64qdlWzzLfi2Kxpfu+j4Mo0iXXQQ/IzQMS3Hm+lNF/HMazmF4Psv+OfLdqYKvfZrr7VOast9sNLae/v6+mZ78NQ73xCqs30p4DwQ/LlGf/5DW9h/cW1AmaspMV3IvW3JbyfedZxDeCXo2mDmRvMYF1Xw8zJNJoJvRUisDbL1WfAZZIvgu0bqrqNDjUMn5LmcQvD9F/xTIirvrYeHhw9WyTcGYb4/y246+hrLkMXjs65wbQlU0gQjcTHZwqZddZqI9y6uBym7lHubkh8X7/p2SK7jJN3MN0Vy/P1iWv32c3F/WegqWbyltRVY8M2yY1GBBd/qNJkIvp1wNJtu1PbnrpA6ayezrg7k/n0uHiYRbQS/pVl0Vq9evZO28BsJ8tgswity+F+hlpa5CP6kdC4xW/C1W5UuUBbVtUoe2vYx7uUZss9B4+Pj+6sw23p4U8mOEPzzba5ZEEzfuixCst9t4z7XBj/XBkvrZxo/5irKEd10zo6KQwQfwS+C4Cs2FrryTfBdLXSF4CP4hr8cFFrL5UzfB9Ui+B0g+IEUHpz1dE4Shv1DC1zt5EsB50EXnQsaCOey8L2K6j9utmDZileXkm9D7uPiPTx9mW76mcTzvi1MebqvwxZGVrItIHkSfDOPSH5eknfB12tIa+pnBL9z0fWDQuvSzMrbNSD4BRV8lb6QSC1JO7zm/O6y9fhUEGct+GYLfoRw1a1dYLbgN+hmcqbFQs265NuS+7h4l7xxasTD0qmyLWom+LpPuPBmJVsomuArOn6nnf7Dvgi+ht3VGCQEHxoI/ryilVMIfs4FX7sdmK+XdEuzYAwyyFlGeE90HDe5mibTXIm2wTa5XoD20W8mqTZnj7Ap+TblvlFGjWq9n+kWnr6Vii/bCqloC+QU/YGmqGLJQlcIPoLPeb0T/A0bNmwT0TKc2tSZOoOP+YAhoneI47jJ1UJXUV0lQvdqslD5yU9+slWzua1tL3plQ/Jty32jjBrVet/G/NmnI/gIPiD4CD4g+JzXa8EPt/pq3+40Z9MZHBx8W6iF+c0uz6fiLRmx1GqBpvuaIp/0+zNlfHx8h/AbljgJlvt3ZEwXk155oNrKQQHXtuS7kPuojGqj9d7Y9kxaIFCBAoKfX8FvNqjTlkj7Vr7kbbB8SoJ/iE5P7XLdGQQfwW9L8MNCmPZTqDntog4oTaOfrwq3tqqbK5ZGyPBS3SdKzpN+f6YEC5JFDpwNx5dI9exG3XrWrl17gMtCbqaS70ruozKqjdZ7I3wLEHwABB/BR/CLnG8RfA8x+7Trk2Wj/XSaTHOWFpGgc9Ne2daU0XD3B6hLeHvq+gA6UFYHe+prwb6+vsjlr7WVXqfUlP1O0lVwdUEzHYCbRkuGOQA4GOi2Y5P0N9+23KeZUdOaJpOVbNMVA1vzwfs+jSeCX+zyxdfjuI5HBB/RLqTgB1P+1c20smbNmgPNlTi1otaFe0L9tZfGyZgLwrO+SHi6037AAPuSr2+NJC3t1up3tFuWPAwstCX3CH7xV7JF8BF8BB/Bz/r+BOunvFPLxmAa5dxNkYng50DwtSXUbLmPWm1Uu+7ogj2y30eMVvsebe3Vwa5phFPnbtduQI26kegYABH/BRomdBmKKoC+Fyy+L3RF+nMbj76Ex9f0lZcuMAi+e59JqxtsGuVL0ni0fV5X+d32eZ2XQ9qXvtVtfHz8fdqCr/2jXQy6jEMHorQSRg0fmgoIPoJP+kPwEXwE38fyVM7x4VAvhBPzXL4g+IwFAQBPK3JbdFoXHVIkQHb5OK+CHx5DlmRK7E66P1wXACD4GdFpg2xJkQAI/kzRab5HRkY+UpsFUH5/K/eH6wIAAACAHLNhw4btdcpnm6vEAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBjxnq31G2QLP7C8djo71b3BwCgnC1muUh5DwAIPoIPAIDgc13ZUSk/2bASm74911XpfbhrrPw9+d5pXX3Hb5Vx2G9sKdyV3mfJcZBIAF1trguatMPXt/gNUj5cJXnzz9VNf9fP8lJQ2/ocoJ0HTF+P65sYucp3rvPzSM97xUeGpWy8U7bHpXx8QX4+LZ/dLr+v6RotHZvL+i1pPNo+r6t6zvZ5XfnBJMPlIySBXS4HeyJ08Ifk8/O6RnsWdY2UzpLfL5PPbqgX5/Lvuyo9e2cn+KV9JVN0S+a4dbrUi1yMli/pGus+rqt/yZ7ULIDgpxA+Ffppx5HPEHwABL9TBV8bQyvlDRH3SL3rUXGY14wGyR/Ivgch+Ai+vRt/zbm7S8L6t1Ep/yhyv9Hyh2S/V+oS6MA5e2RecFbKvzHC/pI8Kb+V2gS8a8GxdR5fxbLaah/xsJ31g0feBL/ZcdutaFyzuryTnGd9jvP/+uo1dHr5guBbLhd7V4bKxG92DfbsOvn/Fd3bibdcLdvm4P9/yYXDZNXw0WnntZQI72sq+NX9SgOhLjArs09o5UeMMN2MqQKCj+Aj+CkKfqVn3mSXzzznf70GvRYEH8G351aPGeXhbTHn/47hYL/MvBs0ol0owf91S4I/Wj41VIHfmWm49UnYDM9o+bOYagOqLWzlMXlIu7C1BN19nOx/R9fweTs7FsMr5Ty3dI10H9jyd4ZLh1XTqXYx65QKOKuW2dYftDuzi07aXSParWhcpJf+k9840UIZtD7mXfAn0uzm6jXptblMd65e6ftWvmTVRdGf426cPPZI74nx9W2dy5yE4HPedAV/qHxIqAK/I9tEVlpQ/8DRcwwmHxVPPSdXX/1N3LN/xEp7X3m2pIfK1CvD3mvdyv3k26DX5O/x2NeTI+U51VfpplDYknwEPxmdOsi2UwVf+wpXyg8UZnan6W+fHrDaHxrB70zBHy0tk7rt5eqxtTt0I7S7c336+zKCz3nTFXx9Aq3vonNtxuFeXtf/XuXUBTpYtyqWxtP49G1jdZ+ogb1Jv5+ogClfMjmQp1L+kwj06Q331QJorHyXUch821l/QFPup873dwnroY2/Iw9wld7nI753ubMMnJeKBAryMO694M/qqpQ+LfnwRa8fOG2IqF6jXqtes6/lQFpik/lgQUcPRmmkX61DJ+rdWU0ar8zG0xEEn/OmK/gTM+oYrzId9VdsPdw/NwrjXziU+00zKCQ21Ul60u+3y+LFr5fK6TrjuOu7hhZv37iA6T6w+gAwEZfPd432LnR339qQe9eSnzSjDnW/q7oh+FBUwR/q3Uvy3o8zHcybhcjqNeu1I/gIvitGyseHwnIpgs950xN8lcOx3mem+oiVvpJpmPX1v9mKNFpa4ejGrg8K+VtjC/mJyu/WSZm29f32JfoKQ36vjG096F+yo9z3P04OjNQ5e32Ue5eSnySjaheoarch3eR3F+cpmlBBMoGZ6feSMlo6t9q9z3exciZ/cu0aB50q+L6Fq2iE60X64HPe1AR/dMkBkgB/ZSx69Ymuvq7XZRrm0Z4j6zOEoxbnWreaVlpwdJ9adxtb32/rfnYfPjmlqU7L1fz+fz24969W10fwWe5dSX67GbU60LD8tHH+p2MH6CH4gOAj+Ag+1NCpMrUenKpD/lptdEPwOa+dwJfvMQqzp6rTYU5MifndicFGOkik/Et5qvxk7ECRdBPYpXUFcP/i3bwo4JIOekqaYCYKiz9MPig0mwVnrHxOKm9lbMq9C8lvN95Hyx+ddn79LOuKnZVs8y34tisaX7vo+DKNIl10EPxsmCXl5VdDD5PduS2nEHwPqW/B/5f8/duq0Fd6755sga6U/xmstPa5rlWLd8k+zOUbjTA/4k0Bl7Xg66j9qbcaX2jh3j8YVGIvO1voxYXc25b8duJ9YpXCxyPO/XjDeYyLKvh5mSYTwbcgJBYH2fos+AyyRfCd5/dyfyjdrc91OYXgey/407voaP/7SuniquTXBmHqNE5ZdtMZ6/2bURCvzbzCtSVQSRNMpfzDqXjpPjx2Xx1YO3Xf78qd3NuU/Lh417dDlfL3q5v5pqjSW4pp9Ss5ub8sdJUs3tLaiiv4tfttZ5pMXwXf9jSZCL6dcDSbbtT25+7Ky7l1dfVEg9wXnTxMItoIfkuz6Az27Fdt4Z/adyyT8I6W31mfMUrLEPzJ7z81VUmVPl8dL6ELlEV1rRornWncy3ukwLlI4rK3Ksy2Ht5UsqfL7/NW1yyoTt9afiGiBfnjVu6zLsQ1dcxbqp9p/FR6H44R/Icj4xDBR/CLIPjVB18LC115J/iOFrpC8BH8qbLyosmpqyfS3L3eD6pF8DtA8Kv7li7OfDqnkXK5LgzDS/f3poDLuotOo1fnlfJ/pt2rqP7j9S1Yc72XfBtyHxfv06cv21L9bLT37KaSp/u4amFkJdtikifBn8zfPfMkjz+Ze8HXa0hr6mcEv3PR9YMm4ucJqYPP6MpLqz2C3wGCrzJdX5E/lX54jfndK73PelUQZy34Zgv+dOHaXJXTyX3NFvzI/e+12GphX/JtyX1cvFd6b48It3xWvr+FmTfun1Z4s5ItFE3wFR2/007/YX8Ef72zMUgIPkQL/tcKV04h+DkX/ImuCa/Vt6A3manFfmQ/ZMjWTY7Pla9pMs2VaKO7jqycuu/dhzeVVJsr69qUfJty3yijRrXez3grLaDi86hCKtoCOUV/oCmqWLLQFYKP4HNe7wR/pPtN0yVt6VtSC6vO4GP2+ayUPuM4IedroatK7/J4wS+vm9r31G2bzm1tczCsLcm3LfeNMmpU6/1MN10/AsFH8AHBR/ABwee8Xgt+uNVX+3anOZvOSM8p9f2hS0c7PZ+2YI/1bppBobaprtU76fdnHD/lOdPesNTdr9KF9Qm0fHVMWJ7r6ivPtp/eEki+C7mPyqhWWu8n43x+4gKBChQQ/PwKfrNBnbZE2rfyJW+D5VPxLan/dHpqnYkQwee8Xgn+dCFM9ynUnHZRB5S6nu1gStLXT3a3id42VveJkvOk358puiBZlOTrwNlwv+jBnl0bduuplD7mtJCbqeS7kvuojGqj9X4qfD9D8AEQfAQfwS90vkXwfRT88u8MyXqw4X4T02S+ZOz7WKrdcybE6+6G3R/AiKfS/Or6ADpQttJ7X/W14PIFO0Tuq630lfIVEqc3y/ZodUEzHYCbRkuGOQBYH3AGut8en/56b7Au92lm1LSmyWQl23TFwNZ88L5P44ngF7t88fU4ruMRwUe0Cyn42hWhfk7WzSKHn6pbiVMr6uqiPkZ/ba3Eh8/bJ91ENW3Wl2dSf8AAB5Jf/lHXcOmwGWS2o+Q7d1iTewS/+CvZIvgIPoKP4Gd9f7Q782jv0upYuYlplPM3RSaCnwPB15ZQs+U+arXR6uJHuphP+VXjf3+rtvbqYNd0BPCy6sDQht1Iyv+R7afVRZ0AiiqAvhcsvi90RfpzG4++hMfX9JWXLjAIvut8fmlq3WDTKF+SxqPt87rK77bP67wcqvSuan0rf6nagq/9o1ct3iZlcfhyi+EsYamA4CP4pD8EH8FH8L0sTyvl20Ljzm7KdfmC4DMWBAA8rcitha/DuugAQHb5OL+Cf2OoEeRb3B+uCwCo2FjJFsEHoBzMq8DpNN+V3leCBpCXukZLJ3B/uC4AAAAAyDOVnr2rUz7bXCUeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgiPw/PzHaNf0IqRAAAAAASUVORK5CYII="

/***/ }),
/* 15 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
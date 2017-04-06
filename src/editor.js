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

require('./style.scss');

let Markdown = require('./md.converter.js');
require('./md.editor.js')(Markdown);
require('./md.extra.js')(Markdown);
require('./md.sanitizer.js')(Markdown);

var Editor, goEdit, goLive, goPreview, toggleBig;

Editor = function (options) {
    options           = $.extend({
        toolbar  : Editor.toolbar,
        statusbar: true,
        status   : Editor.statusbar
    }, options);
    this.options      = options;
    this.converter    = null;
    this.isBig        = false;
    this.isLive       = false;
    this.originHeight = 420;
};


/**
 * Toggle big of the editor.
 */

toggleBig = function (editor) {
    var cancel, goBig;
    goBig  = function () {
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
    var _localContentKey, _localTagsKey, _localTitleKey, converter, editor, endDrag, iLastMousePos, iMin, mousePosition,
        options, performDrag, resizeHtml, self, sfLinkEnteredCallback, startDrag, staticOffset, textarea;
    startDrag     = function (e) {
        var iLastMousePos, staticOffset;
        iLastMousePos = mousePosition(e).y;
        staticOffset  = textarea.height() - iLastMousePos;
        textarea.css('opacity', 0.3);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
    };
    performDrag   = function (e) {
        var iLastMousePos, iMousePos, iThisMousePos;
        iThisMousePos = mousePosition(e).y;
        iMousePos     = staticOffset + iThisMousePos;
        if (iLastMousePos >= iThisMousePos) {
            iMousePos -= 5;
        }
        iLastMousePos = iThisMousePos;
        iMousePos     = Math.max(iMin, iMousePos);
        textarea.height(iMousePos + 'px');
        if (iMousePos < iMin) {
            endDrag(e);
        }
        return false;
    };
    endDrag       = function () {
        var iLastMousePos, staticOffset, textarea;
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea = $('.wmd-input');
        textarea.css('opacity', 1);
        textarea.focus();
        textarea      = null;
        staticOffset  = null;
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
            text    = $(el).val();
            cur     = $(el)[0].selectionStart;
            reg     = new RegExp('^(.{' + cur + '})', 'g');
            text    = text.replace(reg, '$1' + insText);
            $(el).val(text);
        }
    };
    this.element          = $(el)[0];
    options               = this.options;
    self                  = this;
    converter             = new Markdown.getSanitizingConverter;
    Markdown.Extra.init(converter);
    editor = new Markdown.Editor(converter);
    editor.run(el.slice(1));
    this.converter      = converter;
    this.pagedownEditor = editor;
    editor.hooks.chain('onPreviewRefresh', function () {
    });
    if (options.toolbar !== false) {
        this.createToolbar();
    }
    resizeHtml = '<a class="editor__resize" href="javascript:void(0);">调整高度</a>';
    $('.editor').after(resizeHtml);
    staticOffset  = void 0;
    iLastMousePos = 0;
    iMin          = 32;
    textarea      = $('.wmd-input');
    $('.editor__resize').on('mousedown', startDrag);
    $(window).scroll(function () {
        var _editorTop, _scrollTop, _top, _width;
        if (!self.isBig) {
            _width     = $('.editor').width();
            _top       = $('.editor').offset().top;
            _scrollTop = $(this).scrollTop();
            _editorTop = 62 + $('.editor-help .tab-content').height();
            if (_scrollTop >= _top) {
                $('.editor-help-content.active').removeClass('active');
                $('.editor__menu').css({
                    position : 'fixed',
                    top      : 0,
                    'z-index': 1000,
                    width    : _width
                });
                $('.editor-help').css({
                    position : 'fixed',
                    top      : '31px',
                    'z-index': 1000,
                    width    : _width
                });
            } else {
                $('.editor__menu, .editor-help').css({
                    position: 'static',
                    width   : 'auto'
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
        _localTitleKey   = 'autoSaveTitle_' + location.pathname + location.search;
        _localTagsKey    = 'autoSaveTags_' + location.pathname + location.search;
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
    self             = this;
    toolbarRightHtml = '<li class="pull-right"><a class="editor__menu--preview" title="预览模式"></a></li><li class="pull-right"><a class="editor__menu--live" title="实况模式"></a></li><li class="pull-right"><a class="editor__menu--edit" title="编辑模式"></a></li><li class="pull-right editor__menu--divider"></li><li id="wmd-zen-button" class="pull-right" title="全屏"><a class="editor__menu--zen"></a></li>';
    toolbarRight     = $(toolbarRightHtml);
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
    helpHtml  = _helpHead + '<body style="background-color:#FAF2CC"><div class="editor-help"><ul class="editor-help-tabs nav nav-tabs" id="editorHelpTab" role="tablist">    <li rel="heading"><a href="#editorHelpHeading" role="tab" data-toggle="tab">标题 / 粗斜体</a></li>    <li rel="code"><a href="#editorHelpCode" role="tab" data-toggle="tag">代码</a></li>    <li rel="link"><a href="#editorHelpLink" role="tab" data-toggle="tag">链接</a></li>    <li rel="image"><a href="#editorHelpImage" role="tab" data-toggle="tag">图片</a></li>    <li rel="split"><a href="#editorHelpSplit" role="tab" data-toggle="tag">换行 / 分隔符</a></li>    <li rel="list"><a href="#editorHelpList" role="tab" data-toggle="tag">列表 / 引用</li></a>    <li class="pull-right"><a href="http://segmentfault.com/q/1010000000187808" target="_blank">高级技巧</a></li>    </ul><div class="tab-content"><!-- 粗斜体、标题 --><div class="editor-help-content tab-pane fade" id="editorHelpHeading" rel="heading"><p>文章内容较多时，可以用标题分段：</p><pre>## 大标题 ##\n### 小标题 ###</pre><p>粗体 / 斜体</p><pre>*斜体文本*    _斜体文本_\n**粗体文本**    __粗体文本__\n***粗斜体文本***    ___粗斜体文本___</pre></div><!-- end 粗斜体、标题 --><!-- 代码 --><div class="editor-help-content tab-pane fade" id="editorHelpCode" rel="code"><p>如果你只想高亮语句中的某个函数名或关键字，可以使用 <code>`function_name()`</code> 实现</p><p>通常我们会根据您的代码片段适配合适的高亮方法，但你也可以用 <code>```</code> 包裹一段代码，并指定一种语言</p><pre>```<strong>javascript</strong>\n$(document).ready(function () {\n    alert(\'hello world\');\n});\n```</pre><p>支持的语言：<code>actionscript, apache, bash, clojure, cmake, coffeescript, cpp, cs, css, d, delphi, django, erlang, go, haskell, html, http, ini, java, javascript, json, lisp, lua, markdown, matlab, nginx, objectivec, perl, php, python, r, ruby, scala, smalltalk, sql, tex, vbscript, xml</code></p><p>您也可以使用 4 空格缩进，再贴上代码，实现相同的的效果</p><pre><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i>def g(x):\n<i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i>yield from range(x, 0, -1)\n<i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i>yield from range(x)</pre></div><!-- end 代码 --><!-- 链接 --><div class="editor-help-content tab-pane fade" rel="link" id="editorHelpLink"><p>常用链接方法</p><pre>文字链接 [链接名称](http://链接网址)\n网址链接 &lt;http://链接网址&gt;</pre><p>高级链接技巧</p><pre>这个链接用 1 作为网址变量 [Google][1].\n这个链接用 yahoo 作为网址变量 [Yahoo!][yahoo].\n然后在文档的结尾为变量赋值（网址）\n\n<i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i>[1]: http://www.google.com/\n<i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i>[yahoo]: http://www.yahoo.com/</pre></div><!-- end 链接 --><!-- 图片 --><div class="editor-help-content tab-pane fade" id="editorHelpImage" rel="image"><p>跟链接的方法区别在于前面加了个感叹号 <code>!</code>，这样是不是觉得好记多了呢？</p><pre>![图片名称](http://图片网址)</pre><p>当然，你也可以像网址那样对图片网址使用变量</p><pre>这个链接用 1 作为网址变量 [Google][1].\n然后在文档的结尾位变量赋值（网址）\n\n<i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i>[1]: http://www.google.com/logo.png</pre></div><!-- end 图片 --><!-- 换行、分隔符 --><div class="editor-help-content tab-pane fade" id="editorHelpSplit" rel="split"><p>如果另起一行，只需在当前行结尾加 2 个空格</p><pre>在当前行的结尾加 2 个空格<i class="nbsp">&nbsp;</i><i class="nbsp">&nbsp;</i>\n这行就会新起一行</pre><p>如果是要起一个新段落，只需要空出一行即可。</p><p>如果你有写分割线的习惯，可以新起一行输入三个减号 <code>-</code>：</p><pre>---\n</pre></div><!-- end 换行、分隔符 --><!-- 列表、引用 --><div class="editor-help-content tab-pane fade" id="editorHelpList" rel="list"><p>普通列表</p><pre>-<i class="nbsp">&nbsp;</i>列表文本前使用 [减号+空格]\n+<i class="nbsp">&nbsp;</i>列表文本前使用 [加号+空格]\n*<i class="nbsp">&nbsp;</i>列表文本前使用 [星号+空格]</pre><p>带数字的列表</p><pre>1.<i class="nbsp">&nbsp;</i>列表前使用 [数字+空格]\n2.<i class="nbsp">&nbsp;</i>我们会自动帮你添加数字\n7.<i class="nbsp">&nbsp;</i>不用担心数字不对，显示的时候我们会自动把这行的 7 纠正为 3</pre><p>引用</p><pre>&gt;<i class="nbsp">&nbsp;</i>引用文本前使用 [大于号+空格]\n&gt;<i class="nbsp">&nbsp;</i>折行可以不加，新起一行都要加上哦</pre></div><!-- end 列表、引用 --></div></div><script>$("#editorHelpTab a").eq(0).tab("show");$("#editorHelpTab a").click(function (e) {    var _$wrap = $(this).parent();    if(! _$wrap.hasClass("pull-right")) {        e.preventDefault();        $(this).tab("show");    }});</script></body>';
    win       = null;
    $('#wmd-help-button').click(function () {
        if (!win || !win.window) {
            win = window.open('', 'Markdown Help', 'channelmode=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=505, height=400, top=100, left=100');
            win.document.write(helpHtml);
        } else {
            win.focus();
        }
    });
};

window.Editor = new Editor;
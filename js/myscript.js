"use strict";
(() => {
    let canvasId = 1;
    let canvas = document.getElementById(canvasId);
    let color = "black";
    let tabLinks = [];
    let canvasDivs = [];
    let tabsNum = 1;
    let drawShape = 'box-draw';

    let main = () => {
        $(window).on('load', () => { init() });
        addListeners();
        setCanvasSize();
        setCanvasSliderMax();
    }

    function init() {
        // Grab the tab links and content divs from the page
        let tabListItems = document.getElementById('tabs').childNodes;
        for (let i = 0; i < tabListItems.length; i++) {
            if (tabListItems[i].nodeName == "LI") {
                let tabLink = getFirstChildWithTagName(tabListItems[i], 'A');
                if (tabLink != undefined) {
                    let id = getHash(tabLink.getAttribute('href'));
                    tabLinks[id] = tabLink;
                    canvasDivs[id] = document.getElementById(id);
                }
            }
        }
        // Assign onclick events to the tab links, and
        // highlight the first tab

        for (var id in tabLinks) {
            tabLinks[id].onclick = showTab;
            tabLinks[id].onfocus = function () { this.blur() };
            if (id == canvasId) tabLinks[id].className = 'selected';
        }

        for (var id in canvasDivs) {
            if (id != canvasId) canvasDivs[id].className = 'canvas hide';
        }
    }

    function showTab(e, id) {
        id = (typeof id !== 'undefined') ? id : getHash(this.getAttribute('href'));

        let selectedId = id;
        canvasId = selectedId;
        canvas = document.getElementById(canvasId);

        // Highlight the selected tab, and dim all others.
        // Also show the selected content div, and hide all others.
        for (var id in canvasDivs) {
            if (id == selectedId) {
                tabLinks[id].className = 'selected';
                canvasDivs[id].className = 'canvas';
            } else {
                tabLinks[id].className = '';
                canvasDivs[id].className = 'canvas hide';
            }
        }

        // Stop the browser following the link
        return false;
    }

    function getFirstChildWithTagName(element, tagName) {
        for (var i = 0; i < element.childNodes.length; i++) {
            if (element.childNodes[i].nodeName == tagName) return element.childNodes[i];
        }
    }

    function getHash(url) {
        var hashPos = url.lastIndexOf('#');
        return url.substring(hashPos + 1);
    }

    function canvasListener() {
        canvas.addEventListener("mousedown", (ev) => {
            if (ev.button == 0) {
                draw(ev);
                let drawFunc = (e) => { draw(e) };
                canvas.addEventListener("mousemove", drawFunc);
                document.body.addEventListener("mouseup", () => { canvas.removeEventListener("mousemove", drawFunc) });
            }
        });
    }

    let addListeners = () => {
        canvasListener();
        let colorPicker = $('#colorPicker');
        colorPicker.on('change', () => {color = `#${colorPicker.val()}`})
        let $btn = $('#clear');
        $btn.click(clearCanvas);
        let $btnEraser = $('#eraser');
        $btnEraser.click(function () { color = "white" });
        $(window).resize(function () { hideOutOfCanvas(); setCanvasSliderMax(); });
        $('#canvasSize').on('input', setCanvasSize);
        let addTabBtn = $('#addTab');
        addTabBtn.click(addCanvas);
        let saveBtn = $('#save');
        saveBtn.click(save);
        let loadBtn = $('#load');
        loadBtn.click(load);
        let helpBtn = $('#help');
        helpBtn.click(helpModal);
        $('#link1').on('auxclick' , function(e) {
                e.preventDefault();
                closeTab(e);
        });
        
        $('#square').click(() => {drawShape = 'box-draw'});
        $('#circle').click(() => {drawShape = 'box-draw circle'})
        document.body.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        })

    }

    let modal = (function () {
        let method = {},
            $overlay,
            $modal,
            $content,
            $close;

        // Appending the modal HTML
        $overlay = $('<div id="overlay"></div>');
        $modal = $('<div id="modal"></div>');
        $content = $('<div id="content"></div>');
        $close = $('<a id="close" href="#">close</a>');

        $modal.hide();
        $overlay.hide();
        $modal.append($content, $close);

        $(document).ready(function () {
            $('body').append($overlay, $modal);
        });
        // Center the modal in the viewport
        method.center = function () {
            var top, left;

            top = Math.max($(window).height() - $modal.outerHeight(), 0) / 2;
            left = Math.max($(window).width() - $modal.outerWidth(), 0) / 2;

            $modal.css({
                top: top + $(window).scrollTop(),
                left: left + $(window).scrollLeft()
            });
        };

        // Open the modal
        method.open = function (settings) {
            $content.empty().append(settings.content);

            $modal.css({
                width: settings.width || 'auto',
                height: settings.height || 'auto'
            })

            method.center();

            $(window).bind('resize.modal', method.center);

            $modal.show();
            $overlay.show();
        };

        // Close the modal
        method.close = function () {
            $modal.hide();
            $overlay.hide();
            $content.empty();
            $(window).unbind('resize.modal');
        };

        $close.click(function (e) {
            e.preventDefault();
            method.close();
        });

        return method;
    }());

    function clearCanvas() {
        while (canvas.firstChild) {
            canvas.removeChild(canvas.firstChild);
        }
    };

    function save() {
        let saveForm = "<label for='saveName'>Save by name: &nbsp;</label><input type='text' id='saveName'><br><button class=button id='saveNameBtn'>Save</button>"
        modal.open({ content: $(saveForm)});
        $('#saveNameBtn').click(() => {            
            let drawnDivs = $(`#${canvasId}`).html();
            let nameToSave = $('#saveName').val();
            if (nameToSave != "") {
                localStorage.setItem(nameToSave, JSON.stringify(drawnDivs));
                modal.close();
                $(`#link${canvasId}`).text(nameToSave);
            } else {
                alert('Cannot save with an empty name')
            }
        })
    }

    function load() {
        let savedDivs = [];
        let chosenSave;
        let str = "<h3>Click on the save you want to load: </h3><ol>"
        Object.keys(localStorage).forEach(function (key) {
            savedDivs.push(key);
            str += `<li class="clickable" id="key:${key}">${key}</li>`
        })
        str += "</ol> <br> <button class='button' id='deleteSaves'>Delete all saves</button>"
        modal.open({ content: $(str)});
        $('#deleteSaves').click(() => {localStorage.clear(); modal.close();});
        for (let key of savedDivs) {
            document.getElementById(`key:${key}`).addEventListener('click', function() {
                chosenSave = JSON.parse(localStorage.getItem(this.innerHTML));
                clearCanvas();
                $(`#${canvasId}`).append(chosenSave);
                modal.close();
                $(`#link${canvasId}`).text(this.innerHTML);
            });
        }
        hideOutOfCanvas();
    }

    function helpModal() {
        let str = "<h3>Need help?</h3><p>Use the mouse cursor to paint in the canvas. <br>You can choose the canvas size using the slider at the bottom. <br>Press Add New Canvas to open a tab with a new canvas. <br> You can close a canvas by pressing the right or middle mouse button on the tab.<br>You can save your drawing using the save button and load old saves using the load button.</p><br><h4>This paint was created by Yaniv Barzily for the purpose of ITC Bootcamp course</h4>";
        modal.open({content: $(str)});
    }

    function addCanvas() {
        tabsNum++;
        if (tabsNum < 6) {
            $('#tabs').append(`<li><a href="#${tabsNum}" id="link${tabsNum}">Canvas #${tabsNum}</a></li>`);
            $('.wrapper').append(`<div class="canvas hide" id=${tabsNum}></div>`);
            init();
            showTab(undefined, tabsNum);
            setCanvasSize();
            canvasListener();
        } else {
            alert('Sorry, maximum of 5 tabs. ')
        }
        $(`#link${tabsNum}`).on('auxclick' , function(e) {
                e.preventDefault();
                closeTab(e);
        })
    }

    function closeTab(e) {
        let closedCanvas = getHash(e.target.getAttribute('href'));
        $(e.target).remove();
        $(`#${closedCanvas}`).remove();
    }

    function setCanvasSliderMax() {
        let $slider = $('#canvasSize');
        $slider.attr('max', () => { return $(window).width() > $(window).height() ? $(window).width() - 160 : $(window).height() - 50; })
    }

    function setCanvasSize() {
        let $canvasSlider = $('#canvasSize');
        let newCanvasSize = parseInt($canvasSlider.val());
        let currentPos = getCanvasPos();

        if ((currentPos.top + newCanvasSize) < ($(window).height() - 39)) {
            canvas.style.height = `${newCanvasSize}px`;
        }
        if ((currentPos.left + newCanvasSize) < ($(window).width() - 5)) {
            canvas.style.width = `${newCanvasSize}px`;
        }

        hideOutOfCanvas();
    }

    function hideOutOfCanvas() {
        let divs = getDrawnBoxes();
        let rectPos = getCanvasPos();
        for (let i = 0; i < divs.length; i++) {
            let divPos = divs.eq(i).offset();
            let divSize = divs.eq(i).width();
            if (divPos.top < rectPos.top || (divPos.top + divSize) > rectPos.bottom || divPos.left < rectPos.left || (divPos.left + divSize) > rectPos.right) {
                divs.eq(i).css('visibility', 'hidden');
            } else {
                divs.eq(i).css('visibility', 'visible');
            }
        }
    }

    function getDrawnBoxes() {
        let divs = $(`#${canvasId}`).children();
        return divs;
    }

    function getCanvasPos() {
        let canvasPosition = canvas.getBoundingClientRect();
        return canvasPosition;
    }

    let getDrawSize = () => {
        let size = document.getElementById("size");
        return size.value + "px";
    }

    let draw = (eVar) => {
        let x = eVar.clientX;
        let y = eVar.clientY;
        let box = document.createElement("div");
        box.className = `${drawShape}`;
        box.style.backgroundColor = color;
        box.style.top = `${y}px`;
        box.style.left = `${x}px`;
        box.style.height = getDrawSize();
        box.style.width = getDrawSize();
        reachedEndOfCanvas(x, y) ? null : canvas.append(box);

    }

    let reachedEndOfCanvas = (x, y) => {
        let drawSize = parseInt(getDrawSize());
        let rectSize = getCanvasPos();
        return (x + drawSize > rectSize.right) ? true :
            (y + drawSize > rectSize.bottom) ? true :
                (x < rectSize.left) ? true :
                    (y < rectSize.top) ? true :
                        false;
    }


    main();

})(window)
"use strict";
(() => {
    let canvasId = 1;
    let canvas = document.getElementById(canvasId);
    let color = "black";
    let tabLinks = [];
    let canvasDivs = [];
    let tabsNum = 1;

    let main = () => {
        $(window).on('load', () => { init() })
        addListeners();
        setCanvasSize();
        setCanvasSliderMax();
    }

    function init() {
        // Grab the tab links and content divs from the page
        var tabListItems = document.getElementById('tabs').childNodes;
        for (var i = 0; i < tabListItems.length; i++) {
            if (tabListItems[i].nodeName == "LI") {
                var tabLink = getFirstChildWithTagName(tabListItems[i], 'A');
                var id = getHash(tabLink.getAttribute('href'));
                tabLinks[id] = tabLink;
                canvasDivs[id] = document.getElementById(id);
            }
        }
        // Assign onclick events to the tab links, and
        // highlight the first tab
        // var i = 0;

        for (var id in tabLinks) {
            tabLinks[id].onclick = showTab;
            tabLinks[id].onfocus = function () { this.blur() };
            if (id == canvasId) tabLinks[id].className = 'selected';
            // i++;
        }

        // Hide all content divs except the first
        // var i = 0;

        for (var id in canvasDivs) {
            if (id != canvasId) canvasDivs[id].className = 'canvas hide';
            // i++;
        }
    }

    function showTab(e, id) {
        id = (typeof id !== 'undefined') ? id : getHash(this.getAttribute('href'));

        console.log('showTabs works ID: ' + id);
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
        let dots = $('dot');
        dots.click(() => { color = event.target.id });

        let $btn = $('#clear');
        $btn.click(function () {
            while (canvas.firstChild) {
                canvas.removeChild(canvas.firstChild);
            }
        });
        let $btnEraser = $('#eraser');
        $btnEraser.click(function () { color = "white" });
        $(window).resize(function () { hideOutOfCanvas(); setCanvasSliderMax(); });
        $('#canvasSize').on('input', setCanvasSize);
        let addTabBtn = $('#addTab');
        addTabBtn.click(addCanvas);

    }

    function addCanvas() {
        tabsNum++;
        console.log("addBtn event works")
        $('#tabs').append(`<li><a href="#${tabsNum}" id="link${tabsNum}">Canvas #${tabsNum}</a></li>`);
        $('.wrapper').append(`<div class="canvas hide" id=${tabsNum}></div>`);
        init();
        showTab(undefined, tabsNum);
        setCanvasSize();
        canvasListener();
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
        console.log("resize event works!")
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
        let divs = $(`#${canvasId} .box-draw`);
        return divs;
    }

    function getCanvasPos() {
        let canvasPosition = canvas.getBoundingClientRect();
        console.log(`getting rect size: ${canvasPosition}`)
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
        box.className = `box-draw ${color}`;
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
"use strict";
(() => {
    let canvas = document.getElementById("canvas");
    let color = "black";


    let main = () => {
        addListeners();
        setCanvasSize();
        setCanvasSliderMax();
    }

    let addListeners = () => {
        canvas.addEventListener("mousedown", (ev) => {
            if (ev.button == 0) {
                draw(ev);
                let drawFunc = (e) => { draw(e) };
                canvas.addEventListener("mousemove", drawFunc);
                document.body.addEventListener("mouseup", () => { canvas.removeEventListener("mousemove", drawFunc) });
            }
        });
        let dots = $('dot');
        dots.click(() => { color = event.target.id });

        let $btn = $('#clear');
        $btn.click(function () {
            while (canvas.firstChild) {
                canvas.removeChild(canvas.firstChild);
            }});
        let $btnEraser = $('#eraser');
        $btnEraser.click(function() { color = "white"});
        $(window).resize(function() {hideOutOfCanvas(); setCanvasSliderMax();});
        $('#canvasSize').on('input', setCanvasSize);

    }

    function setCanvasSliderMax() {
        let $slider = $('#canvasSize');
        $slider.attr('max', () => {return $(window).width() > $(window).height() ? $(window).width() - 160 : $(window).height() - 50;})
    }

    function setCanvasSize() {
        let $canvasSlider = $('#canvasSize');
        let newCanvasSize = parseInt($canvasSlider.val());
        let currentPos = getCanvasPos();
        
        if ((currentPos.top + newCanvasSize) < ($(window).height() - 5)) { 
            canvas.style.height = `${newCanvasSize}px`;
        } 
        if ((currentPos.left + newCanvasSize) < ($(window).width() -5)) {
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
        let divs = $('.box-draw');            
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
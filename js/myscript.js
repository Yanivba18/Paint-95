"use strict";
(() => {
    let canvas = document.getElementById("canvas");    
    let color = "black";


    let main = () => {
        addListeners();
    }

    let addListeners = () => {
        canvas.addEventListener("mousedown", (ev) => {
            draw(ev);
            let drawFunc = (e) => { draw(e) };
            canvas.addEventListener("mousemove", drawFunc);
            document.body.addEventListener("mouseup", () => { canvas.removeEventListener("mousemove", drawFunc) });
        });
        let dots = $('dot');
        dots.click(() => { color = event.target.id });

        let btn = $('#erase');
        btn.click(function () {
            while (canvas.firstChild) {
                canvas.removeChild(canvas.firstChild);
            }
        })

        $(window).resize(function() {
            let divs = getDrawnBoxes();            
            let rectPos = getRectSize();
            console.log("resize event works!")
            for (let i = 0; i < divs.length; i++) {
                let divPos = divs.eq(i).offset();
                // console.log(divPos);
                if (divPos.top < rectPos.top || divPos.top > rectPos.bottom || divPos.left < rectPos.left || divPos.left > rectPos.right) {
                    canvas.removeChild(divs.eq(i));
                }
            }
        })
    }

    function getDrawnBoxes() {
        let divs = $('.box-draw');            
        return divs;
    }

    function getRectSize() {
        let canvasPosition = canvas.getBoundingClientRect();
        let getBoxCoordinates = {
            top: canvasPosition.top,
            bottom: canvasPosition.bottom,
            left: canvasPosition.left,
            right: canvasPosition.right
        }
        console.log(`getting rect size: ${canvasPosition}`)
        return getBoxCoordinates;
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
        let rectSize = getRectSize();
        return (x + drawSize > rectSize.right) ? true :
            (y + drawSize > rectSize.bottom) ? true :
                (x < rectSize.left) ? true :
                    (y < rectSize.top) ? true :
                        false;
    }


    main();

})(window)
"use strict";
(() => {
    let canvas = document.getElementById("canvas");
    let canvasPosition = canvas.getBoundingClientRect();
    let color = "black";
    let getBoxCoordinates = {
        top: canvasPosition.top,
        bottom: canvasPosition.bottom,
        left: canvasPosition.left,
        right: canvasPosition.right
    }

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
        dots.click(() => {color = event.target.id}) //addListeners("click", () => {color = event.target.id})
        //document.querySelectorAll("dot").addEventListener("click", () => {color = event.target.id});
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
        return (x + drawSize > getBoxCoordinates.right) ? true :
            (y + drawSize > getBoxCoordinates.bottom) ? true :
                false;
    }


    main();

})(window)
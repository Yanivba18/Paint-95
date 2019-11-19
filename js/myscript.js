"use strict";
(() => {
    let canvas = document.getElementById("canvas");
    
    let main = () => {
        addListeners();        
    }
    
    let addListeners = () => {
        canvas.addEventListener("mousedown", (ev) => {
            draw(ev);
            let drawFunc = (e) => {draw(e)};
            canvas.addEventListener("mousemove", drawFunc);
            document.body.addEventListener("mouseup", () => {canvas.removeEventListener("mousemove", drawFunc)});
        }); 
    }

    let draw = (eVar) => {
        let x = eVar.clientX;
        let y = eVar.clientY;
        let box = document.createElement("div");
        box.className = "box-draw black";
        box.style.top = `${y}px`;
        box.style.left = `${x}px`;
        canvas.append(box);
    }

    main();

})(window)
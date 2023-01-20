function createEl(elType, parentEl, parentId, elId, elClass, elText, elStyle) {
    if (!parentEl) {parentEl = document.getElementById(parentId);}
    const el = document.createElement(elType);
    if (elId) {el.setAttribute('id', elId);}
    if (elClass) {el.setAttribute('class', elClass);}
    if (elText) {el.innerText = elText;}
    if (elStyle) {el.setAttribute("style", elStyle);}
    parentEl.append(el);
    return el;
}
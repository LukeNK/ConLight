const eLevel = document.getElementById('level'); // element level
function goIntoLevel(lv) {
    if (lv === undefined) {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('level').style.display = 'block';
    } else if (typeof(lv) == 'number') {
        LEVELS[lv].levelInit();
        eLevel.style.display = 'none'
    }
}

(() => {
    let l1 = 0, 
        list = document.getElementById('lvList');
    for (; l1 < LEVELS.length; l1++) {
        let lv = LEVELS[l1];
        let btn = document.createElement("button"),
            textnode = document.createTextNode(l1);
        btn.setAttribute('onclick', `goIntoLevel(${l1})`);
        btn.appendChild(textnode);
        list.appendChild(btn);
    }
})();
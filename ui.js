const eLevel = document.getElementById('level'); // element level
function goIntoLevel(lv) {
    if (lv === undefined) {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('level').style.display = 'block';
        document.getElementById('playUI').style.display =
            document.getElementById('canvas').style.display = 'none';

    } else if (typeof(lv) == 'number') {
        let cur = LEVELS[lv];
        cur.main = new Level(cur.objs, cur.ojts); // DOING THIS
        LEVELS[lv].levelInit();
        eLevel.style.display = 'none';
        document.getElementById('playUI').style.display =
            document.getElementById('canvas').style.display = 'block';
    }
    // just for sure
    window.scrollTo(0, 0); // scoll to prevent frame getting out of the screen because of 
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
const eLevel = document.getElementById('level'); // element level
const audio = document.getElementById('roll');
let curLv = undefined;

function canvasSize() {
    let VW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    let VH = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    canvas.width = VW;
    canvas.height = VH;
    ctx.translate(VW / 2, VH / 2); // shifting the graph to center of canvas
}

function goIntoLevel(lv) {
    if (lv === undefined) {
        document.getElementById('menu').style.display = 'none';
        eLevel.style.display = 'block';
        document.getElementById('playUI').style.display =
            document.getElementById('canvas').style.display = 'none';
    } else if (lv == 11) {
        audio.play();
        eLevel.style.display = 'none';
        document.getElementById('rick').style.display = 'block';
    }
    else if (typeof(lv) == 'number') {
        curLv = LEVELS[lv];
        curLv.main = new Level(curLv.objs, curLv.ojts, curLv.light);
        // start the level at random angle
        preLight();
        // put hint of the level into the UI
        document.getElementById('levelHint').innerHTML = curLv?.hint || '';
        // clearing everything for player
        eLevel.style.display = 'none';
        document.getElementById('playUI').style.display =
            document.getElementById('canvas').style.display = 'block';
    }
    // just for sure
    window.scrollTo(0, 0); // scoll to prevent frame getting out of the screen because of 
}

function preLight(val) {
    curLv.main = new Level(curLv.objs, curLv.ojts, curLv.light, curLv?.win);
    let rad = val || Math.random() * 999
    curLv.main.launchLight(
        Math.PI * (rad * 2 / 999)
    );
    document.getElementById('slider').value = rad;
    curLv.main.bounceLight(true);
}

(() => {
    let l1 = 0, 
        list = document.getElementById('lvList');
    for (; l1 < LEVELS.length; l1++) {
        let btn = document.createElement("button"),
            textnode = document.createTextNode(l1 + 1);
        btn.setAttribute('onclick', `goIntoLevel(${l1})`);
        btn.appendChild(textnode);
        list.appendChild(btn);
    }
})();

// goIntoLevel();
// goIntoLevel(LEVELS.length - 1);
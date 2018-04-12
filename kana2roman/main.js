const ts = new Tsuikyo();
const $kana = document.getElementById('kana');
const $roman = document.getElementById('roman');
const $count = document.getElementById('count');

$kana.addEventListener('keydown', _.debounce(() => {
    const word = ts.make($kana.value);
    const result = concatNodes(word._nodes);
    $roman.value = result.join('\n');
    $count.innerText = result.length;
}, 150));

function concatNodes(nodes) {
    if (nodes instanceof Array === false) {
        alert('fail');
    }
    return nodes.reduce((prev, cur) => {
        const curStr = cur.k.join('');
        const next = cur.n;
        return prev.concat(next ? concatNodes(next).map(succStr => curStr + succStr)
                                : curStr);
    }, []);
}



// 回答者の名前
let target = ['内田', '清島', '塩月', '高田', '藤﨑', '藤村', '堀井', '安武', '橋田'];
// 質問
let quiz = [
    {
        question: '名字はひらがなで何文字ですか？',
        answers: [2, 3, 4, 5],
        // countの中身の数字＝回答者（target）のindex
        count: [[], [0, 3, 6, 8,], [1, 2, 4, 5, 7,], []],
    },
    {
        question: '下の名前はひらがなで何文字ですか？',
        answers: [2, 3, 4, 5],
        count: [[], [5, 6, 7, 8,], [0, 1, 2, 3, 4,], []],
    },
    {
        question: '性別は何ですか？',
        answers: ['男性', '女性', '無回答'],
        count: [[0, 1, 2, 3, 4, 7,], [5, 6, 8,], [0, 1, 2, 3, 4, 5, 6, 7,]],
    },
    {
        question: '年齢は30歳以上ですか？30歳未満ですか？（2021/11/2時点）',
        answers: ['はい', 'いいえ'],
        count: [[0, 1, 3, 6, 7, 8, ], [2, 4, 5]],
    },
    // {
    //     question: 'ご使用のノートPCは何ですか？',
    //     answers: ['Windows', 'Mac', 'それ以外'],
    //     count: [[3], [0, 1, 2, 4, 5, 6, 7,], []],
    // },
    {
        question: '年齢は5の倍数ですか？（2021/11/2時点）',
        answers: ['はい', 'いいえ'],
        count: [[0, 1, 3, 6], [2, 4, 5, 7, 8,]],
    },
    {
        question: 'LAB6期懇親会の日はカラオケに行きましたか？',
        answers: ['はい', 'いいえ'],
        count: [[0, 1, 5, 6, 7], [2, 3, 4, 8,]],
    },
    {
        question: '名字に「゛」はつきますか？',
        answers: ['はい', 'いいえ'],
        count: [[0, 3, 4, 5, 8,], [1, 2, 6, 7]],
    },
    {
        question: '下の名前に「゛」はつきますか？',
        answers: ['はい', 'いいえ'],
        count: [[1, 2,], [0, 3, 4, 5, 6, 7, 8,]],
    },
    {
        question: '名字は「あかさたな」の行から始まりますか？',
        answers: ['はい', 'いいえ'],
        count: [[0, 1, 2, 3,], [4, 5, 6, 7, 8,]],
    },
    {
        question: '下の名前は「あかさたな」の行から始まりますか？',
        answers: ['はい', 'いいえ'],
        count: [[0, 2, 5, 7, 8,], [1, 3, 4, 6,]],
    },
];

let li = '';
let questionNumber = 1;
let identifier = [5];
let random = 0;
let numbers = [];
let filteredNumbers = [];
let newInfo = [];
let modal = '';

// ローカルストレージにinfoキーのデータがある場合
if (localStorage.getItem('info')) {
    // ローカルストレージのinfoキーのデータを取り出す
    const jsonData = localStorage.getItem('info');
    // JSONデータをオブジェクトの形式に直す
    const data = JSON.parse(jsonData);
    // target配列を空にする
    target.length = 0;
    // ローカルストレージに保存したtargetの情報（newTarget)をtargetに入れる
    target = target.concat(data.newTarget);
    // quiz配列を空にする
    quiz.length = 0;
    // ローカルストレージに保存したquizの情報（newQuiz)をquizに入れる
    quiz = quiz.concat(data.newQuiz);
}

// リロード時だけ最初に現れるモーダルを非表示にする
if (window.performance.navigation.type === 1) {
    $('#modal').removeClass();
}

// スタートボタンを押したときモーダルを非表示にする
$('body').on('click', '#start', function () {
    $('#modal').removeClass();
});

// 遊び方ボタンを押したときモーダルを表示する
$('#help').on('click', function () {
    if (window.performance.navigation.type === 1) {
        modal.appendTo('body');
        $('#modal').addClass('appear');
    } else {
        $('#modal').addClass('appear');
    }
});

// 回答者の特定に使うidentifier配列に0から（回答者候補の数-1）まで数字を入れる
target.forEach((value, index) => { identifier.push(index) });
// クイズの重複を防ぐために使うnumbers配列に質問の数だけ数字を入れる
quiz.forEach((value, index) => { numbers.push(index) });
// 回答者を当てられなかったとき用に新しい回答者の情報を保存するnewInfo配列に空の文字列を質問の数だけ追加する
quiz.forEach((value) => { newInfo.push('') });
// 質問が何問目かの表示
$('#number').text(`第 ${questionNumber} 問`);
// 乱数を質問の数だけ発生させる
random = Math.floor(Math.random() * numbers.length);
// 乱数を使って質問を表示
$('#question').text(quiz[numbers[random]].question);
// 表示された質問の選択肢のhtml要素を変数liに入れる
quiz[numbers[random]].answers.forEach((value, index) => {
    li += `<li><button id="answer" value="${index}">${value}</button></li>`;
});
// liをulタグに入れる（選択肢のhtmlを表示させる）
$('ul').html(li);

// 質問の選択肢ボタンを押したとき
$('body').on('click', '#answer', function (e) {
    // newInfo配列の中の質問のindexに対応する位置（newInfoのindex）に選んだ選択肢のvalueを上書きする
    newInfo.splice(numbers[random], 1, Number(e.target.value));
    // identifier配列と選んだ選択肢のcount（配列）を比較して重複する数字だけをidentifier配列に残し他は削除する
    identifier = identifier.filter(i => quiz[numbers[random]].count[e.target.value].indexOf(i) !== -1);
    // console.log(identifier);
    // console.log(identifier.length);
    // 乱数で出てきた整数をnumbers配列から削除する
    numbers = numbers.filter(x => x !== numbers[random]);
    // 何問目かを表示させるためのquestionNumberに1を足す
    questionNumber++;
    // もし質問の回答結果に当てはまる回答者がいない場合
    if (identifier.length === 0) {
        // notFound関数を動かす
        notFound();
    // 回答結果に当てはまる回答者が1人に絞られた場合
    } else if (identifier.length === 1) {
        // シルエット画像を変える
        $('#wrapper').removeClass();
        $('#wrapper').addClass('found');
        // 注意書きを消す
        $('#caution').remove();
        // あなたは〇〇さんですね？と表示する
        $('#result').html(`<p>あなたは<span>${target[identifier[0]]}</span>さんですね？</p><button id="yes">はい</button><button id="no">いいえ</button>`);
        // はいを選択したとき
        $('body').on('click', '#yes', function () {
            // これがメンタリズムですと表示する
            $('#comment').text('これがメンタリズムです');
        });
        // いいえを選択したとき
        $('body').on('click', '#no', function () {
            // notFound関数を動かす
            notFound();
        });
        return;
    // 回答結果に当てはまる回答者が半分以下に絞られた場合
    } else if (identifier.length <= target.length / 2) {
        $('#wrapper').removeClass();
        $('#wrapper').addClass('think');
        li = '';
        // 次の問題が何問目かを表示する
        $('#number').text(`第 ${questionNumber} 問`);
        // 前の問題のときに使用した整数を除いて乱数を発生させる
        random = Math.floor(Math.random() * numbers.length);
        // 発生した乱数に対応する質問を表示する
        $('#question').text(quiz[numbers[random]].question);
        // 発生した乱数に対応する質問の選択肢のhtmlを生成する
        quiz[numbers[random]].answers.forEach((value, index) => {
            li += `<li><button id="answer" value="${index}">${value}</button></li>`;
        });
        // htmlをulに表示する
        $('ul').html(li);
    // 回答結果に当てはまる回答者が半分より多い場合
    } else {
        // 上と同じ
        li = '';
        $('#number').text(`第 ${questionNumber} 問`);
        random = Math.floor(Math.random() * numbers.length);
        $('#question').text(quiz[numbers[random]].question);
        quiz[numbers[random]].answers.forEach((value, index) => {
            li += `<li><button id="answer" value="${index}">${value}</button></li>`;
        });
        $('ul').html(li);
    }
});

function notFound() {
    $('#wrapper').removeClass();
    $('#wrapper').addClass('incorrect');
    $('#save').addClass('appear');
    $('#result').html('<p>ぐぬぬ...あなたの情報は私のデータベースにはないようです...！<br>もしよろしければあなたの情報をローカルストレージに保存してもいいですか？</p><button id="save-yes">はい</button><button id="save-no">いいえ</button>');
    $('body').on('click', '#save-yes', function () {
        $('#wrapper').removeClass();
        $('#wrapper').addClass('learn');
        li = '';
        $('#number').text(`第 ${questionNumber} 問`);
        random = Math.floor(Math.random() * numbers.length);
        $('#question').text(quiz[numbers[random]].question);
        quiz[numbers[random]].answers.forEach((value, index) => {
            li += `<li><button id="newAnswer" value="${index}">${value}</button></li>`;
        });
        $('ul').html(li);
        $('#result').html('<p>いくつかの質問に正直に回答してください！</p>');

        $('body').on('click', '#newAnswer', function (e) {
            li = '';
            // identifier = identifier.concat(quiz[0].count[e.target.value]);
            newInfo.splice(numbers[random], 1, Number(e.target.value));
            identifier = identifier.filter(i => quiz[numbers[random]].count[e.target.value].indexOf(i) !== -1);
            numbers = numbers.filter(x => x !== numbers[random]);
            if (questionNumber < quiz.length) {
                questionNumber++;
                li = '';
                $('#number').text(`第 ${questionNumber} 問`);
                random = Math.floor(Math.random() * numbers.length);
                $('#question').text(quiz[numbers[random]].question);
                quiz[numbers[random]].answers.forEach((value, index) => {
                    li += `<li><button id="newAnswer" value="${index}">${value}</button></li>`;
                });
                $('ul').html(li);
            } else if (questionNumber >= quiz.length) {
                console.log(newInfo);
                newInfo.forEach((value, index) => {
                    quiz[index].count[value].push(target.length);
                });
                $('#number').text('');
                $('#question').text('');
                $('ul').html('');
                $('#result').html('<p>あなたの名前は？</p><input type="text" id="name"><br><button id="submit">送信</button>');
                $('body').on('click', '#submit', function () {
                    target.push($('#name').val());
                    const data = {
                        newTarget: target,
                        newQuiz: quiz,
                    }
                    const jsonData = JSON.stringify(data);
                    localStorage.setItem('info', jsonData);
                    $('#result').html('<p>対戦ありがとうございました！</p>');
                });
            } else {
                alert('error!');
            }
        });

    });
    $('body').on('click', '#save-no', function () {
        $('#result').html('<p>対戦ありがとうございました！</p>');
    });
}
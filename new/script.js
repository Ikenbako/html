// Firebaseの設定を書く
var firebaseConfig = {
    apiKey: "AIzaSyDvIL9X-qSqsw6i3Rp4TK98uygSfmI0v4A",
  authDomain: "chat-a1eca.firebaseapp.com",
  databaseURL: "https://chat-a1eca-default-rtdb.firebaseio.com",
  projectId: "chat-a1eca",
  storageBucket: "chat-a1eca.appspot.com",
  messagingSenderId: "872682257719",
  appId: "your-app-id",
  measurementId: "1:872682257719:web:efdf8105ece4e019516eb2"
  };
  
  // Firebaseを初期化する
  firebase.initializeApp(firebaseConfig);
  
  // Realtime databaseを参照する
  var database = firebase.database();
  
  // 意見フォームを取得する
  var opinionForm = document.getElementById("opinion-form");
  
  // 意見フォームが送信されたときに実行する関数を定義する
  opinionForm.addEventListener("submit", function(event) {
    // デフォルトの動作をキャンセルする
    event.preventDefault();
  
    // 意見フォームから入力された値を取得する
    var opinion = opinionForm.opinion.value;
  
    // 意見フォームをリセットする
    opinionForm.reset();
  
    // Realtime databaseに意見を保存する
    database.ref("opinions").push({
      opinion: opinion,
      reply: "" // 返信は空にしておく
    });
  });
  
  // 返信コンテナーを取得する
  var replyContainer = document.getElementById("reply-container");
  
  // Realtime databaseから意見と返信を取得して表示する関数を定義する
  function showReplies() {
    // 返信コンテナーを空にする
    replyContainer.innerHTML = "";
  
    // Realtime databaseから意見と返信を取得する
    database.ref("opinions").once("value", function(snapshot) {
      // 取得したデータを配列に変換する
      var opinions = [];
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var value = childSnapshot.val();
        opinions.push({
          key: key,
          opinion: value.opinion,
          reply: value.reply
        });
      });
  
      // 配列を逆順に並び替える（新しい意見が上に来るように）
      opinions.reverse();
  
      // 配列の要素ごとに返信コンテナーに表示する要素を作成する
      opinions.forEach(function(opinion) {
        // 返信が空でない場合だけ表示する
        if (opinion.reply !== "") {
          // 意見と返信を表示するdiv要素を作成する
          var opinionDiv = document.createElement("div");
          opinionDiv.className = "opinion-div";
  
          // 意見を表示するp要素を作成する
          var opinionP = document.createElement("p");
          opinionP.className = "opinion-p";
          opinionP.textContent = "意見：" + opinion.opinion;
  
          // 返信を表示するp要素を作成する
          var replyP = document.createElement("p");
          replyP.className = "reply-p";
          replyP.textContent = "返信：" + opinion.reply;
  
          // div要素にp要素を追加する
          opinionDiv.appendChild(opinionP);
          opinionDiv.appendChild(replyP);
  
          // 返信コンテナーにdiv要素を追加する
          replyContainer.appendChild(opinionDiv);
        }
      });
    });
  }
  
  // ページが読み込まれたときに、意見と返信を表示する関数を実行する
  window.onload = function() {
    showReplies();
  };
  
  // Realtime databaseの意見が変更されたときに、意見と返信を表示する関数を実行する
  database.ref("opinions").on("child_changed", function(childSnapshot) {
    showReplies();
  });
  
  document.querySelector('form').addEventListener('submit', function (event) {
    alert('送信が完了しました。');
  });
  
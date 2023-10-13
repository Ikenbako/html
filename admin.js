// パスワードを定義する
var password = "seitokai2023";

// パスワードを入力するプロンプトを表示する
var input = prompt("パスワードを入力してください");

// パスワードが正しいかどうか判定する
if (input == password) {
  // 正しい場合は、ページの内容を表示する
  document.getElementById("content").style.display = "block";
} else {
  // 間違っている場合は、アラートを表示してページを閉じる
  alert("パスワードが違います");
  window.close();
}



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
  
  // 意見コンテナーを取得する
  var opinionContainer = document.getElementById("opinion-container");
  
  // Realtime databaseから意見と返信を取得して表示する関数を定義する
  function showOpinions() {
    // 意見コンテナーを空にする
    opinionContainer.innerHTML = "";
  
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
  
      // 配列の要素ごとに意見コンテナーに表示する要素を作成する
      opinions.forEach(function(opinion) {
        // 返信が空の場合だけ表示する
        if (opinion.reply === "") {
          // 意見と返信フォームを表示するdiv要素を作成する
          var opinionDiv = document.createElement("div");
          opinionDiv.className = "opinion-div";
  
          // 意見を表示するp要素を作成する
          var opinionP = document.createElement("p");
          opinionP.className = "opinion-p";
          opinionP.textContent = "意見：" + opinion.opinion;
  
          // 返信フォームを作成する
          var replyForm = document.createElement("form");
          replyForm.className = "reply-form";
          
          // 返信フォームにラベルとテキストエリアとボタンを追加する
  var replyLabel = document.createElement("label");
  replyLabel.textContent = "返信：";
  var replyTextarea = document.createElement("textarea");
  replyTextarea.name = "reply";
  replyTextarea.rows = "3";
  replyTextarea.cols = "30";
  replyTextarea.value = opinion.reply; // 既に返信があれば表示する
  var replyButton = document.createElement("button");
  replyButton.type = "submit";
  replyButton.textContent = "送信";
  // 削除ボタンを作成する
  var deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "削除";
  // 削除ボタンがクリックされたときに実行する関数を定義する
  deleteButton.addEventListener("click", function(event) {
    // 確認ダイアログを表示する
    if (confirm("本当にこの意見を削除しますか？")) {
      // Realtime databaseから意見を削除する
      database.ref("opinions/" + opinion.key).remove();
      // 削除した意見と返信フォームを消す
      opinionDiv.remove();
    }
  });
  replyForm.appendChild(replyLabel);
  replyForm.appendChild(replyTextarea);
  replyForm.appendChild(replyButton);
  // 返信フォームに削除ボタンを追加する
  replyForm.appendChild(deleteButton);
  
          replyForm.appendChild(replyLabel);
          replyForm.appendChild(replyTextarea);
          replyForm.appendChild(replyButton);
  
          // 返信フォームが送信されたときに実行する関数を定義する
          replyForm.addEventListener("submit", function(event) {
            // デフォルトの動作をキャンセルする
            event.preventDefault();
  
            // 返信フォームから入力された値を取得する
            var reply = replyForm.reply.value;
  
            // Realtime databaseに返信を保存する
            database.ref("opinions/" + opinion.key).update({
              reply: reply
            });
            
            // 返信した意見と返信フォームを消す
            opinionDiv.remove();
          });
  
          // div要素にp要素と返信フォームを追加する
          opinionDiv.appendChild(opinionP);
          opinionDiv.appendChild(replyForm);
  
          // 意見コンテナーにdiv要素を追加する
          opinionContainer.appendChild(opinionDiv);
        }
      });
    });
  }
  
  // ページが読み込まれたときに、意見と返信を表示する関数を実行する
  window.onload = function() {
    showOpinions();
  };
  
  // Realtime databaseの意見が変更されたときに、意見と返信を表示する関数を実行する
  database.ref("opinions").on("child_changed", function(childSnapshot) {
    showOpinions();
  });
  
  
  
  // 返信済みコンテナーを取得する
  var repliedContainer = document.getElementById("replied-container");
  
  // Realtime databaseから返信済みの意見と返信を取得して表示する関数を定義する
  function showReplied() {
    // 返信済みコンテナーを空にする
    repliedContainer.innerHTML = "";
  
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
  
      // 配列の要素ごとに返信済みコンテナーに表示する要素を作成する
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
  
          // 削除ボタンを作成する
          var deleteButton = document.createElement("button");
          deleteButton.type = "button";
          deleteButton.textContent = "削除";
          
          // 削除ボタンがクリックされたときに実行する関数を定義する
          deleteButton.addEventListener("click", function(event) {
            // 確認ダイアログを表示する
            if (confirm("本当にこの意見と返信を削除しますか？")) {
              // Realtime databaseから意見と返信を削除する
              database.ref("opinions/" + opinion.key).remove();
              // 削除した意見と返信フォームを消す
              opinionDiv.remove();
            }
          });
  
          // div要素にp要素と削除ボタンを追加する
          opinionDiv.appendChild(opinionP);
          opinionDiv.appendChild(replyP);
          opinionDiv.appendChild(deleteButton);
  
          // 返信済みコンテナーにdiv要素を追加する
          repliedContainer.appendChild(opinionDiv);
        }
      });
    });
  }
  
  // ページが読み込まれたときに、意見と返信と返信済みリストを表示する関数を実行する
  window.onload = function() {
    showOpinions();
    showReplied();
  };
  
  // Realtime databaseの意見が変更されたときに、意見と返信と返信済みリストを表示する関数を実行する
  database.ref("opinions").on("child_changed", function(childSnapshot) {
    showOpinions();
    showReplied();
  });
  
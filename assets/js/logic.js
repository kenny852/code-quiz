var questionsEl = document.querySelector("#questions");
var timerEl = document.querySelector("#time");
var choicesEl = document.querySelector("#choices");
var submitBtn = document.querySelector("#submit");
var startBtn = document.querySelector("#start");
var initialsEl = document.querySelector("#initials");
var feedbackEl = document.querySelector("#feedback");
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;
var right = "./assets/sfx/correct.wav";
var wrong = "./assets/sfx/incorrect.wav";

function start() {
  var startScreenEl = document.getElementById("start-screen");
  startScreenEl.setAttribute("class", "hide");
  questionsEl.removeAttribute("class");
  timerId = setInterval(clock, 1000);
  timerEl.textContent = time;

  getQ();
}

function getQ() {
  var currentQuestion = questions[currentQuestionIndex];

  //question title
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;
  choicesEl.innerHTML = "";

  currentQuestion.choices.forEach(function(choice, i) {
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;
    choiceNode.onclick = clickQ;
    choicesEl.appendChild(choiceNode);
  });
}

function clock() {
  time--;
  timerEl.textContent = time;

  if (time <= 0) {
    end();
  }
}

function clickQ() {
  if (this.value !== questions[currentQuestionIndex].answer) {
    time -= 10;
    if (time < 0) {
      time = 0;
    }

    timerEl.textContent = time;
    feedbackEl.textContent = "Wrong!";
    feedbackEl.style.color = "red";
    feedbackEl.style.fontSize = "150%";
    (new Audio(wrong)).play()
  } else {
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "green";
    feedbackEl.style.fontSize = "150%";
    (new Audio(right)).play()
  }

  //right/wrong feedback
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  //next question
  currentQuestionIndex++;

  if (currentQuestionIndex === questions.length) {
    end();
  } else {
    getQ();
  }
}

function end() {
  clearInterval(timerId);

  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");

  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;

  questionsEl.setAttribute("class", "hide");
}

function savehighscore() {
  //get value of input box
  var initials = initialsEl.value.trim();

  if (initials !== "") {
    //get saved scores from localstorage
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];

    //new score for current user
    var newScore = {
      score: time,
      initials: initials
    };

    //save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    //redirect to highscores page
    window.location.href = "highscores.html";
  }
}

function checkenter(event) {
  if (event.key === "Enter") {
    savehighscore();
  }
}

submitBtn.onclick = savehighscore;
startBtn.onclick = start;
initialsEl.onkeyup = checkenter;
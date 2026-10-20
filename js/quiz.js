function showScreen(screenId) {
    const screens = document.querySelectorAll(".screen");

    screens.forEach(function (screen) {
        screen.hidden = true;
    });

    const selectedScreen = document.getElementById(screenId);
    selectedScreen.hidden = false;
}

async function loadQuiz(quizId) {
    showScreen("quiz-game")
    const allQuizzes = ["data/first_quiz.json", "data/second_quiz.json"]
    const currQuiz = allQuizzes[quizId]
    const response = await fetch(currQuiz)
    const quiz = await response.json()

    let currQuestionIndex = 0
    let score = 0


    const questionElement = document.getElementById("question")
    const answersElement = document.getElementById("answers")
    const resultElement = document.getElementById("result")
    const explanationElement = document.getElementById("explanation")

    const nextButton = document.getElementById("nextButton")


    function changeQuestion() {
        const currQuestion = quiz.questions[currQuestionIndex]
        questionElement.textContent = currQuestion.question
        answersElement.textContent = currQuestion.answers

        answersElement.innerHTML = ""
        resultElement.innerHTML = ""
        explanationElement.innerHTML = ""
        currQuestion.answers.forEach(function (answer, index) {
            const button = document.createElement("button")

            button.textContent = answer
            button.className = "btn btn-outline-primary text-start w-100 "
            button.id = index

            button.addEventListener("click", function () {
                checkAnswer(index)
            });

            answersElement.appendChild(button)
        });
    }

    changeQuestion();

    nextButton.addEventListener
    ("click",
        function () {
            currQuestionIndex++
            if (currQuestionIndex < quiz.questions.length) {
                changeQuestion()
            }
        }
    )

    function checkAnswer(answerId) {
        const currQuestion = quiz.questions[currQuestionIndex]
        if (currQuestion.correct == Number(answerId)) {
            score++
            resultElement.textContent = "Верно!"
        } else {
            resultElement.textContent = "Неверно!"
        }
        explanationElement.textContent = currQuestion.explanation

        const answerButtons = answersElement.querySelectorAll("button")

        answerButtons.forEach(function (button) {
            button.disabled = true
        })

    }
}

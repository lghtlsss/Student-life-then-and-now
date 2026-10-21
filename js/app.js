function showScreen(screenId) {
    const screens = document.querySelectorAll(".screen");

    screens.forEach(function (screen) {
        screen.hidden = true;
    });

    const selectedScreen = document.getElementById(screenId);
    selectedScreen.hidden = false;
}

const allQuizzes = ["data/sssr_student.json", "data/modern_student.json", "data/student_then_now.json"]

async function loadQuiz(quizId) {
    showScreen("quiz-game")
    const currQuiz = allQuizzes[quizId]
    const response = await fetch(currQuiz)
    const quiz = await response.json()

    let currQuestionIndex = 0
    let score = 0


    const questionElement = document.getElementById("question")
    const answersElement = document.getElementById("answers")
    const resultElement = document.getElementById("result")
    const explanationElement = document.getElementById("explanation")
    const resultsTitle = document.getElementById("resultsTitle");
    const resultsScore = document.getElementById("resultsScore");
    const resultsMessage = document.getElementById("resultsMessage");

    const nextButton = document.getElementById("nextButton")


    function changeQuestion() {
        const currQuestion = quiz.questions[currQuestionIndex]
        questionElement.textContent = currQuestion.question
        answersElement.textContent = currQuestion.answers

        nextButton.textContent =
    currQuestionIndex === quiz.questions.length - 1
        ? "Показать результат"
        : "Следующий вопрос";

    nextButton.disabled = true;
    nextButton.onclick = function () {
        if (currQuestionIndex < quiz.questions.length - 1) {
            currQuestionIndex++;
            changeQuestion();
        } else {
            showResults();
        }
    };

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
        nextButton.disabled = false

    }

    function showResults() {
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round(score / totalQuestions * 100);

    resultsTitle.textContent = quiz.title;

    resultsScore.textContent =
        `Правильных ответов: ${score} из ${totalQuestions} (${percentage}%)`;

    if (percentage === 100) {
        resultsMessage.textContent = "Отличный результат! Ты ответил правильно на все вопросы!";
    } else if (percentage >= 70) {
        resultsMessage.textContent = "Хороший результат! Ты неплохо разбираешься в теме.";
    } else if (percentage >= 40) {
        resultsMessage.textContent = "Неплохо! Но есть ещё что узнать о студенчестве.";
    } else {
        resultsMessage.textContent = "Кажется, пора узнать побольше о студенческой жизни этой эпохи!";
    }

    showScreen("quiz-results");
}
}



async function quizPageLoad() {
    const quizList = document.getElementById("quizList");

    quizList.innerHTML = "";

    for (const [index, json_quiz] of allQuizzes.entries()) {
        try {
            const response = await fetch(json_quiz);
            const quiz = await response.json();

            // Карточка
            const divisor = document.createElement("div");
            divisor.classList.add("card");
            divisor.style.width = "18rem";

            // Картинка
            const image = document.createElement("img");
            image.src = quiz.image; // Ссылка из JSON
            image.alt = quiz.title;
            image.classList.add("card-img-top");

            // Тело карточки
            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            // Заголовок
            const title = document.createElement("h5");
            title.classList.add("card-title");
            title.textContent = quiz.title;

            // Описание
            const description = document.createElement("p");
            description.classList.add("card-text");
            description.textContent = quiz.description;

            // Кнопка
            const button = document.createElement("button");
            button.type = "button";
            button.classList.add("btn", "btn-success");
            button.textContent = "Начать";

            button.addEventListener("click", function () {
                loadQuiz(index);
            });

            // Собираем карточку
            cardBody.append(title, description, button);
            divisor.append(image, cardBody);
            quizList.append(divisor);

        } catch (error) {
            console.error("Ошибка загрузки квиза:", json_quiz, error);
        }
    }
}

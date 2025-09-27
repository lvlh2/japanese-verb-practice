let questionBank = {};
let currentCategory = null;
let currentQuestion = null;

// DOM 元素
const categorySelect = document.getElementById("category-select");
const questionBox = document.getElementById("question-box");
const answerInput = document.getElementById("answer-input");
const feedbackBox = document.getElementById("feedback");
const showAnswerBtn = document.getElementById("show-answer");
const nextBtn = document.getElementById("next-question");

// 加载题库
async function loadQuestions() {
    try {
        const response = await fetch("question_bank.json");
        questionBank = await response.json();

        // 显示答案示例
        showHintExample();
    } catch (err) {
        console.error("题库加载失败:", err);
        questionBox.textContent = "❌ 题库加载失败，请用本地服务器运行。";
    }
}

// 选择类别后开始出题 & 更新提示
categorySelect.addEventListener("change", () => {
    currentCategory = categorySelect.value;
    const hintBox = document.getElementById("hint");

    if (currentCategory) {
        showHintExample(currentCategory);
        hintBox.style.display = "block";
        nextQuestion();
    } else {
        hintBox.style.display = "none";
        hintBox.textContent = "";
    }
});

// 显示提示示例（根据当前类别）
function showHintExample(category) {
    const data = questionBank[category];
    if (!data || data.length === 0) return;

    const [q, a] = data[Math.floor(Math.random() * data.length)];
    const question = q.replace(/（.*?）/g, "");

    const hintBox = document.getElementById("hint");
    hintBox.textContent = `示例：${question} → ${a}　（答案输入只能为假名）`;
}

// 选择类别后开始出题
categorySelect.addEventListener("change", () => {
    currentCategory = categorySelect.value;
    if (currentCategory) {
        nextQuestion();
    }
});

// 生成随机题目
function nextQuestion() {
    const data = questionBank[currentCategory];
    if (!data || data.length === 0) {
        questionBox.textContent = "当前类别暂无题目。";
        return;
    }

    currentQuestion = data[Math.floor(Math.random() * data.length)];
    const [question] = currentQuestion;

    // 更新 UI
    questionBox.textContent = question;
    answerInput.value = "";
    feedbackBox.textContent = "";
    showAnswerBtn.style.display = "none";
    nextBtn.style.display = "none";
    answerInput.focus();
}

// 用户输入并提交答案
answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (currentQuestion === null) {
            nextQuestion();
        } else {
            checkAnswer();
        }
    }
});

function checkAnswer() {
    if (!currentQuestion) return;

    const userAnswer = answerInput.value.trim();
    const correctAnswer = currentQuestion[1];

    if (userAnswer === correctAnswer) {
        feedbackBox.textContent = "✅ 正确！按回车进入下一题";
        feedbackBox.className = "correct";
        currentQuestion = null; // 清空当前题，避免重复校验
    } else {
        feedbackBox.textContent = "❌ 错误，请再试一次";
        feedbackBox.className = "wrong";
        showAnswerBtn.style.display = "inline-block";
    }
}

// 查看答案
showAnswerBtn.addEventListener("click", () => {
    if (currentQuestion) {
        feedbackBox.textContent = `答案：${currentQuestion[1]}`;
        feedbackBox.className = "wrong";
        showAnswerBtn.style.display = "none";
        nextBtn.style.display = "inline-block";
        currentQuestion = null;
    }
});

// 下一题按钮
nextBtn.addEventListener("click", () => {
    nextQuestion();
});

// 页面初始化
loadQuestions();

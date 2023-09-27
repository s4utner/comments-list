import { getComments, pushComment } from "./api.js";
import { date } from "./date.js";
import { renderComments } from "./renderComments.js";
import { inputsOnPush } from "./inputsOnPush.js";
import { initEventListeners } from "./like.js";
import { renderLoginPage } from "./loginPage.js";

// Переменные
export const app = document.querySelector(".app");
const loginPageLink = document.querySelector(".login-page-link");
const addButtonElement = document.querySelector(".add-form-button");
const comments = document.querySelector(".comments");
const nameInput = document.querySelector(".add-form-name");
const commentInput = document.querySelector(".add-form-text");
const deleteButtonElement = document.querySelector(".delete-form-button");
const addForm = document.querySelector(".add-form");

let quoteGlobal = "";

const getApiComments = () => {

    //app.innerHTML = `<div class="loader-text">Подождите, комментарии загружаются...</div>
    //<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

    getComments()
        .then((responseData) => {
            const appComments = responseData.comments.map((comment) => {
                const defaultDate = comment.date;
                return {
                    name: comment.author.name,
                    date: date({ defaultDate }),
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: false,
                };
            })
            comment = appComments;
            renderComments({ comment, comments, initEventListeners, quoteGlobal, commentInput, nameInput, addButtonElement });
        })
        .catch((error) => {
            if (error.message === 'Failed to fetch') {
                alert(`Кажется, соединение с интернетом потеряно. Проверь настройки`);
            } else {
                alert(error.message);
            }
        })
};

let comment = [];

getApiComments();
renderComments({ comment, comments, initEventListeners, quoteGlobal, commentInput, nameInput, addButtonElement });

//Добавление комментариев в API
const pushApiComment = () => {

    //addForm.innerHTML = `<div class="loader-text">Подождите, комментарий загружается...</div>
    //<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

    const safeNameInputValue = nameInput.value
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");

    const safeCommentInputValue = commentInput.value
        .replace(`"${quoteGlobal}"\n`, '')
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");

    pushComment({ safeNameInputValue, safeCommentInputValue })
        .then(() => {
            getApiComments();
            initEventListeners({ comment, renderComments, comments, comment, quoteGlobal, commentInput, nameInput, addButtonElement });
            renderComments({ comment, comments, initEventListeners, quoteGlobal, commentInput, nameInput, addButtonElement });
        })
        .then(() => {
            quoteGlobal = '';
            nameInput.value = '';
            commentInput.value = '';
        })
        .catch((error) => {
            addButtonElement.disabled = false;
            if (error.message === 'Failed to fetch') {
                alert('Кажется, соединение с интернетом потеряно. Проверь настройки');
            } else {
                alert(error.message);
            }
        });
}

// Обработчик на кнопке 'Написать'
addButtonElement.addEventListener('click', function () {
    inputsOnPush({ addButtonElement, nameInput, commentInput, pushApiComment });
});

// Срабатывание кнопки 'Написать' при клике на Enter
document.addEventListener('keyup', function (enter) {
    if (enter.keyCode === 13) {
        inputsOnPush({ addButtonElement, nameInput, commentInput, pushApiComment });
    }
});

// Удаление последнего комментария
deleteButtonElement.addEventListener('click', () => {
    const askForDeleteComment = confirm('Вы уверены, что хотите удалить последний комментарий?') ? comment.pop() : '';
    renderComments({ comment, comments, initEventListeners, quoteGlobal, commentInput, nameInput, addButtonElement });
});

// Обработчик на ссылке авторизации
loginPageLink.addEventListener("click", () => {
    renderLoginPage();
});

console.log("It works!");
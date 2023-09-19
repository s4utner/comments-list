import { getComments, pushComment } from "./api.js";
import { getApiComments, pushApiComment } from "./comments.js";
import { date } from "./date.js";
import { renderComments } from "./renderComments.js";
import { initEventListeners } from "./like.js";
import { inputsOnPush } from "./inputsOnPush.js";
import { quoteGlobal, commentInput, nameInput, safeCommentInputValue, safeNameInputValue } from "./comments.js";

// Переменные
const addButtonElement = document.querySelector(".add-form-button");
const deleteButtonElement = document.querySelector(".delete-form-button");
const comments = document.querySelector(".comments");

let comment = [];

getApiComments({ getComments, date, comment, renderComments, comments, initEventListeners, quoteGlobal, commentInput, nameInput, addButtonElement });
renderComments({ comment, comments, initEventListeners, quoteGlobal, commentInput, nameInput, addButtonElement });

// Обработчик на кнопке 'Написать'
addButtonElement.addEventListener('click', function () {
    inputsOnPush({ addButtonElement, nameInput, commentInput, pushApiComment, safeCommentInputValue, safeNameInputValue, date, comment, renderComments, comments, initEventListeners, quoteGlobal, pushComment });
});

// Срабатывание кнопки 'Написать' при клике на Enter
document.addEventListener('keyup', function (enter) {
    if (enter.keyCode === 13) {
        inputsOnPush({ addButtonElement, nameInput, commentInput, pushApiComment, safeCommentInputValue, safeNameInputValue, date, comment, renderComments, comments, initEventListeners, quoteGlobal, pushComment });
    }
});

// Удаление последнего комментария
deleteButtonElement.addEventListener('click', () => {
    const askForDeleteComment = confirm('Вы уверены, что хотите удалить последний комментарий?') ? comment.pop() : '';
    renderComments({ comment, comments, initEventListeners, quoteGlobal, commentInput, nameInput, addButtonElement });
});

console.log("It works!");
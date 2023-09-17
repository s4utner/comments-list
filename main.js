import { getComments, pushComment } from "./api.js";
import { date } from "./date.js";
import { renderComments } from "./renderComments.js";
import { initEventListeners } from "./like.js";
import { inputsOnPush } from "./inputsOnPush.js";

// Переменные
const addButtonElement = document.querySelector(".add-form-button");
const deleteButtonElement = document.querySelector(".delete-form-button");
const comments = document.querySelector(".comments");
const nameInput = document.querySelector(".add-form-name");
const commentInput = document.querySelector(".add-form-text");
const container = document.querySelector(".container");
const addForm = document.querySelector(".add-form");
const pageLoader = document.querySelector(".page-loader");
const commentLoader = document.querySelector(".comment-loader");

let quoteGlobal = "";

const getApiComments = () => {
    container.classList.add('delete');
    pageLoader.textContent = `Пожалуйста, подождите.
  Комментарии загружаются...`;
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
        .then(() => {
            pageLoader.textContent = "";
            pageLoader.classList.add('delete');
            container.classList.remove('delete');
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

const pushApiComment = () => {
    const safeNameInputValue = nameInput.value
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");

    const safeCommentInputValue = commentInput.value
        .replace(`"${quoteGlobal}"\n`, '')
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");

    addForm.classList.add('delete');
    commentLoader.classList.remove('delete');
    commentLoader.textContent = `Пожалуйста, подождите.
  Ваш комментарий добавляется...`;

    pushComment({ safeNameInputValue, safeCommentInputValue })
        .then(() => {
            comment.push({
                name: safeNameInputValue,
                date: date({ defaultDate }),
                text: safeCommentInputValue,
                likes: 0,
                isLiked: false,
            });
            commentLoader.classList.add('delete');
            addForm.classList.remove('delete');
            initEventListeners({ comment, renderComments, comments, quoteGlobal, commentInput, nameInput, addButtonElement });
            renderComments({ comment, comments, initEventListeners, quoteGlobal, commentInput, nameInput, addButtonElement });
        })
        .then(() => {
            quoteGlobal = '';
            nameInput.value = '';
            commentInput.value = '';
        })
        .catch((error) => {
            commentLoader.classList.add('delete');
            addForm.classList.remove('delete');
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

console.log("It works!");
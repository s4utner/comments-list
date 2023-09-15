import { getComments, pushComment } from "./api.js";
import { date } from "./date.js";
import { renderComments } from "./renderComments.js";

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
            renderComments({ comment, comments, initEventListeners });
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

// Поставить лайк
const initEventListeners = () => {
    const likeButtonElement = document.querySelectorAll('.like-button');
    for (const item of likeButtonElement) {
        item.addEventListener('click', (event) => {
            event.stopPropagation();
            const index = item.dataset.index;
            if (comment[index].isLiked) {
                comment[index].isLiked = false;
                comment[index].likes--;
            } else {
                comment[index].isLiked = true;
                comment[index].likes++;
            }
            renderComments({ comment, comments, initEventListeners });
        });
    };
};

getApiComments();
renderComments({ comment, comments, initEventListeners });

//Добавление комментариев в API
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
            initEventListeners();
            renderComments({ comment, comments, initEventListeners });
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

const inputsOnPush = () => {
    addButtonElement.disabled = false;
    addButtonElement.classList.remove('disabled');
    nameInput.classList.remove('error');
    commentInput.classList.remove('error');

    if (nameInput.value === '' && commentInput.value === '') {
        nameInput.classList.add('error');
        commentInput.classList.add('error');
        addButtonElement.classList.add('disabled');
        addButtonElement.disabled = true;
        return;
    };

    if (nameInput.value === '') {
        nameInput.classList.add('error');
        addButtonElement.classList.add('disabled');
        addButtonElement.disabled = true;
        return;
    };

    if (commentInput.value === '') {
        commentInput.classList.add('error');
        addButtonElement.classList.add('disabled');
        addButtonElement.disabled = true;
        return;
    };

    pushApiComment();
};

// Обработчик на кнопке 'Написать'
addButtonElement.addEventListener('click', inputsOnPush);

// Срабатывание кнопки 'Написать' при клике на Enter
document.addEventListener('keyup', function (enter) {
    if (enter.keyCode === 13) {
        inputsOnPush();
    }
});

// Удаление последнего комментария
deleteButtonElement.addEventListener('click', () => {
    const askForDeleteComment = confirm('Вы уверены, что хотите удалить последний комментарий?') ? comment.pop() : '';
    renderComments({ comment, comments, initEventListeners });
});

console.log("It works!");
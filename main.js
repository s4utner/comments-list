import { getComments, pushComment } from "./api.js";
import { date } from "./date.js";

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
            renderComment();
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
            renderComment();
        });
    };
};

// Рендер комментариев
const renderComment = () => {
    const commentsHTML = comment
        .map((comment, index) => {
            return `<li class="comment" data-index="${index}">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div class="date">${comment.date}</div>
        </div>
        ${comment.quote
                    ? `<div
                      class="quote-form-text"
                      rows="2"
                      >${comment.quote}</div>`
                    : ``
                }
        ${comment.isEdit
                    ? `<textarea
                      class="add-form-text"
                      rows="2"
                    >${comment.text}</textarea>`
                    : `<div class="comment-body"><div class="comment-text" data-index="${index}">${comment.text}</div></div>`
                }
        <div class="comment-footer">
                        ${comment.isEdit
                    ? `<button data-index="${index}" class='save-form-button'>Сохранить изменения</button>`
                    : `<button data-index="${index}" class='edit-form-button'>Редактировать комментарий</button>`
                }
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="like-button ${comment.isLiked ? '-active-like' : ''}" data-index="${index}"></button>
          </div>
        </div>
      </li>`;
        })
        .join('');
    comments.innerHTML = commentsHTML;

    //Редактировать комментарий
    const editButtonElements = document.querySelectorAll('.edit-form-button');

    for (const editButton of editButtonElements) {

        editButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const index = editButton.dataset.index;
            const editComment = comment[index];
            editComment.isEdit = true;

            renderComment();

            document.querySelector(".add-form-text").focus();
        });
    };
    const saveButtons = document.querySelectorAll(".save-form-button");
    for (const saveButton of saveButtons) {
        saveButton.addEventListener("click", (e) => {
            e.stopPropagation();
            const saveComment = comment[saveButton.dataset.index];
            const editFormText = saveButton
                .closest(".comment")
                .querySelector(".add-form-text");
            saveComment.text = editFormText.value;

            saveComment.isEdit = false;
            renderComment();
        });
    }

    // Блокировка кнопки
    document.addEventListener("input", () => {
        nameInput.value != "" && commentInput.value != ""
            ? (addButtonElement.classList.remove('disabled'),
                addButtonElement.disabled = false,
                nameInput.classList.remove('error'),
                commentInput.classList.remove('error'))
            : (addButtonElement.classList.add('disabled'),
                addButtonElement.disabled = true);
    });

    // Ответ на комменатрий
    const pushedComments = document.querySelectorAll('.comment-text');

    for (const repliedComment of pushedComments) {
        repliedComment.addEventListener('click', () => {
            const index = repliedComment.dataset.index;

            const commentQuote = comment[index];
            quoteGlobal = `> ${commentQuote.name}:\n${commentQuote.text}`;
            commentInput.value = `"${quoteGlobal}"\n`;

        });
    };

    initEventListeners();
};
getApiComments();
renderComment();

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
            const defaultDate = new Date();
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
            renderComment();
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

//Добавление комментария 
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
    renderComment();
});

console.log("It works!");
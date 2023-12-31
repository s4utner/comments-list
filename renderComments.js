import { inputsOnPush } from "./inputsOnPush.js";
import { pushApiComment } from "./main.js";
import { renderLoginPage } from "./loginPage.js";
import { comment, app } from "./main.js";
import { token } from "./api.js";

let commentName;
export const setCommentName = (newName) => {
    commentName = newName;
};

export const renderComments = ({ initEventListeners }) => {
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
                    ? `<button data-index="${index}" class='save-form-button'>Сохранить</button>`
                    : `<button data-index="${index}" class='edit-form-button'>Редактировать</button>`
                }
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="like-button ${comment.isLiked ? '-active-like' : ''}" data-index="${index}"></button>
          </div>
        </div>
      </li>`;
        })
        .join('');

    const listHTML = `
        <ul class="comments">${commentsHTML}</ul>
        ${token
            ? `
        <div class="comment-loader delete">
            <div class="loader-text">Ваш комментарий добавляется...</div>
            <div class="lds-roller">
              <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            </div>
          </div>
        <div class="add-form">
        <input type="text" class="add-form-name disabled" value="${commentName}" readonly />
        <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
        <div class="add-form-row">
          <button class="add-form-button">Написать</button>
          <button class="delete-form-button">Удалить</button>
        </div>
      </div>`
            : `<span class="login-page-text">Чтобы добавить комментарий,<br> нужно <a class="login-page-link"
    href="#">авторизоваться</a></span>`}    
        `;
    app.innerHTML = listHTML;

    const loginPageLink = document.querySelector(".login-page-link");
    const comments = document.querySelector(".comments");
    const addButtonElement = document.querySelector(".add-form-button");
    const nameInput = document.querySelector(".add-form-name");
    const commentInput = document.querySelector(".add-form-text");

    // Обработчик на кнопке 'Написать'
    token
        ? addButtonElement.addEventListener('click', function () {
            inputsOnPush({ pushApiComment });
        })
        : ``;

    // Срабатывание кнопки 'Написать' при клике на Enter
    const addForm = document.querySelector(".add-form");
    token
        ? addForm.addEventListener('keyup', function (enter) {
            if (enter.keyCode === 13) {
                inputsOnPush({ pushApiComment });
            }
        })
        : ``;


    // Удаление последнего комментария
    const deleteButtonElement = document.querySelector(".delete-form-button");
    token
        ? deleteButtonElement.addEventListener('click', () => {
            const askForDeleteComment = confirm('Вы уверены, что хотите удалить последний комментарий?') ? comment.pop() : '';
            renderComments({ initEventListeners });
        })
        : ``;

    // Обработчик на ссылке авторизации
    token
        ? ``
        : loginPageLink.addEventListener("click", () => {
            renderLoginPage();
        });


    //Редактировать комментарий
    const editButtonElements = document.querySelectorAll('.edit-form-button');

    for (const editButton of editButtonElements) {

        editButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const index = editButton.dataset.index;
            const editComment = comment[index];
            editComment.isEdit = true;

            renderComments({ initEventListeners });

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
            renderComments({ initEventListeners });
        });
    }

    // Блокировка кнопки
    token
        ? document.addEventListener("input", () => {
            nameInput.value != "" && commentInput.value != ""
                ? (addButtonElement.classList.remove('disabled'),
                    addButtonElement.disabled = false,
                    nameInput.classList.remove('error'),
                    commentInput.classList.remove('error'))
                : (addButtonElement.classList.add('disabled'),
                    addButtonElement.disabled = true);
        })
        : ``;


    // Ответ на комменатрий
    const pushedComments = document.querySelectorAll('.comment-text');

    for (const repliedComment of pushedComments) {
        repliedComment.addEventListener('click', () => {
            const index = repliedComment.dataset.index;
            let quoteGlobal = "";
            const commentQuote = comment[index];
            quoteGlobal = `> ${commentQuote.name}:\n${commentQuote.text}`;
            commentInput.value = `"${quoteGlobal}"\n`;
        });
    };

    initEventListeners({ renderComments });
};
import { getComments, pushComment } from "./api.js";
import { date } from "./date.js";
import { renderComments } from "./renderComments.js";
import { initEventListeners } from "./like.js";

export const app = document.querySelector(".app");
export let comment = [];

const getApiComments = () => {

    app.innerHTML = `<div class="loader-text">Подождите, комментарии загружаются...</div>
    <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

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
            renderComments({ initEventListeners });
        })
        .catch((error) => {
            if (error.message === 'Failed to fetch') {
                alert(`Кажется, соединение с интернетом потеряно. Проверь настройки`);
            } else {
                alert(error.message);
            }
        })
};

getApiComments();
renderComments({ initEventListeners });

const nameInput = document.querySelector(".add-form-name");
const commentInput = document.querySelector(".add-form-text");
const addForm = document.querySelector(".add-form");
let quoteGlobal = "";

//Добавление комментариев в API
export const pushApiComment = () => {

    addForm.innerHTML = `<div class="loader-text">Подождите, комментарий добавляется...</div>
    <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

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
            initEventListeners({ renderComments });
            renderComments({ initEventListeners });
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

console.log("It works!");
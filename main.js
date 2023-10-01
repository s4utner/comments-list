import { getComments, pushComment, setToken, token } from "./api.js";
import { date } from "./date.js";
import { renderComments } from "./renderComments.js";
import { initEventListeners } from "./like.js";

export const app = document.querySelector(".app");
export let comment = [];
export const myStorage = localStorage;
const loader = document.querySelector(".loader");
setToken(myStorage.getItem(token));

//Получение комментариев из API
const getApiComments = () => {
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
        .then(() => {
            app.classList.remove("delete");
            loader.classList.add("delete");
        });
};

getApiComments();
renderComments({ initEventListeners });

export let quoteGlobal = "";

//Добавление комментариев в API
export const pushApiComment = () => {
    const nameInput = document.querySelector(".add-form-name");
    const commentInput = document.querySelector(".add-form-text");
    const addForm = document.querySelector(".add-form");
    const commentLoader = document.querySelector(".comment-loader");
    addForm.classList.add("delete");
    commentLoader.classList.remove("delete");

    pushComment()
        .then(() => {
            getApiComments();
            initEventListeners({ renderComments });
            renderComments({ initEventListeners });
        })
        .then(() => {
            quoteGlobal = '';
            nameInput.value = '';
            commentInput.value = '';
            addForm.classList.remove("delete");
            commentLoader.classList.add("delete");
        })
        .catch((error) => {
            const addButtonElement = document.querySelector(".add-form-button");
            addButtonElement.disabled = false;
            if (error.message === 'Failed to fetch') {
                alert('Кажется, соединение с интернетом потеряно. Проверь настройки');
            } else {
                alert(error.message);
            }
        });
}

console.log("It works!");
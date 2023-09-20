export const nameInput = document.querySelector(".add-form-name");
export const commentInput = document.querySelector(".add-form-text");
const container = document.querySelector(".container");
const pageLoader = document.querySelector(".page-loader");
const addForm = document.querySelector(".add-form");
const commentLoader = document.querySelector(".comment-loader");
export let quoteGlobal = "";

export const getApiComments = ({ getComments, date, comment, renderComments, comments, initEventListeners, quoteGlobal, commentInput, nameInput, addButtonElement }) => {
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

export const safeNameInputValue = nameInput.value
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export const safeCommentInputValue = commentInput.value
    .replace(`"${quoteGlobal}"\n`, '')
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");


export const pushApiComment = ({ safeCommentInputValue, safeNameInputValue, date, comment, renderComments, comments, initEventListeners, quoteGlobal, commentInput, nameInput, addButtonElement, pushComment }) => {
    addForm.classList.add('delete');
    commentLoader.classList.remove('delete');
    commentLoader.textContent = `Пожалуйста, подождите.
  Ваш комментарий добавляется...`;

    pushComment({ safeCommentInputValue, safeNameInputValue, date, comment, renderComments, comments, initEventListeners, quoteGlobal, commentInput, nameInput, addButtonElement })
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
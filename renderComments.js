export const renderComments = ({ comment, comments, initEventListeners, quoteGlobal, commentInput, nameInput, addButtonElement }) => {
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

            renderComments({ comment, comments, initEventListeners, quoteGlobal, commentInput });

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
            renderComments({ comment, comments, initEventListeners, quoteGlobal, commentInput });
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

    initEventListeners({ comment, renderComments, comments, quoteGlobal, commentInput, nameInput, addButtonElement });
};
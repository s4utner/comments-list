export const getComments = () => {
    return fetch('https://wedev-api.sky.pro/api/v1/sautner-denis/comments', {
        method: 'GET',
    })
        .then((response) => {
            return response.json();
        })
};

export const pushComment = ({ safeCommentInputValue, safeNameInputValue, date, comment, renderComments, comments, initEventListeners, quoteGlobal, commentInput, nameInput, addButtonElement, pushComment, pushApiComment }) => {
    return fetch('https://wedev-api.sky.pro/api/v1/sautner-denis/comments', {
        method: 'POST',
        body: JSON.stringify({
            text: safeCommentInputValue,
            name: safeNameInputValue,
            forceError: false,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Имя и комментарий должны быть не короче 3 символов');
        } else if (response.status === 500) {
            pushApiComment({ safeCommentInputValue, safeNameInputValue, date, comment, renderComments, comments, initEventListeners, quoteGlobal, commentInput, nameInput, addButtonElement, pushComment });
            throw new Error('Сервер прилег поспать. Подтвердите повторную попытку отправки');
        } else {
            return response.json();
        }
    })
}
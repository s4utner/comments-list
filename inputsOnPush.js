export const inputsOnPush = ({ addButtonElement, nameInput, commentInput, pushApiComment }) => {
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
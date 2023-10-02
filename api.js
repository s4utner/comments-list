import { quoteGlobal } from "./main.js";

export let token;
export const setToken = (newToken) => {
    token = newToken;
};

export const getComments = () => {
    return fetch('https://wedev-api.sky.pro/api/v2/sautner-denis/comments', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            return response.json();
        })
};

export const pushComment = () => {
    const nameInput = document.querySelector(".add-form-name");
    const commentInput = document.querySelector(".add-form-text");

    const safeNameInputValue = nameInput.value
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");

    const safeCommentInputValue = commentInput.value
        .replace(`"${quoteGlobal}"\n`, '')
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");

    return fetch('https://wedev-api.sky.pro/api/v2/sautner-denis/comments', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            text: safeCommentInputValue,
            name: safeNameInputValue,
            forceError: false,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Имя и комментарий должны быть не короче 3 символов');
        } else if (response.status === 500) {
            pushApiComment();
            throw new Error('Сервер прилег поспать. Подтвердите повторную попытку отправки');
        } else {
            return response.json();
        }
    })
}

export const registration = (safeNameInputValue, safeLoginInputValue, safePasswordInputValue) => {
    return fetch('https://wedev-api.sky.pro/api/user', {
        method: 'POST',
        body: JSON.stringify({
            login: safeLoginInputValue,
            name: safeNameInputValue,
            password: safePasswordInputValue
        }),
    }).then((response) => {
        if (response.status === 400) {
            alert('Данный логин уже занят');
            throw new Error('Данный логин уже занят');
        } else {
            return response.json();
        }
    })
}

export const signIn = (safeLoginInputValue, safePasswordInputValue) => {
    return fetch('https://wedev-api.sky.pro/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
            login: safeLoginInputValue,
            password: safePasswordInputValue
        }),
    }).then((response) => {
        if (response.status === 400) {
            alert('Введён неверный логин или пароль');
            throw new Error('Введён неверный логин или пароль');
        } else {
            return response.json();
        }
    })
}
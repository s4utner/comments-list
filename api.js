export const getComments = () => {
    return fetch('https://wedev-api.sky.pro/api/v2/sautner-denis/comments', {
        method: 'GET',
    })
        .then((response) => {
            return response.json();
        })
};

export const pushComment = ({ safeNameInputValue, safeCommentInputValue }) => {
    return fetch('https://wedev-api.sky.pro/api/v2/sautner-denis/comments', {
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
            alert("Регистрация прошла успешно");
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
            alert("Авторизация прошла успешно");
        }
    })
}
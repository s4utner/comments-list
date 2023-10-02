import { app, myStorage } from "./main.js";
import { registration, token, setToken } from "./api.js";
import { renderComments, setCommentName } from "./renderComments.js";
import { initEventListeners } from "./like.js";
import { renderLoginPage } from "./loginPage.js";

export const renderRegistrationPage = () => {
    const loginHTML = `
    <div class="breadcrumbs">
        <span class="breadcrumb sign-in">Вход</span>
        <span class="breadcrumb sign-up breadcrumb-active">Регистрация</span>
    </div>
    <div class="login-form">
        <div class="login-form-inputs">
            <input type="text" class="login-form-name" placeholder="Введите имя" />
            <input type="text" class="login-form-login" placeholder="Введите логин" />
            <input type="text" class="login-form-password" placeholder="Введите пароль" />
        </div>
        <div class="login-form-row">
            <button class="login-form-button">Зарегистрироваться</button>
        </div>
    </div>
    `;

    app.innerHTML = loginHTML;

    const signInLink = document.querySelector(".sign-in");
    signInLink.addEventListener('click', renderLoginPage);

    const nameInput = document.querySelector(".login-form-name");
    const loginInput = document.querySelector(".login-form-login");
    const passwordInput = document.querySelector(".login-form-password");

    nameInput.addEventListener('input', () => {
        nameInput.classList.remove('error');
        registrationButton.disabled = false;
    });

    loginInput.addEventListener('input', () => {
        loginInput.classList.remove('error');
        registrationButton.disabled = false;
    });

    passwordInput.addEventListener('input', () => {
        passwordInput.classList.remove('error');
        registrationButton.disabled = false;
    });

    const registrationButton = document.querySelector(".login-form-button");
    registrationButton.addEventListener('click', () => {

        const safeNameInputValue = nameInput.value
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");

        const safeLoginInputValue = loginInput.value
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");

        const safePasswordInputValue = passwordInput.value
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");

        registrationButton.disabled = false;
        registrationButton.classList.remove('disabled');

        if (safeNameInputValue === '' || safeLoginInputValue === '' || safePasswordInputValue === '') {
            registrationButton.classList.add('disabled');
            registrationButton.disabled = true;
            alert('Все поля ввода должны быть заполнены');

            if (nameInput.value === '') {
                nameInput.classList.add('error');
            };
            if (loginInput.value === '') {
                loginInput.classList.add('error');
            };
            if (passwordInput.value === '') {
                passwordInput.classList.add('error');
            };

            return;
        };

        registration(safeNameInputValue, safeLoginInputValue, safePasswordInputValue)
            .then((responseData) => {
                setCommentName(responseData.user.name);
                setToken(responseData.user.token);
                myStorage.setItem(token, token);
                renderComments({ initEventListeners });
            });

    });

    // Срабатывание кнопки 'Зарегистрироваться' при клике на Enter
    const loginForm = document.querySelector(".login-form");
    loginForm.addEventListener('keyup', function (enter) {
        if (enter.keyCode === 13) {

            const safeNameInputValue = nameInput.value
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;");

            const safeLoginInputValue = loginInput.value
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;");

            const safePasswordInputValue = passwordInput.value
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;");

            registrationButton.disabled = false;
            registrationButton.classList.remove('disabled');

            if (safeNameInputValue === '' || safeLoginInputValue === '' || safePasswordInputValue === '') {
                registrationButton.classList.add('disabled');
                registrationButton.disabled = true;
                alert('Все поля ввода должны быть заполнены');

                if (nameInput.value === '') {
                    nameInput.classList.add('error');
                };
                if (loginInput.value === '') {
                    loginInput.classList.add('error');
                };
                if (passwordInput.value === '') {
                    passwordInput.classList.add('error');
                };

                return;
            };

            registration(safeNameInputValue, safeLoginInputValue, safePasswordInputValue)
                .then((responseData) => {
                    setCommentName(responseData.user.name);
                    setToken(responseData.user.token);
                    myStorage.setItem(token, token);
                    renderComments({ initEventListeners });
                });
        }
    });
};
import { app } from "./main.js";
import { signIn, token, setToken } from "./api.js";
import { renderComments, setCommentName } from "./renderComments.js";
import { initEventListeners } from "./like.js";
import { renderRegistrationPage } from "./registrationPage.js";

export const renderLoginPage = () => {
    const loginHTML = `
    <div class="breadcrumbs">
        <span class="breadcrumb sign-in breadcrumb-active">Вход</span>
        <span class="breadcrumb sign-up">Регистрация</span>
    </div>
    <div class="login-form">
        <div class="login-form-inputs">
            <input type="text" class="login-form-login" placeholder="Введите логин" />
            <input type="text" class="login-form-password" placeholder="Введите пароль" />
        </div>
        <div class="login-form-row">
            <button class="login-form-button">Войти</button>
        </div>
    </div>
    `;

    app.innerHTML = loginHTML;

    const signUpLink = document.querySelector(".sign-up");
    signUpLink.addEventListener('click', renderRegistrationPage);

    const loginInput = document.querySelector(".login-form-login");
    const passwordInput = document.querySelector(".login-form-password");

    loginInput.addEventListener('input', () => {
        loginInput.classList.remove('error');
        signInButton.disabled = false;
    });

    passwordInput.addEventListener('input', () => {
        passwordInput.classList.remove('error');
        signInButton.disabled = false;
    });

    const signInButton = document.querySelector(".login-form-button");
    signInButton.addEventListener('click', () => {

        const safeLoginInputValue = loginInput.value
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");

        const safePasswordInputValue = passwordInput.value
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");

        signInButton.disabled = false;
        signInButton.classList.remove('disabled');

        if (safeLoginInputValue === '' || safePasswordInputValue === '') {
            signInButton.classList.add('disabled');
            signInButton.disabled = true;
            alert('Все поля ввода должны быть заполнены');

            if (loginInput.value === '') {
                loginInput.classList.add('error');
            };
            if (passwordInput.value === '') {
                passwordInput.classList.add('error');
            };

            return;
        };

        signIn(safeLoginInputValue, safePasswordInputValue)
            .then((responseData) => {
                setCommentName(responseData.user.name);
                setToken(responseData.user.token);
                renderComments({ initEventListeners });
            });
    });

    // Срабатывание кнопки 'Вход' при клике на Enter
    const loginForm = document.querySelector(".login-form");
    loginForm.addEventListener('keyup', function (enter) {
        if (enter.keyCode === 13) {

            const safeLoginInputValue = loginInput.value
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;");

            const safePasswordInputValue = passwordInput.value
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;");

            signInButton.disabled = false;
            signInButton.classList.remove('disabled');

            if (safeLoginInputValue === '' || safePasswordInputValue === '') {
                signInButton.classList.add('disabled');
                signInButton.disabled = true;
                alert('Все поля ввода должны быть заполнены');

                if (loginInput.value === '') {
                    loginInput.classList.add('error');
                };
                if (passwordInput.value === '') {
                    passwordInput.classList.add('error');
                };

                return;
            };

            signIn(safeLoginInputValue, safePasswordInputValue)
                .then((responseData) => {
                    setCommentName(responseData.user.name);
                    setToken(responseData.user.token);
                    renderComments({ initEventListeners });
                });
        }
    });
};
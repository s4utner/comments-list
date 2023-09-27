import { app } from "./main.js";
import { registration, signIn } from "./api.js";

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

    const safeLoginInputValue = loginInput.value
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");

    const safePasswordInputValue = passwordInput.value
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");

    const signInButton = document.querySelector(".login-form-button");
    signInButton.addEventListener('click', () => {
        signInButton.disabled = false;
        signInButton.classList.remove('disabled');

        if (safeLoginInputValue === '' || safePasswordInputValue === '') {
            signInButton.classList.add('disabled');
            signInButton.disabled = true;
            alert('Все поля ввода должны быть заполнены');
            return;
        } else {
            signIn(safeLoginInputValue, safePasswordInputValue);
        }
    })
};

export const renderRegistrationPage = () => {
    const loginHTML = `
    <div class="breadcrumbs">
        <span class="breadcrumb sign-in">Вход</span>
        <span class="breadcrumb sign-up breadcrumb-active">Регистрация</span>
    </div>
    <div class="login-form">
        <div class="login-form-inputs">
            <input type="text" class="login-form-name" placeholder="Введите Имя" />
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

    const registrationButton = document.querySelector(".login-form-button");
    registrationButton.addEventListener('click', () => {
        registrationButton.disabled = false;
        registrationButton.classList.remove('disabled');

        if (safeNameInputValue === '' || safeLoginInputValue === '' || safePasswordInputValue === '') {
            registrationButton.classList.add('disabled');
            registrationButton.disabled = true;
            alert('Все поля ввода должны быть заполнены');
            return;
        } else {
            registration(safeNameInputValue, safeLoginInputValue, safePasswordInputValue);
        }
    })
};
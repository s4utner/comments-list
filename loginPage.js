import { app } from "./main.js";

export const renderLoginPage = () => {
    const loginHTML = `
    <div class="breadcrumbs">
        <span class="breadcrumb sign-in breadcrumb-active">Вход</span>
        <span class="breadcrumb sign-up">Регистрация</span>
    </div>
    <div class="login-form">
        <div class="login-form-inputs">
            <input type="text" class="login-form-name" placeholder="Введите логин" />
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
}

export const renderRegistrationPage = () => {
    const loginHTML = `
    <div class="breadcrumbs">
        <span class="breadcrumb sign-in">Вход</span>
        <span class="breadcrumb sign-up breadcrumb-active">Регистрация</span>
    </div>
    <div class="login-form">
        <div class="login-form-inputs">
            <input type="text" class="login-form-name" placeholder="Введите Имя" />
            <input type="text" class="login-form-name" placeholder="Введите логин" />
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
}
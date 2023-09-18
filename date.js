export const dateOnGet = ({ defaultDate }) => {
    return new Date(defaultDate).toLocaleDateString() + " "
        + (new Date(defaultDate).getHours() < 10 ? '0' + new Date(defaultDate).getHours() : new Date(defaultDate).getHours()) + ":"
        + (new Date(defaultDate).getMinutes() < 10 ? '0' + new Date(defaultDate).getMinutes() : new Date(defaultDate).getMinutes()) + ":"
        + (new Date(defaultDate).getSeconds() < 10 ? '0' + new Date(defaultDate).getSeconds() : new Date(defaultDate).getSeconds())
}

export const currentDate = new Date();

export const dateOnPush = ({ currentDate }) => {
    return new Date(currentDate).toLocaleDateString() + " "
        + (new Date(currentDate).getHours() < 10 ? '0' + new Date(currentDate).getHours() : new Date(currentDate).getHours()) + ":"
        + (new Date(currentDate).getMinutes() < 10 ? '0' + new Date(currentDate).getMinutes() : new Date(currentDate).getMinutes()) + ":"
        + (new Date(currentDate).getSeconds() < 10 ? '0' + new Date(currentDate).getSeconds() : new Date(currentDate).getSeconds())
}
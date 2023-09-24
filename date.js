export const date = ({ defaultDate }) => {
    return new Date(defaultDate).toLocaleDateString() + " "
        + (new Date(defaultDate).getHours() < 10 ? '0' + new Date(defaultDate).getHours() : new Date(defaultDate).getHours()) + ":"
        + (new Date(defaultDate).getMinutes() < 10 ? '0' + new Date(defaultDate).getMinutes() : new Date(defaultDate).getMinutes()) + ":"
        + (new Date(defaultDate).getSeconds() < 10 ? '0' + new Date(defaultDate).getSeconds() : new Date(defaultDate).getSeconds())
}
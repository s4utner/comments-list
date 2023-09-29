export const initEventListeners = ({ comment, renderComments }) => {
    const likeButtonElement = document.querySelectorAll('.like-button');
    for (const item of likeButtonElement) {
        item.addEventListener('click', (event) => {
            event.stopPropagation();
            const index = item.dataset.index;
            if (comment[index].isLiked) {
                comment[index].isLiked = false;
                comment[index].likes--;
            } else {
                comment[index].isLiked = true;
                comment[index].likes++;
            }
            renderComments({ comment, initEventListeners });
        });
    };
};
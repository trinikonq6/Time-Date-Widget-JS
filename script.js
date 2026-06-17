const monthNames = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

function pad(n) {
    return String(n).padStart(2, '0');
}

function updateDateTime(doc = document) {
    const now = new Date();

    const day = now.getDate(); // день месяца
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    const dayEl = doc.getElementById('day');
    const monthEl = doc.getElementById('month');
    const yearEl = doc.getElementById('year');
    const hoursEl = doc.getElementById('hours');
    const minutesEl = doc.getElementById('minutes');
    const secondsEl = doc.getElementById('seconds');

    if (dayEl) dayEl.textContent = pad(day);
    if (monthEl) monthEl.textContent = month;
    if (yearEl) yearEl.textContent = year;

    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;
}

function startDateTimeUpdate(doc = document) {
    updateDateTime(doc);
    setInterval(() => updateDateTime(doc), 1000);
}
const winbutton = document.querySelector('#button1');
const widget = document.querySelector('.container');
winbutton.addEventListener('click', async() => {
    //проверка браузера
    if ('documentPictureInPicture' in window) {
        // закрытие окна
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
            return;
        }
        try {
            //открыть окно pip
            const pipWindow = await window.documentPictureInPicture.requestWindow({
                width: 200,
                height: 94,
            });
            // копирование стиля
            [...document.styleSheets].forEach((styleSheet) => {
                try {
                    const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('\n');
                    const style = document.createElement('style');
                    style.textContent = cssRules;
                    pipWindow.document.head.appendChild(style);
                } catch (e) {
                }
            });

            // убираем все отступы в PiP окне и заполняем контейнер на всё окно
            const pipStyle = pipWindow.document.createElement('style');
            pipStyle.textContent = `
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                .container {
                    width: 100% !important;
                    height: 100% !important;
                }
            `;
            pipWindow.document.head.appendChild(pipStyle);

            // инициализируем логику для оконного режима
            pipWindow.document.body.appendChild(widget.cloneNode(true));
            startDateTimeUpdate(pipWindow.document);
        } catch (error) {
            console.error('PiP error:', error);
        }
    }
});

// обновление каждую секунду
startDateTimeUpdate();
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Отримуємо форму
const form = document.querySelector('.form');

// Функція створення промісу
function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

// Обробник сабміту форми
form.addEventListener('submit', event => {
  event.preventDefault();

  // Отримуємо дані з форми
  const formData = new FormData(event.target);
  const delay = Number(formData.get('delay'));
  const state = formData.get('state');

  // Валідація
  if (!delay || delay < 0) {
    iziToast.error({
      title: 'Помилка',
      message: 'Будь ласка, введіть коректну затримку (число > 0)',
      position: 'topRight',
      timeout: 3000,
      titleColor: '#fff',
      messageColor: '#fff',
      iconColor: '#fff',
    });
    return;
  }

  if (!state) {
    iziToast.error({
      title: 'Помилка',
      message: 'Будь ласка, оберіть стан промісу',
      position: 'topRight',
      timeout: 3000,
      titleColor: '#fff',
      messageColor: '#fff',
      iconColor: '#fff',
    });
    return;
  }

  // Створюємо та обробляємо проміс
  createPromise(delay, state)
    .then(delay => {
      iziToast.success({
        title: '✅ Fulfilled',
        message: `Promise resolved in ${delay}ms`,
        position: 'topRight',
        timeout: delay,
        titleColor: '#fff',
        messageColor: '#fff',
        iconColor: '#fff',
        progressBarColor: 'rgba(255, 255, 255, 0.5)',
      });
    })
    .catch(delay => {
      iziToast.error({
        title: '❌ Rejected',
        message: `Promise rejected in ${delay}ms`,
        position: 'topRight',
        timeout: delay,
        titleColor: '#fff',
        messageColor: '#fff',
        iconColor: '#fff',
        progressBarColor: 'rgba(255, 255, 255, 0.5)',
      });
    });

  
  event.target.reset();
});

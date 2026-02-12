import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Елементи DOM
const datetimePicker = document.getElementById('datetime-picker');
const startBtn = document.querySelector('[data-start]');

// Елементи таймера
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

// Змінна для зберігання обраної дати
let userSelectedDate = null;
let timerInterval = null;

// Опції для flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    // Перевірка, чи дата в майбутньому
    if (selectedDate <= new Date()) {
      userSelectedDate = null;
      startBtn.disabled = true;

      iziToast.error({
        title: 'Помилка',
        message: 'Please choose a date in the future',
        position: 'topRight',
        timeout: 5000,
      });
    } else {
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    }
  },
};

// Ініціалізація flatpickr
flatpickr(datetimePicker, options);

// Функція конвертації мілісекунд
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція додавання ведучого нуля
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Функція оновлення інтерфейсу таймера
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}


function startTimer() {
  if (!userSelectedDate) return;

  
  datetimePicker.disabled = true;
  startBtn.disabled = true;

 
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = setInterval(() => {
    const currentTime = new Date();
    const timeDifference = userSelectedDate - currentTime;

    
    if (timeDifference <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;

     
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      
      datetimePicker.disabled = false;

      
      iziToast.success({
        title: 'Готово',
        message: 'Таймер завершив роботу!',
        position: 'topRight',
        timeout: 3000,
      });

      return;
    }

    
    const timeLeft = convertMs(timeDifference);
    updateTimerDisplay(timeLeft);
  }, 1000);
}

// Слухач події для кнопки Start
startBtn.addEventListener('click', startTimer);

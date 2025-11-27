document.addEventListener("DOMContentLoaded", function () {
    // Элементы DOM
    const thimbles = document.querySelectorAll(".thimble");
    const balls = document.querySelectorAll(".ball");
    const startBtn = document.getElementById("start-btn");
    const resetBtn = document.getElementById("reset-btn");
    const messageEl = document.getElementById("message");
    const winsEl = document.getElementById("wins");
    const lossesEl = document.getElementById("losses");
    const balanceEl = document.getElementById("balance");
    const betAmountInput = document.getElementById("bet-amount");
    const betButtons = document.querySelectorAll(".bet-btn");

    // Переменные игры
    let gameActive = false;
    let ballPosition = -1;
    let wins = 0;
    let losses = 0;
    let balance = 1000;
    let currentBet = 50;

    // Обновление отображения баланса
    function updateBalance() {
      balanceEl.textContent = balance;
    }

    // Установка ставки
    function setBet(amount) {
      currentBet = amount;
      betAmountInput.value = amount;

      // Обновление активной кнопки
      betButtons.forEach((btn) => {
        if (parseInt(btn.dataset.bet) === amount) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }

    // Инициализация игры
    function initGame() {
      // Проверка баланса
      if (balance < currentBet) {
        messageEl.textContent = "Недостаточно средств для ставки!";
        messageEl.className = "message lose";
        return;
      }

      // Снятие ставки с баланса
      balance -= currentBet;
      updateBalance();

      // Сброс состояния
      gameActive = true;
      messageEl.textContent = `Ставка ${currentBet} сделана! Выберите наперсток!`;
      messageEl.className = "message";

      // Скрыть все шарики
      balls.forEach((ball) => {
        ball.style.display = "none";
      });

      // Выбрать случайный наперсток для шарика
      ballPosition = Math.floor(Math.random() * 3);

      // Включить обработчики кликов
      thimbles.forEach((thimble) => {
        thimble.style.cursor = "pointer";
        thimble.addEventListener("click", handleThimbleClick);
      });
    }

    // Обработчик клика по наперстку
    function handleThimbleClick(e) {
      if (!gameActive) return;

      const clickedThimble = e.currentTarget;
      const thimbleId = clickedThimble.id;
      const thimbleIndex = parseInt(thimbleId.replace("thimble", "")) - 1;

      // Показать шарик под выбранным наперстком
      balls[thimbleIndex].style.display = "block";

      // Проверить результат
      if (thimbleIndex === ballPosition) {
        // Победа
        const winAmount = currentBet * 2;
        balance += winAmount;
        updateBalance();

        messageEl.textContent = `Поздравляем! Вы нашли шарик и выиграли ${winAmount}!`;
        messageEl.className = "message win";
        wins++;
        winsEl.textContent = wins;
      } else {
        // Поражение
        messageEl.textContent = `К сожалению, шарик был под другим наперстком! Вы проиграли ${currentBet}.`;
        messageEl.className = "message lose";
        losses++;
        lossesEl.textContent = losses;

        // Показать правильный наперсток
        balls[ballPosition].style.display = "block";
      }

      // Отключить обработчики кликов
      thimbles.forEach((thimble) => {
        thimble.style.cursor = "default";
        thimble.removeEventListener("click", handleThimbleClick);
      });

      gameActive = false;
    }

    // Сброс игры
    function resetGame() {
      balance = 1000;
      wins = 0;
      losses = 0;
      currentBet = 50;

      updateBalance();
      winsEl.textContent = wins;
      lossesEl.textContent = losses;
      betAmountInput.value = currentBet;

      messageEl.textContent = "Игра сброшена!";
      messageEl.className = "message";

      // Сброс активных кнопок ставок
      betButtons.forEach((btn) => {
        if (parseInt(btn.dataset.bet) === currentBet) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });

      // Скрыть все шарики
      balls.forEach((ball) => {
        ball.style.display = "none";
      });

      // Отключить обработчики кликов
      thimbles.forEach((thimble) => {
        thimble.style.cursor = "default";
        thimble.removeEventListener("click", handleThimbleClick);
      });

      gameActive = false;
    }

    // Назначение обработчиков событий
    startBtn.addEventListener("click", initGame);
    resetBtn.addEventListener("click", resetGame);

    // Обработчики для кнопок ставок
    betButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        setBet(parseInt(this.dataset.bet));
      });
    });

    // Обработчик изменения поля ввода ставки
    betAmountInput.addEventListener("change", function () {
      let value = parseInt(this.value);

      // Проверка минимальной и максимальной ставки
      if (value < 10) value = 10;
      if (value > 1000) value = 1000;
      if (value > balance) value = balance;

      setBet(value);
    });

    // Инициализация при загрузке
    setBet(currentBet);
  });
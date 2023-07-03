let money = document.getElementById("money");
let balance = document.getElementById("balance");
let message = document.getElementById("message");
let buttons = document.getElementsByTagName("button");
let change = document.getElementById("change");
let moneyImgs = document.querySelectorAll(".cash-money>img");
let cashAcceptor = document.querySelector(".cash-acceptor-img");
let counterMoneyImgs = 3;
let currentDroppable = null;

for (let moneyImg of moneyImgs) {
  moneyImg.onmousedown = (e) => {
    moneyImg = e.currentTarget;
    moneyImg.style.position = "absolute";
    moneyImg.style.zIndex = 999;
    moneyImg.style.transform = "rotate(90deg)";
    moneyImg.style.height = "6rem";

    document.addEventListener("mousemove", moveElement);

    function onMouseMove(e) {
      moveElement(e.pageX, e.pageY);

      moneyImg.hidden = true;
      let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
      moneyImg.hidden = false;

      if (!elemBelow) return;

      let droppableBelow = elemBelow.closest(".droppable");
      if (currentDroppable != droppableBelow) {
        if (currentDroppable) {
          leaveDroppable();
        }
        currentDroppable = droppableBelow;
        if (currentDroppable) {
          enterDroppable();
        }
      }
    }

    document.addEventListener("mousemove", onMouseMove);

    moneyImg.onmouseup = () => {
      document.removeEventListener("mousemove", onMouseMove);
      moneyImg.onmouseup = null;
    };

    function enterDroppable() {
      moneyImg.style.boxShadow = "var(--box-shadow-green)";
    }

    function leaveDroppable() {
      moneyImg.style.boxShadow = "var(--box-shadow-red)";
    }

    moneyImg.ondragstart = () => false;

    document.onmouseup = () => {
      let moneyImgTop = moneyImg.getBoundingClientRect().top;
      let moneyImgLeft = moneyImg.getBoundingClientRect().left;
      let moneyImgRight = moneyImg.getBoundingClientRect().right;
      let cashAcceptorTop = cashAcceptor.getBoundingClientRect().top + 5;
      let cashAcceptorLeft = cashAcceptor.getBoundingClientRect().left + 5;
      let cashAcceptorRight = cashAcceptor.getBoundingClientRect().right - 5;
      let cashAcceptorBottom =
        cashAcceptor.getBoundingClientRect().bottom -
        (cashAcceptor.getBoundingClientRect().height / 3) * 2;

      document.removeEventListener("mousemove", moveElement);

      moneyImg.style.zIndex = 1;
      moneyImg.style.transform = "rotate(0deg)";
      moneyImg.style.height = "3rem";

      if (
        moneyImgTop > cashAcceptorTop &&
        moneyImgLeft > cashAcceptorLeft &&
        moneyImgRight < cashAcceptorRight &&
        moneyImgTop < cashAcceptorBottom
      ) {
        moneyImg.classList.add("hide-bill");
        setTimeout(() => (moneyImg.hidden = true), 1000);
        counterMoneyImgs -= 1;
        money.value = +money.value + +moneyImg.dataset.value;
        balance.innerHTML = `${money.value} руб.`;
        balance.style.boxShadow = "var(--box-shadow-blue)";
      }
      if (counterMoneyImgs === 0) {
        document.querySelector(".show-money-button").hidden = true;
      }
    };

    function moveElement(e) {
      moneyImg.style.top = e.pageY - moneyImg.offsetHeight / 2 + "px";
      moneyImg.style.left = e.pageX - moneyImg.offsetWidth / 2 + "px";
    }

    moneyImg.ondragstart = () => false;
  };
}

function buttonsDisable() {
  for (let button of buttons) {
    button.disabled = true;
  }
}

function buttonsEnable() {
  for (let button of buttons) {
    button.disabled = false;
  }
}

function showMoney() {
  let showMoneyButton = document.querySelector(".show-money-button");
  let cashMoney = document.querySelector(".cash-money");
  let walletOpen =
    '<img src="./coffee-img/icon-wallet-open.png" style="height:2.5rem;"/>';
  let walletClose =
    '<img src="./coffee-img/icon-wallet-close.png" style="height:2.5rem;"/>';
  let hide = `${walletOpen} Скрыть деньги`;
  let show = `${walletClose} Показать деньги`;
  if (showMoneyButton.value === "on") {
    showMoneyButton.value = "off";
    showMoneyButton.innerHTML = hide;
    cashMoney.style.display = "block";
  } else if (showMoneyButton.value === "off") {
    showMoneyButton.value = "on";
    showMoneyButton.innerHTML = show;
    cashMoney.style.display = "none";
  }
}

function getCoffee(price, name) {
  buttonsDisable();
  if (money.value >= price) {
    money.value -= price;
    balance.innerHTML = `${money.value} руб.`;
    startProgressBar(name);
  } else {
    noMoney(name);
    buttonsEnable();
  }
}

function startProgressBar(coffeeName) {
  let i = 0;
  let progressBar = document.querySelector(".progress-bar");
  progressBar.parentElement.hidden = false;
  isCooking(coffeeName);
  function progress() {
    buttonsDisable();
    i++;
    progressBar.style.width = i + "%";
    if (i === 60) {
      almostCooking(coffeeName);
    } else if (i === 100) {
      clearInterval(timerId);
      progressBar.parentElement.hidden = true;
      progressBar.style.width = 0 + "%";
      cofeeCooked(coffeeName);
      setTimeout(() => buttonsEnable(), 0);
    }
  }
  let timerId = setInterval(progress, 70);
}

function getChange(num) {
  if (num === 0) {
    change.innerHTML =
      '<span style="color:#ee7231;">На балансе нет денег!</span>';
    balance.style.boxShadow = "var(--box-shadow-grey)";
    return;
  }
  let coins = [];
  let result = "";
  let button = document.querySelector(".get-change-button");
  let rubl1 = '<img src="./coffee-img/icon-1rubl.png" style="height:2.5rem;"/>';
  let rubl2 =
    '<img src="./coffee-img/icon-2rublya.png" style="height:2.5rem"/>';
  let rubl5 =
    '<img src="./coffee-img/icon-5rubley.png" style="height:2.5rem"/>';
  let rubl10 =
    '<img src="./coffee-img/icon-10rubley.png" style="height:2.5rem"/>';
  for (let coin of [10, 5, 2, 1]) {
    const count = parseInt(num / coin);
    num = num % coin;
    if (count > 0) {
      if (coin === 1) coins.push(`${rubl1} x ${count}`);
      if (coin === 2) coins.push(`${rubl2} x ${count}`);
      if (coin === 5) coins.push(`${rubl5} x ${count}`);
      if (coin === 10) coins.push(`${rubl10} x ${count}`);
    }
  }
  result = `<p> ${coins.join(",  ")} </p>`;
  money.value = "";
  message.innerHTML = "";
  balance.innerHTML = `0 руб.`;
  change.innerHTML = result;
  balance.style.boxShadow = "var(--box-shadow-grey)";
}

function addMoney() {
  deleteMessage(message.target);
  deleteChange(change.target);
  money.value = +money.value + 100;
  balance.innerHTML = `${money.value} руб.`;
  balance.style.boxShadow = "var(--box-shadow-blue)";
}

function isCooking(name) {
  let coffeeImg =
    '<img src="./coffee-img/coffee-progress.gif" style="height:4rem;"/>';
  if (name === "Молоко") {
    let out = `
    <div class="coffee-text">
    ${coffeeImg}<span style="color:#ac8345">Вашe ${name.toLowerCase()} готовится...</span>
    </div>
    `;
    message.innerHTML = out;
  } else {
    let out = `
    <div class="coffee-text">
     ${coffeeImg}<span style="color:#ac8345">Ваш ${name.toLowerCase()} готовится...</span>
    </div>
    `;
    message.innerHTML = out;
  }
}

function almostCooking(name) {
  let coffeeImg =
    '<img src="./coffee-img/coffee-progress.gif" style="height:4rem;"/>';
  if (name === "Молоко") {
    let out = `
    <div class="coffee-text">
      ${coffeeImg}<span style="color:#719d34">Вашe ${name.toLowerCase()} почти готово...</span>
    </div>
    `;
    message.innerHTML = out;
  } else {
    let out = `
    <div class="coffee-text">
    ${coffeeImg}<span style="color:#719d34">Ваш ${name.toLowerCase()} почти готов...</span>
    </div>
    `;
    message.innerHTML = out;
  }
}

function cofeeCooked(name) {
  let coffeeImg = '<img src="./coffee-img/coffee-cat.png" class="coffee-cat"/>';
  if (name === "Молоко") {
    let out = `
      <span style="color:#00646b; position:relative; top:1.5rem;">Вашe ${name.toLowerCase()} готово!</span>
      <br>${coffeeImg}
    `;
    message.innerHTML = out;
  } else {
    let out = `
      <span style="color:#00646b; position:relative; top:1.5rem;">Ваш ${name.toLowerCase()} готов!</span>
      <br>${coffeeImg}
    `;
    message.innerHTML = out;
  }
}

function noMoney(name) {
  let poverty =
    '<img src="./coffee-img/icon-poverty.png" style="height:2.5rem"/>';
  let out = `${poverty}<span style="color:#ee7231">Денег на ${name.toLowerCase()} не хватает!</span>`;
  message.innerHTML = out;
}

function deleteMessage() {
  message.innerHTML = "";
}

function deleteChange() {
  change.innerHTML = "";
}
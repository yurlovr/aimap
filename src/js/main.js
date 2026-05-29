import tippy from "tippy.js";
import TomSelect from "tom-select";

const plugin_n_items = function () {
  const self = this;
  let div;

  const itemCount = function () {
    if (self.items.length > 0) {
      div.innerText = `${self.settings.placeholder} (${self.items.length})`;
    } else {
      div.innerText = self.settings.placeholder;
    }
  };

  self.on("initialize", () => {
    div = document.createElement("div");
    div.className = "ts-n-items";
    const chevron = document.createElement("b");
    chevron.className = "ts-chevron";
    self.control.append(chevron);
    self.control.append(div);
    itemCount();
  });

  self.on("item_remove", itemCount);
  self.on("item_add", itemCount);
};

document.addEventListener("DOMContentLoaded", function () {
  // SELECT START
  const selects = document.querySelectorAll(".js-select");
  if (selects?.length > 0) {
    TomSelect.define("n_items", plugin_n_items);

    selects.forEach((select) => {
      new TomSelect(select, {
        // Your configuration settings here
        plugins: [
          "n_items",
          "checkbox_options",
          "no_backspace_delete",
          "clear_button",
        ],
        persist: false,
        hideSelected: false,
        controlInput: null,
        render: {
          option: function (data, escape) {
            return `<div class="custom-option">${data.text}</div>`;
          },
          item: function (data, escape) {
            return "<span></span>";
          },
        },
      });
    });
  }

  // SELECT END

  //TIPPY START
  tippy(".js-tooltip", {
    placement: "bottom",
  });
  //TIPPY END

  // BG ANIMATION START
  const interBubble = document.querySelector(".js-gradient-interactive");
  if (interBubble) {
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    function move() {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      requestAnimationFrame(() => {
        move();
      });
    }

    window.addEventListener("mousemove", (event) => {
      tgX = event.clientX;
      tgY = event.clientY;
    });

    move();
  }
  // BG ANIMATION START

  // MOBILE MENU MODAL START
  const mobileMenuTriggerButton = document.querySelector(
    ".js-mobile-menu-trigger",
  );
  const mobileMenu = document.querySelector(".header-mobile-menu");
  const mobileMenuClose = document.querySelector(
    ".js-header-mobile-menu-close",
  );
  mobileMenuTriggerButton.addEventListener("click", () => {
    mobileMenu?.classList.add("isActive");
    document.body.classList.add("no-scroll");
  });
  mobileMenuClose.addEventListener("click", () => {
    mobileMenu?.classList.remove("isActive");
    document.body.classList.remove("no-scroll");
  });
  // MOBILE MENU MODAL END

  // CONTACT-US MODAL START

  const contactUsButtons = document.querySelectorAll(".js-contact-us-button");
  const contactUsModal = document.querySelector(".js-contact-us-modal");

  const contactUsCloseButtons = document.querySelectorAll(
    ".js-contact-us-close",
  );

  contactUsCloseButtons.forEach((element) => {
    element.addEventListener("click", () => {
      contactUsModal?.classList.remove("isVisible");
      document.body.classList.remove("no-scroll");
    });
  });
  contactUsButtons.forEach((element) => {
    element.addEventListener("click", () => {
      contactUsModal?.classList.add("isVisible");
      mobileMenu?.classList.remove("isActive");
      document.body.classList.add("no-scroll");
    });
  });

  // CONTACT-US MODAL END

  // SUCCESS MODAL START

  const successModal = document.querySelector(".js-success-modal");

  const successCloseButtons = document.querySelectorAll(".js-success-close");

  successCloseButtons.forEach((element) => {
    element.addEventListener("click", () => {
      successModal?.classList.remove("isVisible");
      document.body.classList.remove("no-scroll");
    });
  });

  // SUCCESS MODAL END
});

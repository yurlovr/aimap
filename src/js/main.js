import { $ } from "jquery";
import "select2";
import tippy from "tippy.js";
import select2 from "select2";

select2();

document.addEventListener("DOMContentLoaded", () => {
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

  const closeButtons = document.querySelectorAll(".js-contact-us-close");

  closeButtons.forEach((element) => {
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
});

// SELECT START

$.fn.select2.amd.define(
  "CustomSelectionAdapter",
  [
    "select2/utils",
    "select2/selection/multiple",
    "select2/selection/placeholder",
    "select2/selection/eventRelay",
    "select2/selection/single",
  ],
  function (
    Utils,
    MultipleSelection,
    Placeholder,
    EventRelay,
    SingleSelection,
  ) {
    // Decorates MultipleSelection with Placeholder
    let adapter = Utils.Decorate(MultipleSelection, Placeholder);
    // Decorates adapter with EventRelay - ensures events will continue to fire
    // e.g. selected, changed
    adapter = Utils.Decorate(adapter, EventRelay);

    adapter.prototype.render = function () {
      // Use selection-box from SingleSelection adapter
      // This implementation overrides the default implementation
      let $selection = SingleSelection.prototype.render.call(this);
      return $selection;
    };

    adapter.prototype.update = function (data) {
      // copy and modify SingleSelection adapter
      this.clear();

      let $rendered = this.$selection.find(".select2-selection__rendered");
      let noItemsSelected = data.length === 0;
      let formatted = "";

      if (noItemsSelected) {
        formatted = this.options.get("placeholder") || "";
      } else {
        let itemsData = {
          selected: data || [],
          all: this.$element.find("option") || [],
          placeholder: this.placeholder?.text || "",
        };
        // Pass selected and all items to display method
        // which calls templateSelection
        formatted = this.display(itemsData, $rendered);
      }

      $rendered.empty().append(formatted);
      $rendered.prop("title", formatted);
    };

    return adapter;
  },
);

$(document).ready(function () {
  $(".js-select").select2({
    selectionAdapter: $.fn.select2.amd.require("CustomSelectionAdapter"),
    templateSelection: (data) => {
      return $(
        `<div title="${data.placeholder}" class="select2-custom-selection">${data.placeholder} (${data.selected.length}) <button class="select2-custom-clear-btn" title="Очистить"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.00893 10.0002L2.00391 2.99514L2.99386 2.00519L9.99888 9.01021L17.0039 2.00519L17.9939 2.99514L10.9888 10.0002L17.9939 17.0052L17.0039 17.9951L9.99888 10.9901L2.99386 17.9951L2.00391 17.0052L9.00893 10.0002Z" fill="var(--RT-dark-orange)"/>
</svg></button></div>`,
      );
    },
    templateResult: function (data) {
      if (!data.id) {
        return data.text;
      }
      // Example: Adding an icon and bold text
      var $result = $(
        `<div class="select2-custom-option">${data.text} <div class="select2-custom-option__checkbox"> <div class="select2-custom-option__svg"></div></div></div>`,
      );
      return $result;
    },
    closeOnSelect: false,
    allowClear: true,
    width: "100%",
  });
  $(".select2-selection").on(
    "click",
    ".select2-custom-clear-btn",
    function (e) {
      e.stopPropagation();
      var $select = $(this).closest(".select2-container").prev("select");
      $select.val(null).trigger("change");
      $select.select2("close");
    },
  );
});

// SELECT END

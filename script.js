/* Spline Stage interactions: nav, parallax stage, canvas dust, reveals, modal, form */
(function () {
  "use strict";

  /* Sticky nav hamburger */
  var burger = document.getElementById("hamburger");
  var links = document.getElementById("navLinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Hero mouse parallax + tilt */
  var stage = document.getElementById("stage");
  var layers = Array.prototype.slice.call(document.querySelectorAll(".stage .layer"));
  var hero = document.getElementById("hero");
  if (stage && hero) {
    var raf = null;
    var tx = 0, ty = 0;
    function apply() {
      raf = null;
      layers.forEach(function (el) {
        var depth = parseFloat(el.getAttribute("data-depth") || "30");
        var x = (tx * depth) / 60;
        var y = (ty * depth) / 60;
        el.style.translate = x.toFixed(1) + "px " + y.toFixed(1) + "px";
      });
      var rx = (-ty * 7).toFixed(2);
      var ry = (tx * 9).toFixed(2);
      stage.style.transform = "rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
    }
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    hero.addEventListener("mouseleave", function () {
      tx = 0; ty = 0;
      layers.forEach(function (el) { el.style.translate = "0px 0px"; });
      stage.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  }

  /* Canvas star dust, solid dots only */
  var canvas = document.getElementById("stageCanvas");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var dots = [];
    var COLORS = ["#FF6B57", "#5EC8F2", "#FFC24B", "#9A8CFF", "#4ADE80", "#D6DCF0"];
    function sizeCanvas() {
      var r = canvas.parentElement.getBoundingClientRect();
      canvas.width = Math.max(300, Math.floor(r.width));
      canvas.height = Math.max(300, Math.floor(r.height));
    }
    function seed() {
      dots = [];
      var n = window.innerWidth < 600 ? 36 : 80;
      for (var i = 0; i < n; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: 1 + Math.random() * 2.4,
          c: COLORS[i % COLORS.length],
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          a: 0.25 + Math.random() * 0.5
        });
      }
    }
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
        ctx.globalAlpha = d.a;
        ctx.fillStyle = d.c;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    sizeCanvas(); seed(); tick();
    window.addEventListener("resize", function () { sizeCanvas(); seed(); });
  }

  /* Scroll reveals */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* Work card hover tilt on desktop */
  var cards = document.querySelectorAll(".workCard");
  cards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      if (window.innerWidth < 900) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = "translateY(-8px) rotateX(" + (-py * 6).toFixed(2) + "deg) rotateY(" + (px * 8).toFixed(2) + "deg)";
    });
    card.addEventListener("mouseleave", function () { card.style.transform = ""; });
  });

  /* Modal */
  var back = document.getElementById("modalBack");
  var mTag = document.getElementById("modalTag");
  var mTitle = document.getElementById("modalTitle");
  var mDesc = document.getElementById("modalDesc");
  var mStack = document.getElementById("modalStack");
  var mThumb = document.getElementById("modalThumb");
  var mClose = document.getElementById("modalClose");
  var mCta = document.getElementById("modalCta");
  var lastFocus = null;
  var THUMB_COLORS = ["#FF6B57", "#5EC8F2", "#FFC24B", "#9A8CFF", "#4ADE80", "#FF8A78"];

  function openModal(card, idx) {
    lastFocus = document.activeElement;
    mTag.textContent = card.getAttribute("data-tag") || "";
    mTitle.textContent = card.getAttribute("data-title") || "Project";
    mDesc.textContent = card.getAttribute("data-desc") || "";
    mStack.textContent = "Built with " + (card.getAttribute("data-stack") || "HTML plus CSS");
    mThumb.style.background = THUMB_COLORS[idx % THUMB_COLORS.length];
    back.hidden = false;
    document.body.style.overflow = "hidden";
    mClose.focus();
  }
  function closeModal() {
    back.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  cards.forEach(function (card, idx) {
    card.addEventListener("click", function () { openModal(card, idx); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(card, idx); }
    });
  });
  if (mClose) mClose.addEventListener("click", closeModal);
  if (back) back.addEventListener("click", function (e) { if (e.target === back) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && back && !back.hidden) closeModal(); });
  if (mCta) mCta.addEventListener("click", closeModal);

  /* Service plan preselect */
  var msg = document.getElementById("message");
  document.querySelectorAll("[data-plan]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var plan = btn.getAttribute("data-plan");
      if (msg && !msg.value) msg.value = "Hi Mara, I am interested in the " + plan + " plan. My goals are ";
    });
  });

  /* Contact validation */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("name");
      var email = document.getElementById("email");
      var budget = document.getElementById("budget");
      var note = document.getElementById("formNote");
      var ok = true;

      function setErr(input, errId, text) {
        var err = document.getElementById(errId);
        var field = input.closest(".field");
        if (text) {
          ok = false;
          if (err) err.textContent = text;
          if (field) field.classList.add("invalid");
        } else {
          if (err) err.textContent = "";
          if (field) field.classList.remove("invalid");
        }
      }

      var vName = name.value.trim();
      var vEmail = email.value.trim();
      var vMsg = msg.value.trim();
      setErr(name, "errName", vName.length < 2 ? "Please enter your name." : "");
      setErr(email, "errEmail", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vEmail) ? "" : "Please enter a valid email.");
      setErr(budget, "errBudget", budget.value ? "" : "Please choose a budget range.");
      setErr(msg, "errMessage", vMsg.length < 12 ? "Please add a few more details, 12 characters min." : "");

      if (!ok) {
        note.style.color = "#FF9B8D";
        note.textContent = "Please fix the fields above, then send again.";
        return;
      }
      note.style.color = "#4ADE80";
      note.textContent = "Thanks " + vName.split(" ")[0] + ". Message ready to send. Demo template stores nothing.";
      form.reset();
    });
  }

  /* Footer year */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();

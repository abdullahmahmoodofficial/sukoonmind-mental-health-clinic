
const WA = "923001234567";
// Mobile nav
const burger = document.getElementById("hamburger");
const nav = document.getElementById("nav");
if (burger) burger.addEventListener("click", () => nav.classList.toggle("open"));
// Scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Therapists data (focus areas, languages, formats — no invented credentials)
const THERAPISTS = [
  { focus: "Anxiety & Stress", areas: ["anxiety", "stress", "burnout", "sleep"], langs: "Urdu, English", mode: "In person & Online", img: "images/therapist.jpg", desc: "Support for worry, panic, work stress and sleep difficulties — practical tools for calmer days." },
  { focus: "Low Mood & Grief", areas: ["low mood", "grief", "loss", "depression"], langs: "Urdu, English", mode: "In person & Online", img: "images/calm.jpg", desc: "A gentle space for grief, loss and low mood, at whatever pace feels right for you." },
  { focus: "Relationships & Family", areas: ["relationships", "family", "couples", "marriage"], langs: "Urdu, English", mode: "In person", img: "images/family.jpg", desc: "Couples and family sessions that help everyone feel heard and understood." },
  { focus: "Teens & Students", areas: ["teens", "students", "exams", "confidence"], langs: "Urdu, English", mode: "In person & Online", img: "images/teens.jpg", desc: "For ages 13–22: exam pressure, confidence, friendships and big decisions." },
  { focus: "Trauma Support", areas: ["trauma", "ptsd", "abuse", "healing"], langs: "Urdu, English", mode: "In person", img: "images/mindfulness.jpg", desc: "Slow, careful support after difficult experiences — safety and choice come first." },
  { focus: "Online Therapy", areas: ["online", "anxiety", "stress", "low mood"], langs: "Urdu, English", mode: "Online only", img: "images/online.jpg", desc: "Private video sessions from your own home, anywhere in Pakistan." },
];
const CATS = ["All", "Anxiety", "Low Mood", "Relationships", "Teens", "Trauma", "Online"];
const thGrid = document.getElementById("thGrid");
if (thGrid) {
  const filt = document.getElementById("thFilters");
  CATS.forEach(c => {
    const b = document.createElement("button");
    b.textContent = c;
    if (c === "All") b.classList.add("on");
    b.addEventListener("click", () => {
      filt.querySelectorAll("button").forEach(x => x.classList.remove("on"));
      b.classList.add("on"); renderTh(c);
    });
    filt.appendChild(b);
  });
  function card(t) {
    return `<div class="card"><div class="card-body"><img src="${t.img}" alt="${t.focus} therapy setting"><h3>${t.focus}</h3><p>${t.desc}</p><p><b>Languages:</b> ${t.langs}<br><b>Format:</b> ${t.mode}</p><a href="booking.html?service=${encodeURIComponent(t.focus)}" class="btn btn-outline">Book this focus &rarr;</a></div></div>`;
  }
  function renderTh(cat) {
    const q = (document.getElementById("thSearch").value || "").toLowerCase();
    const list = THERAPISTS.filter(t => (cat === "All" || t.focus.toLowerCase().includes(cat.toLowerCase()) || t.areas.includes(cat.toLowerCase())) &&
      (q === "" || t.focus.toLowerCase().includes(q) || t.areas.some(a => a.includes(q)) || t.desc.toLowerCase().includes(q)));
    thGrid.innerHTML = list.map(card).join("") || "<p>No match — try a different word, or book with 'Not sure yet' and we will help you choose.</p>";
    document.getElementById("thCount").textContent = list.length + " focus area(s) available";
  }
  document.getElementById("thSearch").addEventListener("input", () => {
    const on = filt.querySelector("button.on");
    renderTh(on ? on.textContent : "All");
  });
  renderTh("All");
}

// Wellbeing check-in
const checkinBtn = document.getElementById("checkinBtn");
if (checkinBtn) {
  const vals = {};
  document.querySelectorAll(".opts").forEach(g => {
    g.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
      g.querySelectorAll("button").forEach(x => x.classList.remove("sel"));
      b.classList.add("sel");
      vals[g.dataset.q] = parseInt(b.dataset.v, 10);
    }));
  });
  checkinBtn.addEventListener("click", () => {
    const box = document.getElementById("checkinResult");
    if (Object.keys(vals).length < 4) {
      box.hidden = false; box.textContent = "Please answer all four questions first — it only takes a moment.";
      return;
    }
    const total = Object.values(vals).reduce((a, b) => a + b, 0);
    let msg;
    if (total >= 7) msg = "You seem to be coping well overall — keep doing what helps, and remember a session is always here if things get heavier.";
    else if (total >= 4) msg = "Life feels heavy in places right now. A single private session can help untangle things — consider booking a first conversation, with no obligation to continue.";
    else msg = "Things sound really tough right now, and you deserve support soon. Please consider booking a session this week — and if you ever feel unsafe, reach out to someone you trust or local emergency services right away.";
    box.hidden = false;
    box.innerHTML = msg + ' <a href="booking.html">Book a private session &rarr;</a>';
  });
}

// Booking form -> WhatsApp + reference
const bookForm = document.getElementById("bookForm");
if (bookForm) {
  const params = new URLSearchParams(location.search);
  if (params.get("service")) {
    const sel = document.getElementById("bService");
    [...sel.options].forEach(o => { if (params.get("service") === o.text) sel.value = o.value; });
  }
  if (params.get("mode") === "Online") document.getElementById("bMode").value = "Online — video call";
  bookForm.addEventListener("submit", e => {
    e.preventDefault();
    const ref = "SK-" + Math.floor(100000 + Math.random() * 900000);
    const msg = `Hello SukoonMind, I would like to book a session.\nName: ${document.getElementById("bName").value}\nService: ${document.getElementById("bService").value}\nFormat: ${document.getElementById("bMode").value}\nLanguage: ${document.getElementById("bLang").value}\nPreferred: ${document.getElementById("bDate").value} at ${document.getElementById("bTime").value}\nNote: ${document.getElementById("bNote").value || "-"}`;
    const box = document.getElementById("bSuccess");
    box.hidden = false;
    box.innerHTML = `Thank you! Your booking reference is <b>${ref}</b>. Please tap below to confirm on WhatsApp — your slot is held once we reply.<br><br><a class="btn btn-peach" href="https://wa.me/${WA}?text=${encodeURIComponent(msg)}">Confirm on WhatsApp &rarr;</a>`;
    box.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

// Contact form (simulated success)
const contactForm = document.getElementById("contactForm");
if (contactForm) contactForm.addEventListener("submit", e => {
  e.preventDefault();
  const box = document.getElementById("cSuccess");
  box.hidden = false;
  box.textContent = "Thank you, " + document.getElementById("cName").value + "! Your private message has been received. We reply during clinic hours (Mon–Sat, 10 AM – 8 PM).";
  contactForm.reset();
});

// FAQ accordion
document.querySelectorAll(".faq-q").forEach(q => q.addEventListener("click", () => {
  const a = q.nextElementSibling;
  a.classList.toggle("open");
}));

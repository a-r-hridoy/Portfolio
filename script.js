const words = [
  "Shopify Expert.",
  "Theme Developer.",
  "Shopify App Developer.",
  "Speed Optimization Specialist.",
  "Ecommerce Solutions Expert."
];
const typingText = document.querySelector("#typing-text");
if (window.lucide) lucide.createIcons();
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const word = words[wordIndex];
  typingText.textContent = word.slice(0, charIndex);
  if (!deleting && charIndex < word.length) charIndex++;
  else if (deleting && charIndex > 0) charIndex--;
  else {
    deleting = !deleting;
    if (!deleting) wordIndex = (wordIndex + 1) % words.length;
  }
  setTimeout(typeLoop, deleting ? 45 : 85);
}
typeLoop();

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

const progress = document.querySelector(".scroll-progress");
const backToTop = document.querySelector(".back-to-top");
const sections = [...document.querySelectorAll("main section[id]")];
const navItems = [...document.querySelectorAll(".nav-links a")];

function handleScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${(scrollY / max) * 100}%`;
  backToTop.classList.toggle("show", scrollY > 700);

  const active = [...sections].reverse().find((section) => scrollY >= section.offsetTop - 140);
  navItems.forEach((item) => item.classList.toggle("active", active && item.hash === `#${active.id}`));
}
addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

backToTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

document.querySelectorAll(".ripple").forEach((button) => {
  button.addEventListener("click", (event) => {
    const pulse = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    pulse.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:${event.clientX - rect.left - size / 2}px;top:${event.clientY - rect.top - size / 2}px;border-radius:50%;background:rgba(255,255,255,.45);transform:scale(0);animation:ripple .6s ease-out;pointer-events:none;`;
    button.appendChild(pulse);
    setTimeout(() => pulse.remove(), 650);
  });
});

const style = document.createElement("style");
style.textContent = "@keyframes ripple{to{transform:scale(2.4);opacity:0}}";
document.head.appendChild(style);

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -7}deg) rotateY(${x * 7}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".filters button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filters .active").classList.remove("active");
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".project-card").forEach((card) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.style.display = visible ? "" : "none";
    });
  });
});

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  const status = contactForm.querySelector(".form-status");
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector("button[type='submit']");
    const formData = Object.fromEntries(new FormData(contactForm));

    submitButton.disabled = true;
    status.textContent = "Sending message...";

    try {
      const result = await fetch(contactForm.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await result.json();

      if (!result.ok || !data.ok) {
        throw new Error(data.message || "Message failed");
      }

      contactForm.reset();
      status.textContent = "Message sent successfully. I will reply soon.";
    } catch (error) {
      status.textContent = "Message could not be sent. Please contact me on Telegram or email.";
    } finally {
      submitButton.disabled = false;
    }
  });
}

const testimonials = [...document.querySelectorAll(".testimonial")];
const dots = [...document.querySelectorAll(".slider-dots button")];
let testimonialIndex = 0;

function showTestimonial(index) {
  testimonialIndex = index;
  testimonials.forEach((item, itemIndex) => item.classList.toggle("active", itemIndex === index));
  dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === index));
}

dots.forEach((dot, index) => dot.addEventListener("click", () => showTestimonial(index)));
setInterval(() => showTestimonial((testimonialIndex + 1) % testimonials.length), 4200);

for (let i = 0; i < 42; i++) {
  const particle = document.createElement("span");
  particle.className = "particle";
  particle.style.left = `${Math.random() * 100}vw`;
  particle.style.animationDuration = `${8 + Math.random() * 10}s`;
  particle.style.animationDelay = `${Math.random() * -12}s`;
  particle.style.setProperty("--drift", `${(Math.random() - 0.5) * 160}px`);
  document.querySelector(".particle-field").appendChild(particle);
}

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray(".reveal-up, .reveal-left, .reveal-right").forEach((element) => {
    const x = element.classList.contains("reveal-left") ? -42 : element.classList.contains("reveal-right") ? 42 : 0;
    gsap.from(element, {
      x,
      y: element.classList.contains("reveal-up") ? 38 : 0,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: element, start: "top 84%" }
    });
  });

  gsap.to(".floating-card", {
    y: -18,
    duration: 2.4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: 0.2
  });

  gsap.utils.toArray(".bar span").forEach((bar) => {
    gsap.to(bar, {
      width: bar.style.getPropertyValue("--level"),
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: { trigger: bar, start: "top 88%" }
    });
  });

  document.querySelectorAll("[data-count]").forEach((counter) => {
    gsap.to(counter, {
      textContent: counter.dataset.count,
      duration: 1.6,
      snap: { textContent: 1 },
      scrollTrigger: { trigger: counter, start: "top 88%" }
    });
  });
}

document.addEventListener("mousemove", (event) => {
  const x = (event.clientX / innerWidth - 0.5) * 16;
  const y = (event.clientY / innerHeight - 0.5) * 16;
  document.querySelectorAll(".hero-glow").forEach((glow, index) => {
    glow.style.transform = `translate(${x * (index + 1)}px, ${y * (index + 1)}px)`;
  });
});

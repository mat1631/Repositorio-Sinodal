// Modal PDF - Seu código original
document.addEventListener('DOMContentLoaded', () => {
  const pdfButtons = document.querySelectorAll('.file-action');
  const modal = document.getElementById('pdfModal');
  const iframe = modal.querySelector('iframe');
  const closeBtn = modal.querySelector('.close-btn');
  const modalTitle = modal.querySelector('.modal-title');


  pdfButtons.forEach(button => {
      button.addEventListener('click', (e) => {
          e.preventDefault();
          const pdfUrl = button.getAttribute('data-pdf');
          const fileTitle = button.closest('.file-card').querySelector('.file-title').textContent;
          
          if (pdfUrl) {
              iframe.src = pdfUrl;
              modalTitle.textContent = fileTitle;
              modal.style.display = 'block';
              button.setAttribute('aria-expanded', 'true');
              modal.focus();
          }
      });
  });

  closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      iframe.src = '';
      pdfButtons.forEach(button => button.setAttribute('aria-expanded', 'false'));
  });

  window.addEventListener('click', (e) => {
      if (e.target === modal) {
          modal.style.display = 'none';
          iframe.src = '';
          pdfButtons.forEach(button => button.setAttribute('aria-expanded', 'false'));
      }
  });

  // Fechar modal com ESC
  window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') {
          modal.style.display = 'none';
          iframe.src = '';
          pdfButtons.forEach(button => button.setAttribute('aria-expanded', 'false'));
      }
  });
  
  // Carrossel
  const track = document.querySelector(".carousel-track");
  const cards = Array.from(track.children);
  const nextButton = document.querySelector(".carousel-button.next");
  const prevButton = document.querySelector(".carousel-button.prev");
  const container = document.querySelector(".carousel-container");
  const indicators = document.querySelectorAll(".indicator");

  let currentIndex = 0;
  let cardWidth = cards[0].offsetWidth;
  let cardMargin = parseInt(window.getComputedStyle(cards[0]).marginRight) * 2;

  function debounce(func, wait, immediate) {
      var timeout;
      return function () {
          var context = this,
              args = arguments;
          var later = function () {
              timeout = null;
              if (!immediate) func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
      };
  }

  function initializeCarousel() {
      cardWidth = cards[0].offsetWidth;
      cardMargin = parseInt(window.getComputedStyle(cards[0]).marginRight) * 2;
      const initialOffset = container.offsetWidth / 2 - cardWidth / 2;
      track.style.transform = `translateX(${initialOffset}px)`;
      updateCarousel();
  }

  function updateCarousel() {
      cards.forEach((card, index) => {
          card.classList.remove(
              "is-active",
              "is-prev",
              "is-next",
              "is-far-prev",
              "is-far-next"
          );
          if (index === currentIndex) {
              card.classList.add("is-active");
          } else if (index === currentIndex - 1) {
              card.classList.add("is-prev");
          } else if (index === currentIndex + 1) {
              card.classList.add("is-next");
          } else if (index < currentIndex - 1) {
              card.classList.add("is-far-prev");
          } else if (index > currentIndex + 1) {
              card.classList.add("is-far-next");
          }
      });
      indicators.forEach((indicator, index) => {
          indicator.classList.toggle("active", index === currentIndex);
      });
  }

  function moveToSlide(targetIndex) {
      if (targetIndex < 0 || targetIndex >= cards.length) {
          return;
      }
      const amountToMove = targetIndex * (cardWidth + cardMargin);
      const containerCenter = container.offsetWidth / 2;
      const cardCenter = cardWidth / 2;
      const targetTranslateX = containerCenter - cardCenter - amountToMove;
      track.style.transform = `translateX(${targetTranslateX - 25}px)`;
      currentIndex = targetIndex;
      updateCarousel();
      const flashEffect = document.createElement("div");
      flashEffect.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--primary-light);
          z-index: 30;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
      `;
      container.appendChild(flashEffect);
      setTimeout(() => {
          flashEffect.style.opacity = "0.3";
          setTimeout(() => {
              flashEffect.style.opacity = "0";
              setTimeout(() => {
                  container.removeChild(flashEffect);
              }, 200);
          }, 100);
      }, 10);
  }

  nextButton.addEventListener("click", () => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < cards.length) {
          moveToSlide(nextIndex);
      }
  });

  prevButton.addEventListener("click", () => {
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
          moveToSlide(prevIndex);
      }
  });

  indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
          moveToSlide(index);
      });
  });

  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID;

  track.addEventListener("mousedown", dragStart);
  track.addEventListener("touchstart", dragStart, { passive: true });
  track.addEventListener("mousemove", drag);
  track.addEventListener("touchmove", drag, { passive: true });
  track.addEventListener("mouseup", dragEnd);
  track.addEventListener("mouseleave", dragEnd);
  track.addEventListener("touchend", dragEnd);

  function dragStart(event) {
      isDragging = true;
      startPos = getPositionX(event);
      const transformMatrix = window
          .getComputedStyle(track)
          .getPropertyValue("transform");
      if (transformMatrix !== "none") {
          currentTranslate = parseInt(transformMatrix.split(",")[4]);
      } else {
          currentTranslate = 0;
      }
      prevTranslate = currentTranslate;
      track.style.transition = "none";
      animationID = requestAnimationFrame(animation);
      track.style.cursor = "grabbing";
  }

  function drag(event) {
      if (isDragging) {
          const currentPosition = getPositionX(event);
          const moveX = currentPosition - startPos;
          currentTranslate = prevTranslate + moveX;
      }
  }

  function animation() {
      if (!isDragging) return;
      track.style.transform = `translateX(${currentTranslate}px)`;
      requestAnimationFrame(animation);
  }

  function dragEnd() {
      if (!isDragging) return;
      cancelAnimationFrame(animationID);
      isDragging = false;
      const movedBy = currentTranslate - prevTranslate;
      track.style.transition = "transform 0.75s cubic-bezier(0.21, 0.61, 0.35, 1)";
      track.style.cursor = "grab";
      const threshold = cardWidth / 3.5;
      if (movedBy < -threshold && currentIndex < cards.length - 1) {
          moveToSlide(currentIndex + 1);
      } else if (movedBy > threshold && currentIndex > 0) {
          moveToSlide(currentIndex - 1);
      } else {
          moveToSlide(currentIndex);
      }
  }

  function getPositionX(event) {
      return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
  }

  document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          if (currentIndex < cards.length - 1) {
              moveToSlide(currentIndex + 1);
          }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          if (currentIndex > 0) {
              moveToSlide(currentIndex - 1);
          }
      }
  });

  window.addEventListener(
      "resize",
      debounce(() => {
          initializeCarousel();
          moveToSlide(currentIndex);
      }, 250)
  );

  cards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
          if (!card.classList.contains("is-active")) return;
          const glitchEffect = () => {
              if (!card.matches(":hover") || !card.classList.contains("is-active")) return;
              const xOffset = Math.random() * 4 - 2;
              const yOffset = Math.random() * 4 - 2;
              card.style.transform = `scale(1) translate(${xOffset}px, ${yOffset}px)`;
              const r = Math.random() * 10 - 5;
              const g = Math.random() * 10 - 5;
              const b = Math.random() * 10 - 5;
              card.style.boxShadow = `
                  ${r}px 0 0 rgba(0, 104, 21, 0.2),
                  ${g}px 0 0 rgba(0, 104, 21, 0.2),
                  ${b}px 0 0 rgba(0, 104, 21, 0.2),
                  0 15px 25px rgba(0, 0, 0, 0.5),
                  0 0 40px var(--primary-color)
              `;
              setTimeout(() => {
                  if (!card.matches(":hover") || !card.classList.contains("is-active")) return;
                  card.style.boxShadow =
                      "0 15px 25px rgba(0, 0, 0, 0.5), 0 0 40px var(--primary-color)";
              }, 50);
              if (Math.random() > 0.7) {
                  setTimeout(glitchEffect, 100);
              }
          };
          glitchEffect();
      });
      card.addEventListener("mouseleave", function () {
          card.style.transform = "scale(1)";
          card.style.boxShadow = "var(--shadow-md)";
      });
  });

  initializeCarousel();
});


document.querySelectorAll(".year-button").forEach(button => {
button.addEventListener("click", () => {
  const content = button.nextElementSibling;
  content.classList.toggle("active");
});
});

function baixarArquivo() {
    const link = document.createElement('a');
    link.href = 'imagens/pdfs/OS IMPACTOS DO CONSUMO DE BEBIDAS ALCOÓLICAS NO DESENVOLVIMENTO NEUROLÓGICO DE ADOLESCENTES.pdf';
    link.download = 'OS IMPACTOS DO CONSUMO DE BEBIDAS ALCOÓLICAS NO DESENVOLVIMENTO NEUROLÓGICO DE ADOLESCENTES.pdf';
    link.click();
  }

  // =========================
  // BUSCA NO REPOSITÓRIO + DESTAQUE
  // =========================

  const searchInput = document.getElementById('searchInput');
  const yearContents = document.querySelectorAll('.year-content');
  const fileCards = document.querySelectorAll('.file-card');

  if (searchInput && yearContents.length && fileCards.length) {

      // Descobrir o ano de cada card a partir do botão anterior
      fileCards.forEach(card => {
          const yearContent = card.closest('.year-content');
          if (yearContent) {
              const yearButton = yearContent.previousElementSibling;
              if (yearButton && yearButton.classList.contains('year-button')) {
                  card.dataset.year = yearButton.textContent.trim(); // ex: "2025 - Edição Atual"
              }
          }
      });

      // Escapa caracteres especiais pra usar com RegExp sem quebrar
      function escapeRegExp(str) {
          return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }

      function aplicarBusca() {
          const queryRaw = searchInput.value.trim();
          const query = queryRaw.toLowerCase();
          const temBusca = query.length > 0;

          yearContents.forEach(content => {
              const cards = content.querySelectorAll('.file-card');
              let algumVisivel = false;

              cards.forEach(card => {
                  // Limpa destaques anteriores (volta o texto puro)
                  const textos = card.querySelectorAll('.file-title, .file-description');
                  textos.forEach(element => {
                      const original = element.getAttribute('data-original-text');
                      if (original !== null) {
                          element.textContent = original;
                      } else {
                          // salva o texto original na primeira vez
                          element.setAttribute('data-original-text', element.textContent);
                      }
                  });

                  const textoCard = card.innerText.toLowerCase();
                  const textoAno = (card.dataset.year || '').toLowerCase();

                  const casa = (
                      (temBusca && (textoCard.includes(query) || textoAno.includes(query))) ||
                      !temBusca
                  );

                  if (casa) {
                      card.style.display = '';

                      // Se há busca e o card casa com a query, destacar
                      if (temBusca && textoCard.includes(query)) {
                          const safeQuery = escapeRegExp(queryRaw);
                          if (safeQuery.length > 0) {
                              const regex = new RegExp(`(${safeQuery})`, 'gi');

                              textos.forEach(element => {
                                  const original = element.getAttribute('data-original-text') || element.textContent;
                                  const highlighted = original.replace(
                                      regex,
                                      '<span class="highlight">$1</span>'
                                  );
                                  element.innerHTML = highlighted;

                                  // Remove o destaque após 1.5s
                                  setTimeout(() => {
                                      element.innerHTML = original;
                                  }, 10000000000000);
                              });
                          }
                      }

                      algumVisivel = true;
                  } else {
                      card.style.display = 'none';
                  }
              });

              if (temBusca) {
                  // Em modo de busca: abre anos com resultado, fecha anos sem
                  if (algumVisivel) {
                      content.classList.add('active');
                  } else {
                      content.classList.remove('active');
                  }
              } else {
                  // Sem busca: mostra tudo e fecha os anos
                  cards.forEach(card => card.style.display = '');
                  content.classList.remove('active');
              }
          });
      }

      // Dispara a cada tecla
      searchInput.addEventListener('input', aplicarBusca);
  }

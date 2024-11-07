const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function toggleTheme() {
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('dark-blue-theme');
    } else if (body.classList.contains('dark-blue-theme')) {
        body.classList.remove('dark-blue-theme');
        body.classList.add('purple-theme');
    } else if (body.classList.contains('purple-theme')) {
        body.classList.remove('purple-theme');
        body.classList.add('light-theme');
    } else {
        body.classList.add('dark-theme');
    }
    localStorage.setItem('theme', body.classList[1]);
}

themeToggle.addEventListener('click', toggleTheme);

const storedTheme = localStorage.getItem('theme');
if (storedTheme) {
    body.classList.add(storedTheme === 'dark' ? 'dark-theme' : '');
}

document.addEventListener('click', (event) => {
  const target = event.target;
  if (target.tagName === 'A' || target.tagName === 'BUTTON') {
    target.style.transform = 'scale(1.2)';
    setTimeout(() => {
      target.style.transform = 'scale(1)';
    }, 200);
  }
});

function smoothScroll(targetId) {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    window.scrollTo({
      top: targetElement.offsetTop,
      behavior: 'smooth'
    });

    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
    const activeLink = document.querySelector(`nav a[href="#${targetId}"]`);
    activeLink.classList.add('active');
  }
}

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    smoothScroll(targetId);
  });
});
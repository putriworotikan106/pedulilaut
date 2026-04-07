function getParameter(param) {
    return new URLSearchParams(window.location.search).get(param);
}

function loadPage(page) {
    const contentArea = document.getElementById("content");

    fetch(`${page}.html`)
        .then(response => {
            if (!response.ok) throw new Error("Halaman tidak ditemukan");
            return response.text();
        })
        .then(data => {
            contentArea.innerHTML = data;
            setActiveMenu(page);
            initAnimations(contentArea);
            initScrollTrigger(contentArea); 
        })
        .catch(err => {
            contentArea.innerHTML = `<div style='text-align:center; padding:50px;'><h2>Halaman '${page}' tidak ditemukan.</h2></div>`;
        });
}

function initScrollTrigger(container) {
    const btn = container.querySelector("#btnJelajah");
    if (btn) {
        btn.onclick = () => {
            const target = container.querySelectorAll("section")[1]; 
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // 80 adalah tinggi navbar
                    behavior: "smooth"
                });
            }
        };
    }
}

function initAnimations(container) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                
                // Hanya jalankan ini jika elemen memang punya progress bar
                const bars = entry.target.querySelectorAll('.prog-fill');
                if(bars.length > 0) {
                    bars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                }
            }
        });
    }, { threshold: 0.1 });

    container.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function setActiveMenu(page) {
    document.querySelectorAll("nav a").forEach(link => {
        const href = link.getAttribute("href") || "";
        link.classList.toggle("active", href.includes(`p=${page}`));
    });
}

window.onload = () => {
    const page = getParameter("p") || "home";
    loadPage(page);
};
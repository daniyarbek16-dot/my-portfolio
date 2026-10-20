// ========================================================
// 1. УЛЬТРАПЛАВНЫЙ КУРСОР
// ========================================================
const cursorDot = document.querySelector('.custom-cursor-dot');
const cursorGlow = document.querySelector('.custom-cursor-glow');

window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});


// ========================================================
// 2. ИНТЕРАКТИВ 3D-КАРТОЧКИ АЗУЛЫ
// ========================================================
const card = document.querySelector('.card');
card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    card.style.transform = `rotateX(${-y / 16}deg) rotateY(${x / 16}deg)`;
    
    const glowX = (e.clientX - rect.left) / rect.width * 100;
    const glowY = (e.clientY - rect.top) / rect.height * 100;
    card.style.setProperty('--mouse-x', `${glowX}%`);
    card.style.setProperty('--mouse-y', `${glowY}%`);
});

card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
});

card.addEventListener('click', () => {
    card.classList.add('lightning-flash');
    setTimeout(() => card.classList.remove('lightning-flash'), 400);
});

// Скролл кнопки "Смотреть Арт"
document.getElementById('trigger-gallery').addEventListener('click', () => {
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
});

// Навигация боковой панели
const sidebarItems = document.querySelectorAll('.sidebar-item');
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        if (targetId) {
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                document.querySelector('.sidebar-item.active').classList.remove('active');
                item.classList.add('active');
            }
        }
    });
});

// ========================================================
// 3. БАЗА МНОГОУРОВНЕВЫХ ПОДБОРОК
// ========================================================
const galleryData = {
    "eclipse": {
        "sectionTitle": "Раздел: Затмение",
        "subAlbums": [
            {
                "albumTitle": "Ранние наброски Затмения",
                "images": [
                    { "title": "Скетч #1", "src": "art1.jpg" },
                    { "title": "Скетч #2", "src": "art2.jpg" }
                ]
            },
            {
                "albumTitle": "Финальные постеры",
                "images": [
                    { "title": "Постер А", "src": "art3.jpg" }
                ]
            }
        ]
    },
    "fire": {
        "sectionTitle": "Раздел: Синее пламя",
        "subAlbums": [
            {
                "albumTitle": "Магия Азулы (HD)",
                "images": [
                    { "title": "Чистое пламя", "src": "azula.jpg" },
                    { "title": "Атака", "src": "art2.jpg" }
                ]
            },
            {
                "albumTitle": "Обои на рабочий стол",
                "images": [
                    { "title": "Обои 4К", "src": "art3.jpg" }
                ]
            }
        ]
    },
    "lightning": {
        "sectionTitle": "Раздел: Молния",
        "subAlbums": [
            {
                "albumTitle": "Поколение молнии",
                "images": [
                    { "title": "Вспышка", "src": "art3.jpg" }
                ]
            }
        ]
    }
};

// ========================================================
// 4. ДВИЖОК АЛЬБОМОВ И МЕХАНИКА ПРОСМОТРА КАРТИНКИ (LIGHTBOX)
// ========================================================
const albumButtons = document.querySelectorAll('.album-cutter');
const activeTitle = document.getElementById('active-album-title');
const activeGrid = document.getElementById('active-album-grid');

// Элементы модального окна Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

albumButtons.forEach(button => {
    button.addEventListener('click', () => {
        const albumKey = button.getAttribute('data-album');
        const currentSection = galleryData[albumKey];
        
        if (currentSection) {
            activeTitle.innerText = currentSection.sectionTitle;
            activeGrid.innerHTML = "";
            
            currentSection.subAlbums.forEach(subAlbum => {
                const albumWrapper = document.createElement('div');
                albumWrapper.className = 'sub-album-wrapper';
                albumWrapper.style.width = '100%';
                albumWrapper.style.marginBottom = '50px';

                const subTitle = document.createElement('h3');
                subTitle.innerText = subAlbum.albumTitle;
                subTitle.className = 'sub-album-title';
                albumWrapper.appendChild(subTitle);

                const innerGrid = document.createElement('div');
                innerGrid.className = 'gallery-grid'; 
                innerGrid.style.marginTop = '20px';

                subAlbum.images.forEach(img => {
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.style.backgroundImage = `url('${img.src}')`;
                    
                    const overlay = document.createElement('div');
                    overlay.className = 'item-overlay';
                    
                    const h3 = document.createElement('h3');
                    h3.innerText = img.title;
                    
                    overlay.appendChild(h3);
                    item.appendChild(overlay);
                    
                    // КЛИК НА АРТ ОТКРЫВАЕТ ОКНО НА ВЕСЬ ЭКРАН
                    item.addEventListener('click', () => {
                        lightboxImg.src = img.src;
                        lightboxCaption.innerText = img.title;
                        lightbox.classList.add('show');
                    });

                    innerGrid.appendChild(item);
                });

                albumWrapper.appendChild(innerGrid);
                activeGrid.appendChild(albumWrapper);
            });

            document.getElementById('active-album-view').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ЗАКРЫТИЕ ОКНА НА ВЕСЬ ЭКРАН
lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('show');
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('show');
    }
});

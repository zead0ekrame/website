let currentActivityIndex = 0;
let currentQuestionIndex = null;
let timerInterval = null;
let remainingTime = 0;
let timerSoundInterval = null;
let sortInstructionSoundPlayed = false;
const preVideoSeen = {};

// Audio helper functions
function playSound(soundId) {
    const audio = document.getElementById(soundId);
    if (audio) {
        audio.currentTime = 0;
        audio.pause();
        audio.play().catch(err => console.warn('Audio play failed:', err));
    }
}

function stopSound(soundId) {
    const audio = document.getElementById(soundId);
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}

function startLoopingTimer() {
    const timerAudio = document.getElementById('timerSound');
    if (timerAudio) {
        timerAudio.loop = false;
        timerAudio.currentTime = 0;
        timerAudio.pause();
        timerAudio.play().catch(err => console.warn('Timer sound play failed:', err));
    }
}

function stopTimerSound() {
    const timerAudio = document.getElementById('timerSound');
    if (timerAudio) {
        timerAudio.loop = false;
        timerAudio.pause();
        timerAudio.currentTime = 0;
    }
}

const activities = [
    {
        icon: '🎯',
        title: 'السلوك الصحيح',
        description: 'اختر السلوك الصحيح من الصورتين',
        type: 'quiz',
        preVideo: 'media/WhatsApp Video 2025-12-04 at 12.20.51 AM (1).mp4',
        duration: 120,
        questions: [
            {
                questionNum: 1,
                wrong: 'WhatsApp Image 2025-12-04 at 8.21.54 PM (1).jpeg',
                correct: 'WhatsApp Image 2025-12-04 at 8.21.54 PM (2).jpeg',
                correctFirst: true
            },
            {
                questionNum: 2,
                wrong: 'WhatsApp Image 2025-12-04 at 8.21.56 PM (2).jpeg',
                correct: 'WhatsApp Image 2025-12-04 at 8.21.56 PM (1).jpeg'
            },
            {
                questionNum: 3,
                wrong: 'WhatsApp Image 2025-12-04 at 8.21.50 PM (3).jpeg',
                correct: 'WhatsApp Image 2025-12-04 at 8.21.50 PM (2).jpeg'
            }
        ]
    },
    {
        icon: '⏰',
        title: 'الروتين اليومي',
        description: 'رتب خطوات الروتين اليومي بالترتيب الصحيح',
        type: 'sort',
        duration: 300,
        items: [
            'WhatsApp Image 2025-12-04 at 8.21.56 PM (6).jpeg',
            'WhatsApp Image 2025-12-04 at 8.21.57 PM (5).jpeg',
            'WhatsApp Image 2025-12-04 at 8.21.57 PM (6).jpeg',
            'WhatsApp Image 2025-12-04 at 8.21.56 PM (7).jpeg',
            'WhatsApp Image 2025-12-04 at 8.21.57 PM (7).jpeg',
            'WhatsApp Image 2025-12-04 at 8.21.56 PM (8).jpeg',
            'WhatsApp Image 2025-12-04 at 8.21.57 PM (8).jpeg',
            'WhatsApp Image 2025-12-04 at 8.21.57 PM (9).jpeg'
        ],
        correctOrder: [0,1,2,3,4,5,6,7]
    },
    {
        icon: '🚿',
        title: 'خطوات الاستحمام',
        description: 'رتب خطوات الاستحمام من 5 صور',
        type: 'sort',
        duration: 300,
        items: [
            'images/WhatsApp Image 2025-12-04 at 8.21.51 PM.jpeg',
            'images/WhatsApp Image 2025-12-04 at 8.21.51 PM (2).jpeg',
            'images/WhatsApp Image 2025-12-04 at 8.21.51 PM (1).jpeg',
            'images/WhatsApp Image 2025-12-04 at 8.21.51 PM (3).jpeg',
            'images/WhatsApp Image 2025-12-04 at 8.21.51 PM (4).jpeg'
        ],
        correctOrder: [0,1,2,3,4]
    },
    {
        icon: '🧩',
        title: 'غسل اليدين',
        description: 'رتب خطوات غسل اليدين بالترتيب الصحيح — 4 صور',
        type: 'sort',
        duration: 300,
        items: [
            'images/WhatsApp Image 2025-12-04 at 8.21.54 PM.jpeg',
            'images/WhatsApp Image 2025-12-04 at 8.21.53 PM.jpeg',
            'images/WhatsApp Image 2025-12-04 at 8.21.52 PM.jpeg',
            'images/WhatsApp Image 2025-12-04 at 8.21.53 PM (1).jpeg'
        ],
        correctOrder: [0,1,2,3]
    },
    {
        icon: '📖',
        title: 'تمشيط الشعر',
        description: 'رتب خطوات تمشيط الشعر — صور',
        type: 'sort',
        duration: 300,
        items: [
            'images/WhatsApp Image 2025-12-04 at 8.21.55 PM (4).jpeg',
            'images/WhatsApp Image 2025-12-04 at 8.21.56 PM.jpeg',
            'images/WhatsApp Image 2025-12-04 at 8.21.55 PM (5).jpeg',
            'images/WhatsApp Image 2025-12-04 at 8.21.55 PM (6).jpeg',
            'images/WhatsApp Image 2025-12-04 at 8.21.55 PM (3).jpeg'
        ],
        correctOrder: [0,1,2,3,4]
    },
    {
        icon: '🧪',
        title: 'غسل الفواكه',
        description: 'شاهد فيديو ثم رتب خطوات غسل الفواكه',
        type: 'video-sort',
        duration: 300,
        video: 'media/WhatsApp Video 2025-12-04 at 12.20.51 AM.mp4',
        items: [
            'images/WhatsApp Image 2025-12-04 at 8.21.54 PM (4).jpeg',
            'images/WhatsApp Image 2025-12-04 at 8.21.55 PM (1).jpeg',
            'images/WhatsApp Image 2025-12-04 at 8.21.55 PM.jpeg',
            'images/WhatsApp Image 2025-12-04 at 8.21.54 PM (3).jpeg'
        ],
        correctOrder: [0,1,2,3]
    }
];

const teamInfo = {
    heading: 'كلية التربية للطفوله المبكره (الفرقه الثالثه برنامج تربيه خاصه قسم توحد)',
    group: 'جروب 6',
    members: [
        'حبيبه أحمد محمود أحمد',
        'بسنت أحمد بدوي',
        'حبيبة أيمن إبراهيم',
        'رضوه سعيدأحمد (الليدر)',
        'زينب محمد الهادي',
        'مارتينا هاني فكرى',
        'مريم كامل الصعيدي',
        'ملك ربيع برل',
        'هاجر سمير عبد المجيد'
    ]
};

function startActivity(index) {
    currentActivityIndex = index;
    const activity = activities[index];
    console.log('Starting activity:', index, activity);
    
    // If activity has an intro video and it was not shown yet, show it first
    if (activity.preVideo && !preVideoSeen[index]) {
        showPreVideo(activity, index);
        return;
    }

    // mark page as activity view so CSS makes palette horizontal
    document.body.classList.add('activities-page');

    if (activity.type === 'quiz') {
        showQuiz(activity, 0);
    } else if (activity.type === 'sort') {
        showSortActivity(activity);
    } else if (activity.type === 'video-sort') {
        showVideoThenSort(activity);
    } else {
        // show inline content
        const html = `
            <div class="modal-icon small">${activity.icon}</div>
            <div class="modal-title">${activity.title}</div>
            <div class="modal-description">${activity.description}</div>
            <div class="modal-timer" id="modalTimer"></div>
            <div class="modal-buttons">
                <button class="modal-button close" onclick="closeActivity()">أغلق</button>
                <button class="modal-button next" id="nextBtn" onclick="nextActivity()" style="display:none;">النشاط التالي</button>
            </div>
        `;
        const content = document.getElementById('activityContent');
        content.innerHTML = html;
        content.style.display = 'block';
        document.querySelector('.activities-grid').style.display = 'none';

        remainingTime = activity.duration;
        startTimer();
    }
}

function showPreVideo(activity, index) {
    const content = document.getElementById('activityContent');
    const grid = document.querySelector('.activities-grid');
    if (grid) grid.style.display = 'none';
    if (!content) return;

    const html = `
        <div class="modal-icon small">${activity.icon}</div>
        <div class="modal-title">${activity.title}</div>
        <div class="modal-description">شاهد هذا الفيديو القصير قبل البدء في النشاط الأول</div>
        <video id="preActivityVideo" src="${activity.preVideo}" controls style="max-width:100%;border-radius:14px;margin:12px auto;display:block;"></video>
        <div class="modal-buttons">
            <button class="modal-button close" onclick="closeActivity()">أغلق</button>
            <button class="modal-button next" id="startAfterVideo">ابدأ النشاط الآن</button>
        </div>
    `;

    content.innerHTML = html;
    content.style.display = 'block';
    document.body.classList.add('activities-page');

    const startNow = () => {
        preVideoSeen[index] = true;
        const video = document.getElementById('preActivityVideo');
        if (video && !video.paused) video.pause();
        startActivity(index);
    };

    const videoEl = document.getElementById('preActivityVideo');
    if (videoEl) {
        videoEl.play().catch(() => {});
        videoEl.addEventListener('ended', startNow);
    }

    const startBtn = document.getElementById('startAfterVideo');
    if (startBtn) {
        startBtn.addEventListener('click', startNow);
    }
}

function showQuiz(activity, questionIndex) {
    // track current question globally so timer expiry can advance
    currentQuestionIndex = questionIndex;
    if (questionIndex >= activity.questions.length) {
        closeActivity();
        nextActivity();
        return;
    }

    const question = activity.questions[questionIndex];
    const options = question.correctFirst
        ? [
            { src: question.correct, isCorrect: true, label: 'الخيار الأول' },
            { src: question.wrong, isCorrect: false, label: 'الخيار الثاني' }
        ]
        : [
            { src: question.wrong, isCorrect: false, label: 'الخيار الأول' },
            { src: question.correct, isCorrect: true, label: 'الخيار الثاني' }
        ];

    const optionsHTML = options.map(opt => `
            <div class="quiz-option" onclick="checkAnswer(this, ${opt.isCorrect}, ${questionIndex})">
                <img src="${opt.src}" alt="صورة السؤال ${question.questionNum}">
                <div class="option-label">${opt.label}</div>
            </div>
        `).join('');
    
    const quizHTML = `
        <div class="modal-icon small">${activity.icon}</div>
        <div class="modal-title">${activity.title}</div>
        <div class="modal-description">السؤال ${question.questionNum} من 3</div>
        <div class="quiz-images">
            ${optionsHTML}
        </div>
        <div class="modal-timer" id="modalTimer"></div>
        <div id="feedback" style="display:none; font-size:1.5em; margin-top:20px; font-weight:bold;"></div>
        <div class="modal-buttons" id="quizButtons">
            <button class="modal-button close" onclick="closeActivity()">أغلق</button>
        </div>
    `;
    
    const content = document.getElementById('activityContent');
    content.innerHTML = quizHTML;
    content.style.display = 'block';
    document.querySelector('.activities-grid').style.display = 'none';

    // Stop any lingering sounds before starting quiz
    stopSound('sortInstructionSound');
    
    remainingTime = activity.duration;
    startTimer(false);
    
    // Play start sound only for the first question of the first activity (quiz)
    if (currentActivityIndex === 0 && questionIndex === 0) {
        playSound('quizStartSound');
    }
}

/* ===== Sort (drag & drop) activity ===== */
function showSortActivity(activity) {
    // Reset sort instruction sound flag for new sort activity
    sortInstructionSoundPlayed = false;
    
    // shuffle items for palette
    const items = activity.items.slice();
    const shuffled = items
        .map((a) => ({sort: Math.random(), value: a}))
        .sort((a,b) => a.sort - b.sort)
        .map(a => a.value);

    // build HTML: palette (shuffled) and board (slots)
    let slotsHTML = '';
    for (let i=0;i<activity.items.length;i++) {
        slotsHTML += `<div class="sort-slot" data-slot="${i}"></div>`;
    }

    let paletteHTML = '';
    shuffled.forEach((img, idx) => {
        paletteHTML += `
            <div draggable="true" class="draggable" data-name="${img}">
                <img src="${img}" alt="item" style="width:100%;height:100%;object-fit:contain;border-radius:12px;display:block;">
            </div>
        `;
    });

    const sortHTML = `
        <div class="modal-icon">${activity.icon}</div>
        <div class="modal-title">${activity.title}</div>
        <div class="modal-description">اسحب الصور إلى الأماكن الصحيحة بالترتيب الصحيح</div>
        <div class="modal-timer" id="modalTimer"></div>
        <div class="sort-wrapper">
            <div class="sort-palette" id="sortPalette">${paletteHTML}</div>
            <div class="sort-board" id="sortBoard">${slotsHTML}</div>
        </div>
        <div class="modal-buttons" id="sortButtons">
            <button class="modal-button close" onclick="closeActivity()">أغلق</button>
            <button class="modal-button next" id="sortNext" style="display:none;" onclick="nextActivity()">انتقل إلى النشاط التالي</button>
        </div>
    `;

    const contentDiv = document.getElementById('activityContent');
    contentDiv.innerHTML = sortHTML;
    contentDiv.style.display = 'block';
    document.querySelector('.activities-grid').style.display = 'none';
    // force horizontal palette to avoid vertical stacking on direct-entry
    const paletteEl = document.getElementById('sortPalette');
    if (paletteEl) paletteEl.classList.add('horizontal');

    // ensure no other sounds are overlapping
    stopTimerSound();
    stopSound('correctSound');
    stopSound('wrongSound');
    stopSound('quizStartSound');

    // Play sort instruction sound only once per activity
    if (!sortInstructionSoundPlayed) {
        const sortAudio = document.getElementById('sortInstructionSound');
        if (sortAudio) {
            sortAudio.loop = false;
            sortAudio.pause();
            sortAudio.currentTime = 0;
        }
        setTimeout(() => {
            playSound('sortInstructionSound');
        }, 300);
        sortInstructionSoundPlayed = true;
    }

    // start timer for sort activities if duration provided
    if (activity.duration) {
        remainingTime = activity.duration;
        // if entering activity 2 (index 1) directly, start timer after instruction ends
        const startAfterInstruction = (currentActivityIndex === 1);
        if (startAfterInstruction) {
            const sortAudio = document.getElementById('sortInstructionSound');
            if (sortAudio) {
                const onEnded = () => {
                    startTimer(true);
                    sortAudio.removeEventListener('ended', onEnded);
                };
                sortAudio.addEventListener('ended', onEnded);
                // fallback if audio doesn't play: start after 1.2s
                setTimeout(() => {
                    if (sortAudio && sortAudio.paused) startTimer(true);
                }, 1200);
            } else {
                startTimer(true);
            }
        } else {
            setTimeout(() => startTimer(true), 1000);
        }
    }

    initSort(activity);
}

function showVideoThenSort(activity) {
    const content = document.getElementById('activityContent');
    document.querySelector('.activities-grid').style.display = 'none';
    const html = `
        <div class="modal-icon">${activity.icon}</div>
        <div class="modal-title">${activity.title}</div>
        <div class="modal-description">${activity.description}</div>
        <div class="modal-timer" id="modalTimer"></div>
        <video id="activityVideo" src="${activity.video}" controls style="max-width:100%;border-radius:12px;margin:10px auto;display:block;"></video>
        <div class="modal-buttons">
            <button class="modal-button close" onclick="closeActivity()">أغلق</button>
            <button class="modal-button next" id="skipVideoBtn">انتقل إلى الصور</button>
        </div>
    `;

    content.innerHTML = html;
    content.style.display = 'block';

    // start overall timer if provided
    if (activity.duration) {
        remainingTime = activity.duration;
        startTimer();
    }

    const video = document.getElementById('activityVideo');
    if (video) {
        video.play().catch(() => {});
        video.addEventListener('ended', () => {
            showSortActivity(activity);
        });
    }

    const skipBtn = document.getElementById('skipVideoBtn');
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            if (video && !video.paused) video.pause();
            showSortActivity(activity);
        });
    }
}

function initSort(activity) {
    const palette = document.getElementById('sortPalette');
    const board = document.getElementById('sortBoard');
    const slots = board.querySelectorAll('.sort-slot');

    // dragstart
    palette.querySelectorAll('.draggable').forEach(el => {
        addDragListeners(el);
    });

    // allow dropping on slots (desktop drag-drop + mobile touch)
    slots.forEach(slot => {
        slot.style.position = 'relative';
        slot.addEventListener('dragover', (e) => e.preventDefault());
        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            const name = e.dataTransfer.getData('text/plain');
            handleSortDrop(activity, slot, name);
        });
        // Add touch support for mobile
        addTouchDropZone(slot, activity);
    });
}

function handleSortDrop(activity, slotEl, itemName) {
    const slotIndex = Number(slotEl.getAttribute('data-slot'));
    const expectedName = activity.items[ activity.correctOrder[slotIndex] ];

    // if slot already has an img, put back to palette
    const existing = slotEl.querySelector('img');
    if (existing) {
        const existingName = existing.getAttribute('src');
        const palette = document.getElementById('sortPalette');
        const wrapper = document.createElement('div');
        wrapper.className = 'draggable';
        wrapper.setAttribute('draggable','true');
        wrapper.setAttribute('data-name', existingName);
        wrapper.innerHTML = `<img src="${existingName}" style="width:100%;height:100%;object-fit:contain;border-radius:12px;display:block;">`;
        palette.appendChild(wrapper);
        addDragListeners(wrapper);
        existing.remove();
        slotEl.classList.remove('correct', 'wrong');
    }

    // place dropped item into slot
    const img = document.createElement('img');
    img.src = itemName;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.style.borderRadius = '12px';
    img.style.cursor = 'pointer';
    slotEl.appendChild(img);
    
    // add remove button for incorrectly placed item
    let removeBtn = slotEl.querySelector('.remove-btn');
    if (!removeBtn) {
        removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '✕';
        removeBtn.style.display = 'none';
        slotEl.appendChild(removeBtn);
        removeBtn.addEventListener('click', () => {
            clearSlot(activity, slotEl);
        });
    }

    // remove draggable element from palette
    const palette = document.getElementById('sortPalette');
    const removed = palette.querySelector(`.draggable[data-name="${itemName}"]`);
    if (removed) removed.remove();

    // check correctness
    if (itemName === expectedName) {
        slotEl.classList.remove('wrong');
        slotEl.classList.add('correct');
        playSound('correctSound');
        if (removeBtn) removeBtn.style.display = 'none';
    } else {
        slotEl.classList.add('wrong');
        playSound('wrongSound');
        if (removeBtn) removeBtn.style.display = 'block';
        setTimeout(() => {
            // after 2 seconds, auto-clear the wrong item
            if (slotEl.querySelector('img') && slotEl.classList.contains('wrong')) {
                clearSlot(activity, slotEl);
            }
        }, 2000);
    }

    checkSortCompletion(activity);
}

function clearSlot(activity, slotEl) {
    const img = slotEl.querySelector('img');
    if (img) {
        const itemName = img.getAttribute('src');
        const palette = document.getElementById('sortPalette');
        
        // recreate draggable wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'draggable';
        wrapper.setAttribute('draggable','true');
        wrapper.setAttribute('data-name', itemName);
        wrapper.innerHTML = `<img src="${itemName}" style="width:100%;height:100%;object-fit:contain;border-radius:12px;display:block;">`;
        palette.appendChild(wrapper);
        addDragListeners(wrapper);
        
        img.remove();
    }
    
    const removeBtn = slotEl.querySelector('.remove-btn');
    if (removeBtn) removeBtn.remove();
    
    slotEl.classList.remove('correct', 'wrong');
    checkSortCompletion(activity);
}

function addDragListeners(wrapper) {
    wrapper.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', wrapper.getAttribute('data-name'));
        setTimeout(() => wrapper.style.visibility = 'hidden', 0);
    });
    wrapper.addEventListener('dragend', (e) => {
        wrapper.style.visibility = 'visible';
    });
    // Also add touch listeners for mobile
    addTouchListeners(wrapper);
}

// Mobile touch support for drag and drop
let touchedElement = null;
let touchOffset = { x: 0, y: 0 };
let touchData = { startX: 0, startY: 0, currentX: 0, currentY: 0 };
let dragOverSlot = null;

function addTouchListeners(wrapper) {
    wrapper.addEventListener('touchstart', (e) => {
        touchedElement = wrapper;
        const touch = e.touches[0];
        const rect = wrapper.getBoundingClientRect();
        touchOffset.x = touch.clientX - rect.left;
        touchOffset.y = touch.clientY - rect.top;
        touchData.startX = touch.clientX;
        touchData.startY = touch.clientY;
        wrapper.style.opacity = '0.6';
        wrapper.style.zIndex = '1000';
        wrapper.style.transform = 'scale(1.1)';
        document.body.style.touchAction = 'none';
        e.preventDefault();
    }, false);

    wrapper.addEventListener('touchmove', (e) => {
        if (touchedElement === wrapper) {
            const touch = e.touches[0];
            touchData.currentX = touch.clientX;
            touchData.currentY = touch.clientY;
            e.preventDefault();
        }
    }, false);

    wrapper.addEventListener('touchend', (e) => {
        if (touchedElement === wrapper) {
            wrapper.style.opacity = '1';
            wrapper.style.zIndex = '1';
            wrapper.style.transform = 'scale(1)';
            touchedElement = null;
            dragOverSlot = null;
        }
        document.body.style.touchAction = 'auto';
        e.preventDefault();
    }, false);
}

// Enhanced slot drop detection for touch
function addTouchDropZone(slot, activity) {
    slot.addEventListener('touchmove', (e) => {
        if (touchedElement && e.touches.length > 0) {
            const touch = e.touches[0];
            const slotRect = slot.getBoundingClientRect();
            
            // Highlight slot if touch is over it
            if (
                touch.clientX >= slotRect.left &&
                touch.clientX <= slotRect.right &&
                touch.clientY >= slotRect.top &&
                touch.clientY <= slotRect.bottom
            ) {
                if (dragOverSlot !== slot) {
                    if (dragOverSlot) dragOverSlot.style.backgroundColor = '';
                    dragOverSlot = slot;
                    slot.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
                }
            } else {
                if (dragOverSlot === slot) {
                    slot.style.backgroundColor = '';
                    dragOverSlot = null;
                }
            }
        }
        e.preventDefault();
    }, false);

    slot.addEventListener('touchend', (e) => {
        if (touchedElement && e.changedTouches.length > 0) {
            const touch = e.changedTouches[0];
            const slotRect = slot.getBoundingClientRect();
            
            // Check if touch ended within slot bounds
            if (
                touch.clientX >= slotRect.left &&
                touch.clientX <= slotRect.right &&
                touch.clientY >= slotRect.top &&
                touch.clientY <= slotRect.bottom
            ) {
                const itemName = touchedElement.getAttribute('data-name');
                handleSortDrop(activity, slot, itemName);
            }
            
            // Reset slot style
            if (dragOverSlot === slot) {
                slot.style.backgroundColor = '';
                dragOverSlot = null;
            }
            touchedElement = null;
        }
        e.preventDefault();
    }, false);
}

function checkSortCompletion(activity) {
    const board = document.getElementById('sortBoard');
    const slots = Array.from(board.querySelectorAll('.sort-slot'));
    let correctCount = 0;
    for (let i=0;i<slots.length;i++) {
        const img = slots[i].querySelector('img');
        if (!img) return; // not filled yet
        const placed = img.getAttribute('src');
        const expected = activity.items[ activity.correctOrder[i] ];
        if (placed === expected) correctCount++;
    }

    if (correctCount === activity.items.length) {
        // show success, reveal next button
        const buttons = document.getElementById('sortButtons');
        const nextBtn = document.getElementById('sortNext');
        if (nextBtn) nextBtn.style.display = 'inline-block';
        // show praise message
        const fb = document.getElementById('feedback');
        if (fb) {
            fb.style.display = 'block';
            fb.textContent = '🎉 أحسنت! كل شيء في مكانه الصحيح';
        } else {
            const content = document.querySelector('.activity-modal-content');
            const msg = document.createElement('div');
            msg.id = 'feedback';
            msg.textContent = '🎉 أحسنت! كل شيء في مكانه الصحيح';
            msg.style.marginTop = '16px';
            msg.style.fontSize = '1.6em';
            content.appendChild(msg);
        }
    }
}

function checkAnswer(element, isCorrect, questionIndex) {
    const feedback = document.getElementById('feedback');
    const options = document.querySelectorAll('.quiz-option');
    
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    if (isCorrect) {
        element.style.borderColor = '#32CD32';
        element.style.borderWidth = '5px';
        feedback.textContent = '✅ إجابة صحيحة!';
        feedback.style.color = '#32CD32';
        playSound('correctSound');
        
        feedback.style.display = 'block';
        clearInterval(timerInterval);
        document.getElementById('modalTimer').textContent = 'اضغط السهم للسؤال التالي';
        
        const activity = activities[currentActivityIndex];
        const buttons = document.getElementById('quizButtons');
        const nextIndex = questionIndex + 1;
        // If this was the last question, label should guide to the next activity
        const nextLabel = (nextIndex < activity.questions.length) ? 'السؤال التالي ➡️' : 'النشاط التالي ➡️';
        buttons.innerHTML = `
            <button class="modal-button close" onclick="closeActivity()">أغلق</button>
            <button class="modal-button next" onclick="goToNextQuestion(${nextIndex})">${nextLabel}</button>
        `;
    } else {
        element.style.borderColor = '#FF6B6B';
        element.style.borderWidth = '5px';
        feedback.textContent = '❌ إجابة خاطئة! حاول مرة أخرى';
        feedback.style.color = '#FF6B6B';
        playSound('wrongSound');
        
        feedback.style.display = 'block';
        
        // Allow retry - enable clicking again after 1 second
        setTimeout(() => {
            options.forEach(opt => opt.style.pointerEvents = 'auto');
        }, 1000);
    }
}

function goToNextQuestion(nextIndex) {
    const activity = activities[currentActivityIndex];
    if (nextIndex < activity.questions.length) {
        showQuiz(activity, nextIndex);
    } else {
        closeActivity();
        nextActivity();
    }
}

function startTimer(isSortActivity = false) {
    clearInterval(timerInterval);
    updateTimerDisplay();
    
    // Start looping timer sound ONLY for sort activities
    if (isSortActivity) {
        startLoopingTimer();
    }
    
    timerInterval = setInterval(() => {
        remainingTime--;
        updateTimerDisplay();
        
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            if (isSortActivity) {
                stopTimerSound();
            }
            // For sort activities, reveal next button; for quizzes advance to next question
            if (isSortActivity) {
                const nextBtn = document.getElementById('nextBtn');
                if (nextBtn) {
                    nextBtn.style.display = 'block';
                    const tm = document.getElementById('modalTimer');
                    if (tm) tm.textContent = '✅ انتهيت! اضغط التالي';
                }
            } else {
                // If in a quiz, auto-advance to the next question when time runs out
                // Use currentQuestionIndex tracked in showQuiz
                try {
                    const nextIdx = (currentQuestionIndex === null) ? 0 : (currentQuestionIndex + 1);
                    goToNextQuestion(nextIdx);
                } catch (err) {
                    console.warn('Auto-advance on timer end failed', err);
                }
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const mins = Math.floor(remainingTime / 60);
    const secs = remainingTime % 60;
    const timerElement = document.getElementById('modalTimer');
    if (timerElement) {
        timerElement.textContent = 
            `الوقت المتبقي: ${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

function nextActivity() {
    if (currentActivityIndex < activities.length - 1) {
        startActivity(currentActivityIndex + 1);
    } else {
        closeActivity({ keepGridHidden: true });
        showTeamPage();
    }
}

function closeActivity(options = {}) {
    const { keepGridHidden = false } = options;
    clearInterval(timerInterval);
    
    // Stop ALL sounds completely
    stopTimerSound();
    stopSound('quizStartSound');
    stopSound('sortInstructionSound');
    stopSound('correctSound');
    stopSound('wrongSound');
    
    // Extra safety: ensure timer sound is killed
    const timerAudio = document.getElementById('timerSound');
    if (timerAudio) {
        timerAudio.loop = false;
        timerAudio.pause();
        timerAudio.currentTime = 0;
    }
    
    sortInstructionSoundPlayed = false;
    const content = document.getElementById('activityContent');
    if (content) {
        content.style.display = 'none';
        content.innerHTML = '';
    }
    const grid = document.querySelector('.activities-grid');
    if (grid) grid.style.display = keepGridHidden ? 'none' : 'grid';
    // remove activity page class so palette returns to normal (unless keeping the grid hidden for end page)
    if (!keepGridHidden) {
        document.body.classList.remove('activities-page');
    }
}

function startJourney() {
    setTimeout(() => startActivity(0), 100);
}

// إضافة حدث النقر على أزرار الأنشطة
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.activity-button');
    buttons.forEach((button, index) => {
        button.addEventListener('click', function() {
            console.log('Button clicked:', index);
            startActivity(index);
        });
    });

    // If page has ?a=INDEX param, auto-start that activity (used by activities.html links)
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.has('a')) {
            const idx = Number(params.get('a'));
            if (!Number.isNaN(idx) && idx >= 0 && idx < activities.length) {
                // small delay to ensure activityContent exists
                setTimeout(() => startActivity(idx), 120);
            }
        }
    } catch (e) {
        console.warn('No auto-start param or URL error', e);
    }
});

function showTeamPage() {
    const content = document.getElementById('activityContent');
    if (!content) return;
    const membersHTML = teamInfo.members.map((name, idx) => `<li><span class="team-number">${idx + 1} -</span> ${name}</li>`).join('');
    const html = `
        <div class="modal-icon small">🌟</div>
        <div class="modal-title">الفريق المنفذ للمشروع</div>
        <div class="modal-description team-heading">${teamInfo.heading}</div>
        <div class="modal-description team-group">${teamInfo.group}</div>
        <ul class="team-list">${membersHTML}</ul>
        <div class="modal-buttons">
            <a class="modal-button close" href="index.html">العودة للرئيسية</a>
            <button class="modal-button next" onclick="restartJourney()">إعادة الأنشطة</button>
        </div>
    `;
    content.innerHTML = html;
    content.style.display = 'block';
    document.body.classList.add('activities-page');
}

function restartJourney() {
    Object.keys(preVideoSeen).forEach(k => delete preVideoSeen[k]);
    startActivity(0);
}

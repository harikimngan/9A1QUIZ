
document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL STATE & CONSTANTS ---
    const TEACHER_CODE = "TEACHER2025";
    const path = window.location.pathname.split("/").pop() || 'index.html';
    const MALE_AVATAR = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGZpbGw9IiNjNzdkZmYiIGQ9Ik00ODAtODBxLTEzNCAwLTIyNy05M3QtOTMtMjI3cTAtMTM0IDkzLTIyN3QyMjctOTNxMTM0IDAgMjI3IDkzdDkzIDIyN3EwIDEzNC05MyAyMjd0LTIyNyA5M1ptMC0zMjBxLTY2IDAtMTEzLTQ3dC00Ny0xMTNxMC02NiA0Ny0xMTN0MTEzLTQ3cTY2IDAgMTEzIDQ3dDQ3IDExM3EwIDY2LTQ3IDExM3QtMTEzIDQ3Wm0wIDI0MHE4MyAwIDE1Ni0zMS41VDc2My0zNDBxLTU0LTU0LTEyNy04M3QtMTU2LTI5cS04MyAwLTE1NiAyOXQtMTI3IDgzcTQ3IDYyIDEyMCA5My41VDQ4MC04MFoiLz48L3N2Zz4=`;
    const FEMALE_AVATAR = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiPjxwYXRoIGZpbGw9IiNjNzdkZmYiIGQ9Ik00ODAtODBxLTEzNCAwLTIyNy05M3QtOTMtMjI3di04MHEwLTI1IDcuNS00Mi41VDMwLTYwdi0xMjBxMC0yNSAxNy41LTQyLjVUMzIwLTcyMGgzMjBxMjUgMCA0Mi41IDE3LjVUNzAwLTY2MHYxMjBoNDBxMjUgMCA0Mi41IDE3LjVUNDgwLTQ4MHY4MHEwIDEzNC05MyAyMjd0LTIyNyA5M1ptMC00ODBRLTY2IDAtMTEzLTQ3dC00Ny0xMTNxMC02NiA0Ny0xMTN0MTEzLTQ3cTY2IDAgMTEzIDQ3dDQ3IDExM3EwIDY2LTQ3IDExM3QtMTEzIDQ3WiIvPjwvc3ZnPg==`;
    
    // --- UTILITY FUNCTIONS ---
    const getFromLS = (key) => JSON.parse(localStorage.getItem(key));
    const saveToLS = (key, value) => localStorage.setItem(key, JSON.stringify(value));
    const generateId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

    // Initialize LocalStorage if not present
    if (!getFromLS('users')) saveToLS('users', []);
    if (!getFromLS('quizzes')) saveToLS('quizzes', []);
    if (!getFromLS('flashcards')) saveToLS('flashcards', {});

    // --- TOAST NOTIFICATION ---
    const showToast = (message, type = 'info') => {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    };


    // --- DOM ELEMENT SELECTORS ---
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const editAvatarBtn = document.getElementById('edit-avatar-btn');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const userInfo = document.getElementById('user-info');
    const userAvatar = document.getElementById('user-avatar');
    const usernameDisplay = document.getElementById('username-display');

    // --- AUTHENTICATION & SESSION MANAGEMENT ---
    let currentUser = getFromLS('currentUser');

    const updateNav = () => {
        if (currentUser) {
            loginBtn?.classList.add('hidden');
            signupBtn?.classList.add('hidden');
            logoutBtn?.classList.remove('hidden');
            userInfo?.classList.remove('hidden');
            if (usernameDisplay) usernameDisplay.textContent = currentUser.username;

            // Set avatar based on gender
            if (userAvatar) {
                if (currentUser.gender === 'female') {
                    userAvatar.src = FEMALE_AVATAR;
                    userAvatar.alt = "Female Avatar";
                } else {
                    userAvatar.src = MALE_AVATAR;
                    userAvatar.alt = "Male Avatar";
                }
            }
        } else {
            loginBtn?.classList.remove('hidden');
            signupBtn?.classList.remove('hidden');
            logoutBtn?.classList.add('hidden');
            userInfo?.classList.add('hidden');
        }

        // Update active link
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === path) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        currentUser = null;
        if (path !== 'index.html') {
            window.location.href = 'index.html';
        } else {
            updateNav();
            initHomePage(); // Re-render home page for logged-out state
            showToast("You have been logged out.");
        }
    };
    
    const handleLogin = (e) => {
        e.preventDefault();
        const username = e.target.querySelector('#login-username').value;
        const password = e.target.querySelector('#login-password').value;
        const errorEl = e.target.querySelector('#login-error');

        const users = getFromLS('users');
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            currentUser = user;
            saveToLS('currentUser', user);
            closeModal('auth-modal');
            showToast(`Welcome back, ${user.username}!`, 'success');
            
            if (path === 'activities.html' || path === 'flashcard.html') {
                window.location.reload();
            } else {
                 updateNav();
                 initHomePage();
            }
        } else {
            errorEl.textContent = 'Invalid username or password.';
        }
    };
    
     const handleSignup = (e) => {
        e.preventDefault();
        const form = e.target;
        const username = form.querySelector('#signup-username').value;
        const password = form.querySelector('#signup-password').value;
        const confirmPassword = form.querySelector('#signup-confirm-password').value;
        const role = form.querySelector('input[name="role"]:checked').value;
        const gender = form.querySelector('input[name="gender"]:checked').value;
        const teacherCode = form.querySelector('#teacher-code').value;
        const errorEl = form.querySelector('#signup-error');

        errorEl.textContent = ''; 

        if (password !== confirmPassword) {
            errorEl.textContent = 'Passwords do not match.';
            return;
        }
        if (role === 'teacher' && teacherCode !== TEACHER_CODE) {
            errorEl.textContent = 'Invalid teacher code.';
            return;
        }

        const users = getFromLS('users');
        if (users.find(u => u.username === username)) {
            errorEl.textContent = 'Username already exists.';
            return;
        }

        const newUser = { username, password, role, gender };
        users.push(newUser);
        saveToLS('users', users);

        form.reset(); 
        showToast('Account created! Please log in.', 'success');

        const modal = form.closest('.modal-content');
        if (modal) {
            modal.querySelector('.tab-btn[data-tab="signup"]')?.classList.remove('active');
            modal.querySelector('.tab-btn[data-tab="login"]')?.classList.add('active');
            modal.querySelector('#signup-form')?.classList.add('hidden');
            modal.querySelector('#login-form')?.classList.remove('hidden');

            const loginUsernameInput = modal.querySelector('#login-username');
            const loginPasswordInput = modal.querySelector('#login-password');
            if(loginUsernameInput) loginUsernameInput.value = username;
            if(loginPasswordInput) loginPasswordInput.focus();
        }
    };

    // --- MODAL MANAGEMENT ---
    const openModal = (id) => document.getElementById(id)?.classList.remove('hidden');
    const closeModal = (id) => document.getElementById(id)?.classList.add('hidden');

    const openGenderEditModal = () => {
        if (!currentUser) return;
        const maleRadio = document.querySelector('#gender-edit-modal input[name="edit-gender"][value="male"]');
        const femaleRadio = document.querySelector('#gender-edit-modal input[name="edit-gender"][value="female"]');
        
        if (currentUser.gender === 'female' && femaleRadio) {
            femaleRadio.checked = true;
        } else if (maleRadio) {
            maleRadio.checked = true;
        }
        openModal('gender-edit-modal');
    };

    const handleGenderEdit = (e) => {
        e.preventDefault();
        const newGender = document.querySelector('#gender-edit-form input[name="edit-gender"]:checked').value;

        // Update current session
        currentUser.gender = newGender;
        saveToLS('currentUser', currentUser);

        // Update master user list
        let users = getFromLS('users');
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
            users[userIndex].gender = newGender;
            saveToLS('users', users);
        }

        updateNav();
        closeModal('gender-edit-modal');
        showToast('Avatar updated!', 'success');
    };
    
    const setupModalEvents = () => {
        // Auth Modal
        const authModalEl = document.getElementById('auth-modal');
        if (authModalEl) {
            authModalEl.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close')) {
                    closeModal('auth-modal');
                }
            });
            document.getElementById('login-form')?.addEventListener('submit', handleLogin);
            document.getElementById('signup-form')?.addEventListener('submit', handleSignup);
        }

        // Generic Modal
        const genericModalEl = document.getElementById('generic-modal');
        genericModalEl?.addEventListener('click', (e) => {
             if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close-generic')) {
                closeModal('generic-modal');
            }
        });

        // Gender Edit Modal
        const genderModalEl = document.getElementById('gender-edit-modal');
        if (genderModalEl) {
            genderModalEl.addEventListener('click', (e) => {
                if(e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close-gender')) {
                    closeModal('gender-edit-modal');
                }
            });
            document.getElementById('gender-edit-form')?.addEventListener('submit', handleGenderEdit);
        }

        const teacherCodeGroup = document.getElementById('teacher-code-group');
        document.querySelectorAll('input[name="role"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                teacherCodeGroup.classList.toggle('hidden', e.target.value !== 'teacher');
            });
        });

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.modal-form').forEach(form => {
                    form.classList.toggle('hidden', form.id !== `${tab}-form`);
                });
            });
        });

        // Populate gender avatar previews in all modals
        document.querySelectorAll('.gender-selector').forEach(selector => {
            const maleImg = selector.querySelector('img[alt="Male Avatar Preview"]');
            const femaleImg = selector.querySelector('img[alt="Female Avatar Preview"]');
            if(maleImg) maleImg.src = MALE_AVATAR;
            if(femaleImg) femaleImg.src = FEMALE_AVATAR;
        });
    };

    // --- PAGE-SPECIFIC INITIALIZATION ---
    
    // HOME PAGE
    const initHomePage = () => {
        const heroContent = document.querySelector('.hero-content');
        if (!heroContent) return;

        // The logic to show "Welcome, [username]!" has been removed.
        // The homepage content is now the same for logged-in and logged-out users.
        // This function now primarily serves to reset the view on logout, in case
        // a user has an old version of the site cached that displayed the welcome message.
        const welcomeContainer = heroContent.querySelector('.welcome-container');
        if (welcomeContainer) {
            // If the old welcome message exists, replace it with the default content.
            heroContent.innerHTML = `
                <h1>9A1 Quiz</h1>
                <p>Learn. Play. Compete.</p>
                <div class="hero-actions">
                    <a href="activities.html" id="explore-activities-btn" class="btn btn-glass">Explore Activities</a>
                    <a href="flashcard.html" id="practice-flashcards-btn" class="btn btn-glass">Practice with Flashcards</a>
                </div>
            `;
        }
        // The global link handler in init() manages access to protected pages.
    };


    // ACTIVITIES PAGE
    const initActivitiesPage = () => {
        const welcomeMsg = document.getElementById('welcome-message');
        const contentDiv = document.getElementById('activities-content');
        if (!welcomeMsg || !contentDiv) return;

        welcomeMsg.textContent = `Welcome, ${currentUser.username}!`;

        if (currentUser.role === 'teacher') {
            renderTeacherView(contentDiv);
        } else {
            renderStudentView(contentDiv);
            contentDiv.addEventListener('click', (e) => {
                const startBtn = e.target.closest('.start-quiz-btn');
                if (startBtn) {
                    const quizId = startBtn.dataset.quizId;
                    const quizPlayer = new QuizPlayer(quizId);
                    quizPlayer.start();
                }
            });
        }
    };
    
    const renderTeacherQuizList = () => {
        const listContainer = document.getElementById('teacher-quiz-list-container');
        if (!listContainer) return;
        
        const allQuizzes = getFromLS('quizzes');
        const teacherQuizzes = allQuizzes.filter(quiz => quiz.teacherName === currentUser.username);

        if (teacherQuizzes.length > 0) {
            listContainer.innerHTML = `
                <div class="card-grid">
                    ${teacherQuizzes.map(quiz => `
                        <div class="quiz-card">
                            <h3>${quiz.title}</h3>
                            <p>${quiz.questions.length} Questions</p>
                            <p class="teacher-name">${quiz.scores.length} student(s) have attempted.</p>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            listContainer.innerHTML = `<p style="margin-bottom: 2rem; text-align: center; color: var(--text-muted);">You haven't created any quizzes yet. Use the form below to get started!</p>`;
        }
    };

    const renderTeacherView = (container) => {
        container.innerHTML = `
            <div class="teacher-view">
                <h2>Your Quizzes</h2>
                <div id="teacher-quiz-list-container">
                    <!-- Quiz list will be rendered here -->
                </div>
                
                <hr style="margin: 2rem 0; border-color: var(--border-light);">

                <h2>Create a New Quiz</h2>
                <form id="create-quiz-form">
                    <div class="form-group">
                        <label for="quiz-title">Quiz Title</label>
                        <input type="text" id="quiz-title" placeholder="e.g., Chapter 1 Review" required>
                    </div>
                    <div id="questions-container"></div>
                    <button type="button" id="add-question-btn" class="btn btn-secondary">Add Question</button>
                    <hr style="margin: 2rem 0; border-color: var(--border-light);">
                    <button type="submit" class="btn btn-primary btn-full">Create Quiz</button>
                </form>
            </div>
        `;
        renderTeacherQuizList();
        document.getElementById('add-question-btn').addEventListener('click', addQuestionBlock);
        document.getElementById('create-quiz-form').addEventListener('submit', handleCreateQuiz);
        addQuestionBlock(); // Add the first question block by default
    };

    const addQuestionBlock = () => {
        const container = document.getElementById('questions-container');
        const questionId = `q-${Date.now()}`;
        const block = document.createElement('div');
        block.className = 'question-block';
        block.id = questionId;
        block.innerHTML = `
            <h4>Question ${container.children.length + 1}</h4>
            <div class="form-group">
                <label>Question Text</label>
                <input type="text" class="question-text" placeholder="What is the capital of France?" required>
            </div>
            <div class="form-group">
                <label>Question Type</label>
                <select class="question-type">
                    <option value="mc">Multiple Choice</option>
                    <option value="essay">Essay</option>
                </select>
            </div>
            <div class="options-container">
                 <!-- MC options will be injected here -->
            </div>
            <button type="button" class="btn btn-danger remove-question-btn">Remove</button>
        `;
        container.appendChild(block);
        const typeSelect = block.querySelector('.question-type');
        typeSelect.addEventListener('change', () => renderOptions(block, typeSelect.value));
        block.querySelector('.remove-question-btn').addEventListener('click', () => block.remove());
        renderOptions(block, 'mc'); // Render initial options
    };

    const renderOptions = (questionBlock, type) => {
        const container = questionBlock.querySelector('.options-container');
        if (type === 'mc') {
            container.innerHTML = `
                <div class="mc-options">
                    <p>Options (select the correct answer):</p>
                    ${[1,2,3,4].map(i => `
                    <div>
                        <input type="radio" name="correct-answer-${questionBlock.id}" value="${i-1}" required>
                        <input type="text" placeholder="Option ${i}" class="option-text" required>
                    </div>
                    `).join('')}
                </div>`;
        } else {
            container.innerHTML = ''; // Essay has no options
        }
    };
    
    const handleCreateQuiz = (e) => {
        e.preventDefault();
        
        const questionBlocks = document.querySelectorAll('.question-block');
        if (questionBlocks.length === 0) {
            showToast("A quiz must have at least one question.", 'error');
            return;
        }

        const newQuestions = [];
        for (const block of questionBlocks) {
            const question = {
                text: block.querySelector('.question-text').value,
                type: block.querySelector('.question-type').value,
            };
            if (question.type === 'mc') {
                question.options = Array.from(block.querySelectorAll('.option-text')).map(opt => opt.value);
                const correctAnswerInput = block.querySelector(`input[name="correct-answer-${block.id}"]:checked`);
                if (!correctAnswerInput) {
                    showToast('Please select a correct answer for all multiple choice questions.', 'error');
                    return;
                }
                question.correctAnswer = parseInt(correctAnswerInput.value);
            }
            newQuestions.push(question);
        }

        const newQuiz = {
            id: generateId(),
            title: document.getElementById('quiz-title').value,
            teacherName: currentUser.username,
            questions: newQuestions,
            scores: []
        };
        
        const allQuizzes = getFromLS('quizzes') || [];
        const updatedQuizzes = [...allQuizzes, newQuiz];
        saveToLS('quizzes', updatedQuizzes);

        showToast('Quiz created successfully!', 'success');
        
        renderTeacherQuizList();
        e.target.reset();
        document.getElementById('questions-container').innerHTML = '';
        addQuestionBlock();
    };

    const getHighScore = (userScoreData) => {
        if (!userScoreData || !userScoreData.attempts || userScoreData.attempts.length === 0) {
            return "N/A";
        }
        const maxScore = Math.max(...userScoreData.attempts.map(a => a.score));
        const total = userScoreData.attempts[0].totalGradable;
        return `${maxScore} / ${total}`;
    };

    const renderStudentView = (container) => {
        const quizzes = getFromLS('quizzes');
        
        if (!Array.isArray(quizzes) || quizzes.length === 0) {
            container.innerHTML = `<div class="no-quiz-container"><p class="no-quiz-text">No quizzes available yet. Check back later!</p></div>`;
            return;
        }

        container.innerHTML = `
            <h2>Available Quizzes</h2>
            <div class="card-grid">
                ${quizzes.map(quiz => {
                    const userScoreData = quiz.scores.find(s => s.username === currentUser.username);
                    const attempts = userScoreData ? userScoreData.attempts.length : 0;
                    const hasAttempted = attempts > 0;
                    
                    const statusClass = hasAttempted ? 'completed' : 'not-completed';
                    const statusText = hasAttempted ? 'Attempted' : 'Not Started';
                    const buttonText = hasAttempted ? 'Try Again' : 'Start Quiz';

                    return `
                    <div class="quiz-card">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        <h3>${quiz.title}</h3>
                        <p>${quiz.questions.length} Questions</p>
                        <p class="teacher-name">Created by: ${quiz.teacherName}</p>
                        
                        <div class="quiz-stats">
                            <span>Attempts: <strong>${attempts}</strong></span>
                            <span>High Score: <strong>${getHighScore(userScoreData)}</strong></span>
                        </div>

                        <button class="btn btn-primary start-quiz-btn" data-quiz-id="${quiz.id}">
                            ${buttonText}
                        </button>
                    </div>`;
                }).join('')}
            </div>
        `;
    };

    // --- QUIZ PLAYER CLASS ---
    class QuizPlayer {
        constructor(quizId) {
            const quizzes = getFromLS('quizzes');
            this.quiz = quizzes.find(q => q.id === quizId);
            this.modal = document.getElementById('quiz-player-modal');
            this.contentArea = document.getElementById('quiz-player-content');
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.userAnswers = [];
            this.gradableQuestionsCount = this.quiz.questions.filter(q => q.type === 'mc').length;
        }

        start() {
            this.renderLayout();
            this.renderQuestion();
            openModal('quiz-player-modal');
        }

        renderLayout() {
            this.contentArea.innerHTML = `
                <header class="quiz-header">
                    <h2>${this.quiz.title}</h2>
                    <div class="progress-bar-container">
                        <div class="progress-bar"></div>
                    </div>
                </header>
                <main class="quiz-main"></main>
                <footer class="quiz-footer"></footer>
            `;
        }

        renderQuestion() {
            const question = this.quiz.questions[this.currentQuestionIndex];
            const mainArea = this.contentArea.querySelector('.quiz-main');
            const footerArea = this.contentArea.querySelector('.quiz-footer');
            
            let optionsHTML = '';
            if (question.type === 'mc') {
                optionsHTML = `
                    <div class="quiz-options-grid">
                        ${question.options.map((opt, i) => `
                            <div class="answer-option" data-index="${i}">${opt}</div>
                        `).join('')}
                    </div>
                `;
            } else { // essay
                optionsHTML = `
                    <div class="form-group essay-answer">
                        <textarea id="essay-response" placeholder="Type your answer here..."></textarea>
                    </div>
                `;
            }
            
            mainArea.innerHTML = `
                <h3 class="quiz-question-text">${this.currentQuestionIndex + 1}. ${question.text}</h3>
                ${optionsHTML}
            `;
            
            footerArea.innerHTML = `<button id="next-question-btn" class="btn btn-primary hidden">Next</button>`;

            this.updateProgressBar();
            this.attachEventListeners();
        }

        updateProgressBar() {
            const progressBar = this.contentArea.querySelector('.progress-bar');
            const progress = ((this.currentQuestionIndex + 1) / this.quiz.questions.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        attachEventListeners() {
            const options = this.contentArea.querySelectorAll('.answer-option');
            options.forEach(opt => opt.addEventListener('click', this.handleMCAnswer.bind(this)));

            const nextBtn = this.contentArea.querySelector('#next-question-btn');
            nextBtn?.addEventListener('click', this.nextQuestion.bind(this));

            if (this.quiz.questions[this.currentQuestionIndex].type === 'essay') {
                nextBtn?.classList.remove('hidden');
            }
        }
        
        handleMCAnswer(e) {
            const selectedOption = e.currentTarget;
            const selectedAnswerIndex = parseInt(selectedOption.dataset.index);
            const question = this.quiz.questions[this.currentQuestionIndex];
            const isCorrect = selectedAnswerIndex === question.correctAnswer;
            
            if (isCorrect) {
                this.score++;
                selectedOption.classList.add('correct');
            } else {
                selectedOption.classList.add('incorrect');
                const correctOption = this.contentArea.querySelector(`.answer-option[data-index="${question.correctAnswer}"]`);
                correctOption?.classList.add('correct');
            }

            this.userAnswers.push({ question: question.text, answer: selectedAnswerIndex });
            
            this.contentArea.querySelectorAll('.answer-option').forEach(opt => opt.classList.add('disabled'));
            this.contentArea.querySelector('#next-question-btn').classList.remove('hidden');
        }

        nextQuestion() {
            const question = this.quiz.questions[this.currentQuestionIndex];
            if (question.type === 'essay') {
                const answer = this.contentArea.querySelector('#essay-response').value;
                this.userAnswers.push({ question: question.text, answer: answer });
            }

            this.currentQuestionIndex++;
            if (this.currentQuestionIndex < this.quiz.questions.length) {
                this.renderQuestion();
            } else {
                this.finishQuiz();
            }
        }

        finishQuiz() {
            this.saveScore();
            const mainArea = this.contentArea.querySelector('.quiz-main');
            const footerArea = this.contentArea.querySelector('.quiz-footer');
            const headerArea = this.contentArea.querySelector('.quiz-header');

            headerArea.innerHTML = '<h2>Quiz Complete!</h2>';
            mainArea.innerHTML = `
                <div class="quiz-results">
                    <h2>Congratulations, ${currentUser.username}!</h2>
                    <p>You scored</p>
                    <h2 class="final-score">${this.score} / ${this.gradableQuestionsCount}</h2>
                    ${this.gradableQuestionsCount < this.quiz.questions.length ? `<p class="text-muted" style="font-size: 1rem; margin-top: 1rem;">Essay questions will be graded by your teacher.</p>` : ''}
                </div>
            `;
            footerArea.innerHTML = `<button id="close-quiz-btn" class="btn btn-primary">Close</button>`;

            document.getElementById('close-quiz-btn').addEventListener('click', () => {
                closeModal('quiz-player-modal');
                window.location.reload(); 
            });
        }

        saveScore() {
            const quizzes = getFromLS('quizzes');
            const quizToUpdate = quizzes.find(q => q.id === this.quiz.id);
            if (!quizToUpdate) return;
            
            let userScoreData = quizToUpdate.scores.find(s => s.username === currentUser.username);
            
            const newAttempt = {
                score: this.score,
                totalGradable: this.gradableQuestionsCount,
                answers: this.userAnswers,
                date: new Date().toISOString()
            };

            if (userScoreData) {
                userScoreData.attempts.push(newAttempt);
            } else {
                quizToUpdate.scores.push({
                    username: currentUser.username,
                    attempts: [newAttempt]
                });
            }
            
            saveToLS('quizzes', quizzes);
        }
    }


    // FLASHCARD PAGE
    let currentCardIndex = 0;
    let userFlashcards = [];

    const initFlashcardPage = () => {
        userFlashcards = getFromLS('flashcards')[currentUser.username] || [];
        document.getElementById('add-card-form').addEventListener('submit', handleAddCard);
        document.getElementById('reset-cards').addEventListener('click', handleResetCards);
        document.getElementById('next-card').addEventListener('click', navigateCards.bind(null, 1));
        document.getElementById('prev-card').addEventListener('click', navigateCards.bind(null, -1));

        renderFlashcardDeck();
    };

    const renderFlashcardDeck = () => {
        const deckContainer = document.getElementById('flashcard-deck-container');
        
        deckContainer.innerHTML = '';
        if (userFlashcards.length === 0) {
            deckContainer.innerHTML = `<div class="flashcard-stacked"><div class="flashcard-front"><p>Add a card to get started!</p></div></div>`;
            updateCardCounter();
            return;
        }

        userFlashcards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'flashcard-stacked';
            cardEl.style.zIndex = userFlashcards.length - index;
            cardEl.dataset.index = index;

            cardEl.innerHTML = `
                <div class="flashcard-inner">
                    <div class="flashcard-front"><p>${card.word}</p></div>
                    <div class="flashcard-back"><p>${card.definition}</p></div>
                </div>`;
            
            cardEl.style.transform = `translateY(${index * 4}px)`;
            
            if (index < currentCardIndex) {
                cardEl.classList.add('swiped-away');
            }
            
            const innerCard = cardEl.querySelector('.flashcard-inner');
            cardEl.addEventListener('click', () => {
                innerCard.classList.toggle('is-flipped');
            });

            deckContainer.appendChild(cardEl);
        });
        updateCardCounter();
    };

    const navigateCards = (direction) => {
        const newIndex = currentCardIndex + direction;

        if (newIndex < 0 || newIndex >= userFlashcards.length) {
            return;
        }

        const cards = document.querySelectorAll('.flashcard-stacked');
        
        if (direction === 1) { 
            const cardToSwipe = Array.from(cards).find(c => parseInt(c.dataset.index) === currentCardIndex);
            if(cardToSwipe) cardToSwipe.classList.add('swiped-away');
        } else {
            const cardToReturn = Array.from(cards).find(c => parseInt(c.dataset.index) === newIndex);
            if(cardToReturn) cardToReturn.classList.remove('swiped-away');
        }
        
        currentCardIndex = newIndex;
        updateCardCounter();
    };
    
    const updateCardCounter = () => {
        const counter = document.getElementById('card-counter');
        const prevBtn = document.getElementById('prev-card');
        const nextBtn = document.getElementById('next-card');
        
        const total = userFlashcards.length;
        const currentPosition = total > 0 ? Math.min(currentCardIndex + 1, total) : 0;
        
        counter.textContent = `${currentPosition} / ${total}`;
        
        if (prevBtn) prevBtn.disabled = currentCardIndex <= 0;
        if (nextBtn) nextBtn.disabled = currentCardIndex >= total - 1;
    };

    const handleAddCard = (e) => {
        e.preventDefault();
        const word = document.getElementById('card-word').value;
        const definition = document.getElementById('card-definition').value;
        
        userFlashcards.unshift({ word, definition });
        
        const allFlashcards = getFromLS('flashcards');
        allFlashcards[currentUser.username] = userFlashcards;
        saveToLS('flashcards', allFlashcards);

        showToast("Card added!", 'success');
        e.target.reset();
        
        currentCardIndex = 0;
        renderFlashcardDeck();
    };
    
    const handleResetCards = () => {
        if (confirm("Are you sure you want to delete all your cards?")) {
            userFlashcards = [];
            const allFlashcards = getFromLS('flashcards');
            delete allFlashcards[currentUser.username];
            saveToLS('flashcards', allFlashcards);
            currentCardIndex = 0;
            renderFlashcardDeck();
            showToast("All cards have been reset.", 'info');
        }
    };


    // --- GENERAL INITIALIZATION ---
    const handleProtectedLink = (e) => {
        if (!currentUser) {
            e.preventDefault();
            sessionStorage.setItem('redirectUrl', e.currentTarget.getAttribute('href'));
            openModal('auth-modal');
        }
    };
    
    const init = () => {
        updateNav();
        setupModalEvents();
        // Admin export/import panel when URL has ?admin=1
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get('admin') === '1') {
                injectAdminDataPanel();
            }
        } catch (_) {}
        
        const isProtectedPage = path === 'activities.html' || path === 'flashcard.html';
        
        if (isProtectedPage && !currentUser) {
            sessionStorage.setItem('redirectUrl', path);
            window.location.href = 'index.html';
            return;
        }

        const redirectUrl = sessionStorage.getItem('redirectUrl');
        if (currentUser && redirectUrl) {
            sessionStorage.removeItem('redirectUrl');
            window.location.href = redirectUrl;
            return;
        }
        
        document.querySelectorAll('a[href="activities.html"], a[href="flashcard.html"]').forEach(link => {
            link.addEventListener('click', handleProtectedLink);
        });

        if (path === 'activities.html') {
            initActivitiesPage();
        } else if (path === 'flashcard.html') {
            initFlashcardPage();
        } else {
            initHomePage();
        }
    };
    
    logoutBtn?.addEventListener('click', handleLogout);
    loginBtn?.addEventListener('click', () => openModal('auth-modal'));
    signupBtn?.addEventListener('click', () => openModal('auth-modal'));
    editAvatarBtn?.addEventListener('click', openGenderEditModal);
    
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    init();
});

// --- ADMIN DATA UTILITIES (Export / Import) ---
function injectAdminDataPanel() {
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '16px';
    panel.style.right = '16px';
    panel.style.zIndex = '9999';
    panel.style.display = 'flex';
    panel.style.gap = '8px';
    panel.style.background = 'rgba(0,0,0,0.6)';
    panel.style.padding = '8px';
    panel.style.borderRadius = '8px';
    panel.style.backdropFilter = 'blur(6px)';

    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Data';
    exportBtn.className = 'btn btn-secondary';
    exportBtn.style.cursor = 'pointer';
    exportBtn.onclick = () => {
        try {
            const payload = {
                users: localStorage.getItem('users'),
                quizzes: localStorage.getItem('quizzes'),
                flashcards: localStorage.getItem('flashcards'),
                currentUser: localStorage.getItem('currentUser')
            };
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `9a1-quiz-data-${new Date().toISOString().slice(0,19)}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (e) {
            alert('Export failed: ' + e.message);
        }
    };

    const importBtn = document.createElement('button');
    importBtn.textContent = 'Import Data';
    importBtn.className = 'btn btn-primary';
    importBtn.style.cursor = 'pointer';
    importBtn.onclick = async () => {
        try {
            const json = prompt('Paste exported JSON here:');
            if (!json) return;
            const data = JSON.parse(json);
            if (typeof data !== 'object' || data === null) throw new Error('Invalid JSON');
            if ('users' in data && data.users !== null) localStorage.setItem('users', data.users);
            if ('quizzes' in data && data.quizzes !== null) localStorage.setItem('quizzes', data.quizzes);
            if ('flashcards' in data && data.flashcards !== null) localStorage.setItem('flashcards', data.flashcards);
            if ('currentUser' in data && data.currentUser !== null) localStorage.setItem('currentUser', data.currentUser);
            alert('Import successful. The page will reload.');
            location.reload();
        } catch (e) {
            alert('Import failed: ' + e.message);
        }
    };

    panel.appendChild(exportBtn);
    panel.appendChild(importBtn);
    document.body.appendChild(panel);
}
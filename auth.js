const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// validation functions
function validateEmail(email) {
    return emailRegex.test(email);
}

function validateUsername(username) {
    return usernameRegex.test(username);
}

function validatePassword(password) {
    return passwordRegex.test(password);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.color = '#ff4444';
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = '';
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const form = document.querySelector('.auth-form');
    form.insertBefore(successDiv, form.firstChild);  
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function showErrorMessage(message) {   
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-alert';
    errorDiv.textContent = message;
    
    const form = document.querySelector('.auth-form');
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

//  form Handler
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const signinForm = document.getElementById('signinForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) { 
            e.preventDefault();
            
            const username = document.getElementById('signupUsername').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            let isValid = true;
            

            clearError('signupUsernameError');
            clearError('signupEmailError');
            clearError('signupPasswordError');
            clearError('confirmPasswordError');
            

            if (!username) {
                showError('signupUsernameError', 'Username is required');
                isValid = false;
            } else if (!validateUsername(username)) {
                showError('signupUsernameError', 'Username must be 3-20 characters (letters, numbers, underscore only)');
                isValid = false;
            }
            

            if (!email) {
                showError('signupEmailError', 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError('signupEmailError', 'Please enter a valid email address');
                isValid = false;
            }
            

            if (!password) {
                showError('signupPasswordError', 'Password is required');
                isValid = false;
            } else if (!validatePassword(password)) {
                showError('signupPasswordError', 'Password must be 8+ chars with uppercase, lowercase, number, and special character');
                isValid = false;
            }
            

            if (!confirmPassword) {
                showError('confirmPasswordError', 'Please confirm your password');
                isValid = false;
            } else if (password !== confirmPassword) {
                showError('confirmPasswordError', 'Passwords do not match');
                isValid = false;
            }
            

            if (isValid) {
                const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
                const userExists = existingUsers.some(user => 
                    user.username === username || user.email === email
                );
                
                if (userExists) {
                    showErrorMessage('Username or email already exists');
                    isValid = false;
                }
            }
            

            if (isValid) {
                const newUser = {
                    username: username,
                    email: email,
                    password: password, 
                    dateCreated: new Date().toISOString()
                };
                
                const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
                existingUsers.push(newUser);
                localStorage.setItem('users', JSON.stringify(existingUsers));
                
                showSuccessMessage('Account created successfully! Redirecting to sign in...');
                
                setTimeout(() => {
                    window.location.href = 'signin.html';
                }, 2000);
            }
        });
    }
    

    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailOrUsername = document.getElementById('signinEmail').value.trim();
            const password = document.getElementById('signinPassword').value;
            
            let isValid = true;
            

            clearError('signinEmailError');
            clearError('signinPasswordError');
            

            if (!emailOrUsername) {
                showError('signinEmailError', 'Email or username is required');
                isValid = false;
            }
            
            if (!password) {
                showError('signinPasswordError', 'Password is required');
                isValid = false;
            }
            
            if (isValid && emailOrUsername === 'Admin' && password === 'Admin') {
                // Admin login
                sessionStorage.setItem('currentUser', JSON.stringify({
                    username: 'Admin',
                    email: 'admin@pressstart.com',
                    role: 'admin'
                }));
                
                showSuccessMessage('Admin login successful! Redirecting...');
                
                setTimeout(() => {
                    window.location.href = 'index.html'; 
                }, 1500);
                return;
            }

            
            if (isValid) {
                const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
                const user = existingUsers.find(user => 
                    (user.email === emailOrUsername || user.username === emailOrUsername) && 
                    user.password === password
                );
                
                if (user) {
                    // Save current session
                    sessionStorage.setItem('currentUser', JSON.stringify({
                        username: user.username,
                        email: user.email
                    }));
                    
                    showSuccessMessage('Sign in successful! Redirecting...');
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showErrorMessage('Invalid credentials. Please try again.');
                }
            }
        });
    }
});



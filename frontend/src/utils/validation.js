export const validate = (data, rules = {}) => {
    const { username, email, password } = data;
    const errors = {};

    // Username
    if (rules.usernameRequired && !username.trim()) {
        errors.username = 'Username is required.';
    } else if (username.trim()) {
        if (username.length < 3) errors.username = 'Username must be at least 3 characters.';
        else if (username.includes(' ')) errors.username = 'Username should not contain spaces.';
        else if (/^\d+$/.test(username)) errors.username = 'Username cannot be numbers only.';
    }

    // Email
    if (rules.emailRequired && !email.trim()) {
        errors.email = 'Email is required.';
    } else if (email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = 'Invalid email format.';
        }
    }

    // Password
    if (rules.passwordRequired && !password?.trim()) {
        errors.password = 'Password is required.';
    } else if (password?.trim()) {
        const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
        if (!passwordRegex.test(password)) {
            errors.password = 'Password must contain at least one digit, one special character, and be at least 6 characters long.';
        }
    }


    return errors;
};

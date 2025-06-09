/**
 * Valida el formato de un email
 * @param {string} email 
 * @returns {boolean}
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valida los datos para crear/actualizar un usuario
 * @param {Object} userData 
 * @returns {Object} { isValid: boolean, error: string | null }
 */
export const validateUserData = (userData) => {
    if (!userData || typeof userData !== 'object') {
        return {
            isValid: false,
            error: 'Los datos del usuario son inválidos'
        };
    }

    const { name, email } = userData;

    // Validar nombre
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
        return {
            isValid: false,
            error: 'El nombre debe tener al menos 2 caracteres'
        };
    }

    // Validar email
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
        return {
            isValid: false,
            error: 'El email proporcionado no es válido'
        };
    }

    return {
        isValid: true,
        error: null
    };
};

/**
 * Middleware para validar datos del usuario
 */
export const validateUser = (req, res, next) => {
    const validation = validateUserData(req.body);
    
    if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
    }
    
    next();
};
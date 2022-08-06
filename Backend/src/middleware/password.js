const passwordValidator = require('password-validator');

// Create a schema
const passwordSchema = new passwordValidator();

// Add properties to it
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(20)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().symbols()
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['P@ssw0rd', 'P@ssword123', 'Azerty@123']);

module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return res.status(400).json({error: `Le mot de passe n'est pas assez sécurisé : ${passwordSchema.validate(req.body.password, { list: true })}`})
    }
}
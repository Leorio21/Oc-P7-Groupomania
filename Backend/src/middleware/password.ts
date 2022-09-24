import passwordValidator from 'password-validator';
import { Request, Response, NextFunction } from 'express';

// Create a schema
export const passwordSchema = new passwordValidator();

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

export default (req: Request, res: Response, next: NextFunction) => {
    if(passwordSchema.validate(req.body.password)) {
        return next();
    }
    return res.status(400).json({message: `Le mot de passe n'est pas assez sécurisé`})
}
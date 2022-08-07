"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const password_validator_1 = __importDefault(require("password-validator"));
// Create a schema
const passwordSchema = new password_validator_1.default();
// Add properties to it
passwordSchema
    .is().min(8) // Minimum length 8
    .is().max(20) // Maximum length 100
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits(2) // Must have at least 2 digits
    .has().symbols()
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(['P@ssw0rd', 'P@ssword123', 'Azerty@123']);
exports.default = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    }
    else {
        return res.status(400).json({ error: `Le mot de passe n'est pas assez sécurisé : ${passwordSchema.validate(req.body.password, { list: true })}` });
    }
};

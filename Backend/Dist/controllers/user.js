"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.modify = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sharp_1 = __importDefault(require("sharp"));
const promises_1 = __importDefault(require("fs/promises"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (yield prisma.user.findUnique({ where: { email: req.body.email } })) {
            throw `Un utilisateur est déjà enregistré avec cette adresse em@il : ${req.body.email}`;
        }
        const [lastName, firstName] = req.body.email.split('@')[0].split('.');
        const hash = yield bcrypt_1.default.hash(req.body.password, 12);
        yield prisma.user.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                email: req.body.email,
                password: hash
            },
        });
        return res.status(201).json({ message: 'User enregistré !' });
    }
    catch (error) {
        return res.status(400).json({ message: error });
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email: req.body.email
            },
        });
        if (!user) {
            throw "Nom d'utilisateur / Mot de passe incorrect";
        }
        const valid = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!valid) {
            throw "Nom d'utilisateur / Mot de passe incorrect";
        }
        return res.status(200).json({
            token: jsonwebtoken_1.default.sign({
                userId: user.id,
                role: user.role
            }, process.env.RANDOM_KEY_TOKEN, { expiresIn: '24h' })
        });
    }
    catch (error) {
        return res.status(404).json({ message: error });
    }
});
exports.login = login;
const modify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if ((req.body.id == req.auth.userId && +req.params.id == req.auth.userId) || req.auth.role == 'ADMIN') {
            let adminUser;
            let validAdmin = false;
            const user = yield prisma.user.findUnique({
                where: {
                    id: +req.params.id
                },
            });
            if (!user) {
                throw 'Utilisateur introuvable';
            }
            if (req.auth.role == 'ADMIN') {
                adminUser = yield prisma.user.findUnique({
                    where: {
                        id: +req.auth.userId
                    },
                });
                if (!adminUser) {
                    throw 'Utilisateur introuvable';
                }
                validAdmin = yield bcrypt_1.default.compare(req.body.password, adminUser.password);
            }
            const validUser = yield bcrypt_1.default.compare(req.body.password, user.password);
            if (validUser || validAdmin) {
                let nameAvatar;
                let nameBg;
                if (req.files['avatar']) {
                    nameAvatar = (req.files['avatar'][0].filename).split('.')[0];
                    try {
                        yield (0, sharp_1.default)(`./images/${req.files['avatar'][0].filename}`).toFile(`images/${nameAvatar}.webp`);
                        if (user.avatar != null) {
                            yield promises_1.default.unlink(`images/${user.avatar}`);
                        }
                        user.avatar = `${nameAvatar}.webp`;
                    }
                    catch (_a) {
                        throw ('Erreur traiement image 1');
                    }
                }
                if (req.files['bgImg']) {
                    nameBg = (req.files['bgImg'][0].filename).split('.')[0];
                    try {
                        yield (0, sharp_1.default)(`./images/${req.files['bgImg'][0].filename}`).toFile(`images/${nameBg}.webp`);
                        if (user.background != null) {
                            yield promises_1.default.unlink(`images/${user.background}`);
                        }
                        user.background = `${nameBg}.webp`;
                    }
                    catch (_b) {
                        throw ('Erreur traiement image 2');
                    }
                }
                yield prisma.user.update({
                    where: {
                        id: +req.auth.userId
                    },
                    data: {
                        avatar: user.avatar,
                        background: user.background
                    }
                });
                return res.status(201).json({ message: 'UserId : ' + req.auth.userId + ' - role : ' + req.auth.role + ' - User modifié !' });
            }
        }
        else {
            throw `Accès refusé ${req.params.id} - ${req.body.id} - ${req.auth.userId}`;
        }
    }
    catch (error) {
        return res.status(403).json({ message: error });
    }
    finally {
        if (req.files['avatar']) {
            yield promises_1.default.unlink(`images/${req.files['avatar'][0].filename}`);
        }
        if (req.files['bgImg']) {
            yield promises_1.default.unlink(`images/${req.files['bgImg'][0].filename}`);
        }
    }
});
exports.modify = modify;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if ((req.body.id == req.auth.userId && +req.params.id == req.auth.userId) || req.auth.role == 'ADMIN') {
            let adminUser;
            let validAdmin = false;
            const user = yield prisma.user.findUnique({
                where: {
                    id: +req.params.id
                },
            });
            if (!user) {
                throw 'Utilisateur introuvable';
            }
            if (req.auth.role == 'ADMIN') {
                adminUser = yield prisma.user.findUnique({
                    where: {
                        id: +req.auth.userId
                    },
                });
                if (!adminUser) {
                    throw 'Utilisateur introuvable';
                }
                validAdmin = yield bcrypt_1.default.compare(req.body.password, adminUser.password);
            }
            const validUser = yield bcrypt_1.default.compare(req.body.password, user.password);
            if (validUser || validAdmin) {
                yield prisma.user.delete({
                    where: {
                        id: +req.params.id
                    },
                });
            }
            return res.status(200).json({ message: 'Utilisateur supprimé' });
        }
        else {
            throw `Accès refusé ${req.params.id} - ${req.body.id} - ${req.auth.userId}`;
        }
    }
    catch (error) {
        return res.status(403).json({ message: error });
    }
});
exports.deleteUser = deleteUser;

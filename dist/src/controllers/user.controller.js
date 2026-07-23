"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createUser () {
        return createUser;
    },
    get deleteUser () {
        return deleteUser;
    },
    get getAllUsers () {
        return getAllUsers;
    },
    get getCurrentUser () {
        return getCurrentUser;
    },
    get updateUser () {
        return updateUser;
    }
});
const _usermodel = /*#__PURE__*/ _interop_require_default(require("../models/user.model"));
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _dotenv = /*#__PURE__*/ _interop_require_default(require("dotenv"));
const _requestParams = require("../utils/requestParams");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) resolve(value);
    else Promise.resolve(value).then(_next, _throw);
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
var _process_env_API_URL;
_dotenv.default.config();
const API_URL = ((_process_env_API_URL = process.env.API_URL) === null || _process_env_API_URL === void 0 ? void 0 : _process_env_API_URL.trim()) || "http://localhost:5001";
const getCurrentUser = (req, res)=>_async_to_generator(function*() {
        var _req_user;
        const userId = (_req_user = req.user) === null || _req_user === void 0 ? void 0 : _req_user.id;
        try {
            const user = yield _usermodel.default.findByPk(userId, {
                attributes: [
                    "id",
                    "username",
                    "email",
                    "role",
                    "full_name",
                    "profile_pic"
                ]
            });
            if (!user) {
                res.status(404).json({
                    message: "User not found"
                });
                return;
            }
            res.status(200).json({
                user
            });
        } catch (err) {
            res.status(500).json({
                message: "Error fetching user info"
            });
        }
    })();
const createUser = (req, res)=>_async_to_generator(function*() {
        try {
            const { username, full_name, password, role, email, age, country, state, city, pincode, mobile_no } = req.body;
            const profile_pic = req.file ? `${API_URL}/assets/UserData/${req.file.originalname}` : null;
            // const hashedPassword = await bcrypt.hash(password, 10);
            const user = yield _usermodel.default.create({
                username,
                full_name,
                password,
                role,
                email,
                age,
                country,
                state,
                city,
                pincode,
                mobile_no,
                profile_pic
            });
            res.status(201).json({
                message: "User created",
                user
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to create user",
                error
            });
        }
    })();
const getAllUsers = (_req, res)=>_async_to_generator(function*() {
        try {
            const users = yield _usermodel.default.findAll();
            res.status(200).json({
                users
            });
        } catch (err) {
            res.status(500).json({
                message: "Failed to fetch users",
                error: err
            });
        }
    })();
const updateUser = (req, res)=>_async_to_generator(function*() {
        try {
            const id = (0, _requestParams.getSingleParam)(req.params.id);
            if (!id) {
                res.status(400).json({
                    message: "id is required"
                });
                return;
            }
            const { username, full_name, password, role, email, age, country, state, city, pincode, mobile_no } = req.body;
            const user = yield _usermodel.default.findByPk(id);
            if (!user) {
                res.status(404).json({
                    message: "User not found"
                });
                return;
            }
            // Handle profile_pic if uploaded
            const profile_pic = req.file ? `${API_URL}/assets/UserData/${req.file.originalname}` : user.profile_pic;
            const updateData = {
                username,
                full_name,
                role,
                email,
                age,
                country,
                state,
                city,
                pincode,
                mobile_no,
                profile_pic
            };
            if (password) {
                updateData.password = password;
            }
            yield user.update(updateData);
            res.status(200).json({
                message: "User updated successfully",
                user: _object_spread_props(_object_spread({}, user.toJSON()), {
                    profile_pic: user.profile_pic
                })
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to update user",
                error
            });
        }
    })();
const deleteUser = (req, res)=>_async_to_generator(function*() {
        const id = (0, _requestParams.getSingleParam)(req.params.id);
        if (!id) {
            res.status(400).json({
                message: "id is required"
            });
            return;
        }
        try {
            const user = yield _usermodel.default.findByPk(id);
            if (!user) {
                res.status(404).json({
                    message: "User not found"
                });
                return;
            }
            // Delete the profile picture if it exists
            if (user.profile_pic) {
                const imagePath = _path.default.join(__dirname, "../../", user.profile_pic);
                if (_fs.default.existsSync(imagePath)) {
                    _fs.default.unlinkSync(imagePath);
                }
            }
            yield user.destroy();
            res.status(200).json({
                message: "User deleted successfully"
            });
        } catch (err) {
            res.status(500).json({
                message: "Failed to delete user",
                error: err
            });
        }
    })();

//# sourceMappingURL=user.controller.js.map
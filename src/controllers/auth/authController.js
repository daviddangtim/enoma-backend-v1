import User from "../../models/user.js";
import bcrypt from 'bcrypt';
import { signUpValidator, loginValidator } from "../../validators/authValidators.js";
import { formatZodError } from "../../validators/errorMessage.js";
import generateToken from "../../middleware/tokenGenerator.js";

// Function to compare the password
const comparePasswords = (password, confirmPassword) => {
    return password === confirmPassword;
};


// Signup
export const signUp = async (req, res, next) => {
    // Validation
    const registerResults = signUpValidator.safeParse(req.body);
    if (!registerResults.success) {
        return res.status(400).json({ errors: formatZodError(registerResults.error.issues) });
        console.log(formatZodError(registerResults.error.issues))
    }
    try {
        const { name, email, password, confirmPassword, contactNumber, role, isAdmin } = req.body;

        // Check if passwords match
        if (!comparePasswords(password, confirmPassword)) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        // Check if the user exists
        const existingUser = await User.findOne( {email} );
        if (existingUser) {
             res.status(409).json({ message: "User already exists" });
        }else {

            // Hashing the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Creating a user document
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                contactNumber,
                role,
                isAdmin
            });

            // Save the user and generate a token
            const userCreated = await newUser.save();
            const accessToken = generateToken(userCreated);
            console.log("Successful Sign Up");
            res.status(201).json({ message: "User Created Successfully!", user: userCreated, Token: accessToken });
        }

    } catch (e) {
        console.log(`Server encountered an error ${e}`);
        res.status(500).json({ message: "Server encountered an error", error: `${e}` });
    }
}



export const login = async (req, res, next) => {
    // Validation
    const loginResults = loginValidator.safeParse(req.body);
    if (!loginResults.success) {
        return res.status(400).json({ errors: formatZodError(loginResults.error.issues) });
    }

    try {
        const { email, password } = req.body;
        const returningUser = await User.findOne({ email });
        if (!returningUser) {
            return res.status(404).json({ message: "User could not be found" });
        }

        // Password compare
        const isMatch = await bcrypt.compare(password, returningUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateToken(returningUser);
        res.status(200).json({ message: "Login Successful!", Token: accessToken });
    } catch (e) {
        console.log("Login Failed", e);
        res.status(500).json({ message: "Internal Error", error: e });
    }
}


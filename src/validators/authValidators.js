import {z} from 'zod';

export const signUpValidator = z.object({
    firstName: z.string(),
    lastName:z.string(),
    password: z
        .string()
        .min(6, { message: 'Password should be at least 6 characters long' })
        .max(30, { message: 'Password should not exceed 30 characters' })
        .regex(/^(?!.*\d{2,}).*\d.*$/, {
            message: 'Password should contain exactly one number'
        }),
    // confirmPassword: z.string(),
    email: z.string().min(3).max(30).email(),
    contactNumber: z.string().min(10).max(11),
}).required({ message: 'Please enter all the required fields' });

export const loginValidator = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(12),
}).required({ message: 'Please enter all the required fields'});

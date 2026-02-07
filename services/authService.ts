import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sign up a user
export const signup = async (email, password) => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    return { user, error };
};

// Sign in a user
export const signin = async (email, password) => {
    const { user, error } = await supabase.auth.signIn({ email, password });
    return { user, error };
};

// Sign out a user
export const signout = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

// Reset password
export const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
};
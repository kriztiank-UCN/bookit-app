'use server';
import { createAdminClient } from '@/config/appwrite';
import { cookies } from 'next/headers';

async function createSession(_previousState, formData) {
  try {
    // Safely extract form data
    const email = formData.get('email')?.trim() || '';
    const password = formData.get('password')?.trim() || '';

    console.log('Received formData:', {
      email: formData.get('email'),
      password: formData.get('password'),
    });
    
    // Validate input
    if (!email || !password) {
      return { error: 'Please fill out all fields' };
    }

    // Create Appwrite account client
    const { account } = await createAdminClient();

    // Attempt to create a session
    const session = await account.createEmailPasswordSession(email, password);

    // Set secure cookie for session
    cookies().set('appwrite-session', session.secret, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(session.expire),
      path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('Authentication Error:', error.message || error);
    return { error: 'Invalid Credentials' };
  }
}

export default createSession;

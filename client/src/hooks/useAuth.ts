import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient, SignupRequest, SigninRequest } from '@/lib/api';

export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignupRequest) => apiClient.signup(data),
    onSuccess: (response) => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      console.error('Signup error:', error);
    },
  });
}

export function useSignin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SigninRequest) => apiClient.signin(data),
    onSuccess: (response) => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      console.error('Signin error:', error);
    },
  });
}

export function useLogout() {
  const router = useRouter();

  return {
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/');
    },
  };
}
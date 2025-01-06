"use client";

import React, { useState } from 'react';
import { SfIconPerson, SfInput, SfButton, SfLink } from '@storefront-ui/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { GRAPHQL_URL } from '@/config';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(GRAPHQL_URL, {
        query: `
          mutation {
            generateCustomerToken(email: "${email}", password: "${password}") {
              token
            }
          }
        `
      });
      if (response.data.errors) {
        setError(response.data.errors[0].message);
      } else {
        const token = response.data.data.generateCustomerToken.token;
        if (token) {
          localStorage.setItem('customer-token', token);
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <span className="text-sm font-medium">Email</span>
            <SfInput
              slotPrefix={<SfIconPerson />}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            <span className="text-sm font-medium">Password</span>
            <SfInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <SfButton type="submit">Login</SfButton>
      </form>
      <p>
        Don't have an account? <SfLink href="/customer/register">Register here</SfLink>
      </p>
    </div>
  );
};

export default LoginPage;
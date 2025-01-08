"use client";

import React, { useState } from 'react';
import { SfInput, SfButton } from '@storefront-ui/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { GRAPHQL_URL } from '@/config';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(GRAPHQL_URL, {
        query: `
          mutation {
            createCustomer(
              input: {
                firstname: "${firstname}"
                lastname: "${lastname}"
                email: "${email}"
                password: "${password}"
              }
            ) {
              customer {
                id
                email
                firstname
                lastname
              }
            }
          }
        `
      });

      if (response.data.errors) {
        setError(response.data.errors[0].message);
      } else {
        const customer = response.data.data.createCustomer.customer;
        if (customer) {
          const tokenResponse = await axios.post(GRAPHQL_URL, {
            query: `
              mutation {
                generateCustomerToken(email: "${email}", password: "${password}") {
                  token
                }
              }
            `
          });
          const token = tokenResponse.data.data.generateCustomerToken.token;
          localStorage.setItem('customer-token', token);
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Error registering customer:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <span className="text-sm font-medium">Email</span>
            <SfInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            <span className="text-sm font-medium">First Name</span>
            <SfInput
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            <span className="text-sm font-medium">Last Name</span>
            <SfInput
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
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
        <div>
          <label>
            <span className="text-sm font-medium">Confirm Password</span>
            <SfInput
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <SfButton type="submit">Register</SfButton>
      </form>
    </div>
  );
};

export default RegisterPage;

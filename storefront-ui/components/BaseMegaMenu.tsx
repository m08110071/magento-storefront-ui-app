"use client";
import React, { useEffect, useState, useRef } from 'react';
import { SfIconShoppingCart, SfIconPerson, SfButton, SfIconMenu } from '@storefront-ui/react';
import axios from 'axios';
import { useDisclosure, useTrapFocus } from '@storefront-ui/react';
import { useRouter } from 'next/navigation';
import { GRAPHQL_URL } from '../config';


export default function BaseMegaMenu() {
  const { close, toggle, isOpen } = useDisclosure();
  const drawerRef = useRef(null);
  const menuRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [customerName, setCustomerName] = useState<string | null>(null);
  const router = useRouter();

  useTrapFocus(drawerRef, {
    activeState: isOpen,
    arrowKeysUpDown: true,
    initialFocus: 'container',
  });

  useEffect(() => {
    const token = localStorage.getItem('customer-token');
    if (token) {
      const fetchCustomerInfo = async () => {
        try {
          const response = await axios.post(GRAPHQL_URL, {
            query: `
              query {
                customer {
                  firstname
                  lastname
                }
              }
            `
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.errors) {
            localStorage.removeItem('customer-token');
          } else {
            const customer = response.data.data.customer;
            setCustomerName(`Hello ${customer.firstname} ${customer.lastname}`);
            // Fetch customer cart
            const cartResponse = await axios.post(GRAPHQL_URL, {
              query: `
                query {
                  customerCart {
                    id
                  }
                }
              `
            }, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!cartResponse.data.errors) {
              const cart = cartResponse.data.data.customerCart;
              localStorage.setItem('cart-id', cart.id);
            }
          }
          
        } catch (error) {
          localStorage.removeItem('customer-token');
        }
      };

      fetchCustomerInfo();
    } else {
      const cartId = localStorage.getItem('cart-id');
      if (cartId) {
        const fetchCartData = async () => {
          try {
            const response = await axios.post(GRAPHQL_URL, {
              query: `
                query {
                  cart(cart_id: "${cartId}") {
                    id
                    items {
                      id
                      product {
                        name
                      }
                      quantity
                    }
                  }
                }
              `
            });

            if (response.data.errors) {
              localStorage.removeItem('cart-id');
              createGuestCart();
            } else {
              const cart = response.data.data.cart;
            }
          } catch (error) {
            localStorage.removeItem('cart-id');
            createGuestCart();
          }
        };

        fetchCartData();
      } else {
        createGuestCart();
      }
    }
  }, []);

  const createGuestCart = async () => {
    try {
      const response = await axios.post(GRAPHQL_URL, {
        query: `
          mutation {
            createEmptyCart
          }
        `
      });

      if (!response.data.errors) {
        const newCartId = response.data.data.createEmptyCart;
        localStorage.setItem('cart-id', newCartId);
      }
    } catch (error) {
      console.error('Error creating guest cart:', error);
    }
  };

  const menuItems = [
    {
      icon: <SfIconShoppingCart />,
      label: '',
      ariaLabel: 'Cart',
      role: 'button',
      onClick: () => router.push('/cart'),
    },
    customerName
      ? {
          icon: <SfIconPerson />,
          label: 'Logout',
          ariaLabel: 'Customer',
          role: 'customer',
          onClick: () => {
            localStorage.removeItem('customer-token');
            localStorage.removeItem('cart-id');
            window.location.href = '/';
          },
        }
      : {
          icon: <SfIconPerson />,
          label: 'Log in',
          ariaLabel: 'Log in',
          role: 'login',
          onClick: () => router.push('/customer/login'),
        },
  ];

  const bannerDetails = {
    image: 'https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/watch.png',
    title: 'New in designer watches',
  };

    return (
      <div className="w-full h-full">
        {isOpen && <div className="fixed inset-0 bg-neutral-500 bg-opacity-50 transition-opacity" />}
        <header
          ref={menuRef}
          className="flex flex-wrap md:flex-nowrap justify-center w-full py-2 md:py-5 border-0 bg-primary-700 border-neutral-200 md:relative md:z-10"
        >
          <div className="flex items-center justify-start h-full max-w-[1536px] w-full px-4 md:px-10">
            <SfButton
              className="block md:hidden text-white bg-transparent font-body hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
              aria-haspopup="true"
              aria-expanded={isOpen}
              variant="tertiary"
              onClick={toggle}
              square
            >
              <SfIconMenu className=" text-white" />
            </SfButton>
            <a
              href="#"
              onClick={() => router.push('/')}
              aria-label="SF Homepage"
              className="flex shrink-0 ml-4 md:ml-0 mr-2 md:mr-10 text-white focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
            >
              <picture>
                <source srcSet="https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/vsf_logo_white.svg" media="(min-width: 1024px)" />
                <img
                  src="https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/vsf_logo_sign_white.svg"
                  alt="Sf Logo"
                  className="w-8 h-8 lg:w-[12.5rem] lg:h-[1.75rem]"
                />
              </picture>
            </a>
            <nav className="flex-1 flex flex-nowrap justify-end items-center md:ml-10 gap-x-1" aria-label="SF Navigation">
              <span className="hidden md:inline-flex whitespace-nowrap text-white">{customerName}</span>
              {menuItems.map((actionItem) => (
                <SfButton as='a'
                  onClick={actionItem.onClick}
                  className="text-white bg-transparent hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
                  key={actionItem.ariaLabel}
                  aria-label={actionItem.ariaLabel}
                  variant="tertiary"
                  slotPrefix={actionItem.icon}
                  square
                >
                  {actionItem.role === 'login' && (
                    <p className="hidden lg:inline-flex whitespace-nowrap pr-2">{actionItem.label}</p>
                  )}
                </SfButton>
              ))}
            </nav>
          </div>
        </header>
      </div>
    );
  }
  
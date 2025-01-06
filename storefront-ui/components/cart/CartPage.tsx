"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {SfListItem} from '@storefront-ui/react';
import OrderSummary from './OrderSummary';  
import CartItem from './Item';  
import { GRAPHQL_URL } from '@/config';

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      const cartId = localStorage.getItem('cart-id');
      const token = localStorage.getItem('customer-token');
      if (!cartId) {
        setError('Cart is empty');
        return;
      }

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
                    sku
                    small_image {
                      url
                    }
                    price_range {
                      minimum_price {
                        final_price {
                          value
                          currency
                        }
                      }
                    }
                  }
                  quantity
                }
                prices {
                  grand_total {
                    value
                    currency
                  },
                  subtotal_including_tax {
                    value
                    currency
                  }
                }
              }
            }
          `
        }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        if (response.data.errors) {
          setError(response.data.errors[0].message);
        } else {
          setCart(response.data.data.cart);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('An error occurred. Please try again.');
      }
    };

    fetchCart();
  }, []);

  const getTotalQuantity = () => {
    return cart.items.reduce((total: number, item: any) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.prices.grand_total.value.toFixed(2);
  };

  return (
    <div>
      <h1>Cart</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {cart ? (
        <>
          {cart.items.map((item: any) => (
            <CartItem key={item.id} item={item} />
          ))}
          <OrderSummary title="Order Summary" cart={cart} />
        </>
      ) : (
        <p>Loading cart...</p>
      )}
    </div>
  );
};

export default CartPage;
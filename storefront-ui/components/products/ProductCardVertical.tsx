import React, { useState } from 'react';
import { SfButton, SfLink, SfIconShoppingCart } from '@storefront-ui/react';
import axios from 'axios';
import { GRAPHQL_URL } from '@/config';

export default function ProductCardVertical({ product }) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const handleAddToCart = async () => {
    const cartId = localStorage.getItem('cart-id');
    const token = localStorage.getItem('customer-token');
    if (!cartId) {
      console.error('Cart ID not found in local storage');
      return;
    }

    try {
      const response = await axios.post(GRAPHQL_URL, {
        query: `
          mutation {
            addSimpleProductsToCart(
              input: {
                cart_id: "${cartId}"
                cart_items: [
                  {
                    data: {
                      sku: "${product.sku}"
                      quantity: 1
                    }
                  }
                ]
              }
            ) {
              cart {
                items {
                  id
                  product {
                    name
                    sku
                  }
                  quantity
                }
              }
            }
          }
        `
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage('Product added to cart successfully!');
      console.log('Add to cart response:', response.data);
      // Handle success (e.g., show a success message, update cart state, etc.)
    } catch (error) {
      console.error('Error adding product to cart:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="border border-neutral-200 rounded-md hover:shadow-lg max-w-[300px]">
      <div className="relative">
        <SfLink href="#" className="block">
          <img
            src={product.small_image.url}
            alt="Great product"
            className="object-cover h-auto rounded-md aspect-square"
            width="300"
            height="300"
          />
        </SfLink>
      </div>
      <div className="p-4 border-t border-neutral-200">
        <SfLink href="#" variant="secondary" className="no-underline">
          {product.name}
        </SfLink>
        <p className="block py-2 font-normal typography-text-sm text-neutral-700">{product.description.html}</p>
        <span className="block pb-2 font-bold typography-text-lg">
          {product.price_range.minimum_price.final_price.value.toFixed(2)} {product.price_range.minimum_price.final_price.currency}
        </span>
        <SfButton size="sm" slotPrefix={<SfIconShoppingCart size="sm" />} onClick={handleAddToCart}>
          Add to cart
        </SfButton>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </div>
    </div>
  );
}
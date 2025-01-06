"use client";
import React, { useEffect, useState } from 'react';
import ProductCardVertical from './products/ProductCardVertical';
import axios from 'axios';
import { GRAPHQL_URL } from '@/config'; 

const ProductList: React.FC = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `
          {
            products(search: "", pageSize: 2) {
              items {
                id
                sku
                small_image {url}
                name
                description{html}
                price_range {
                  minimum_price {
                    final_price {
                      currency
                      value
                    }
                  }
                }
              }
            }
          }
        `;
        const response = await axios.get(GRAPHQL_URL, {
          params: {
            query: query,
          },
        });
        setProducts(response.data.data.products.items);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product: any) => (
          <li key={product.id}>
            <ProductCardVertical product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
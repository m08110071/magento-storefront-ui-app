import { useState, useRef, useEffect } from 'react';
import { SfButton, SfIconCheckCircle, SfIconClose, SfInput, SfLink } from '@storefront-ui/react';

const orderDetails = {
  items: 3,
  originalPrice: 7824.97,
  savings: -787.0,
  delivery: 0.0,
  tax: 457.47,
};

export default function OrderSummary({title, cart}) {
  const errorTimer = useRef(0);
  const positiveTimer = useRef(0);
  const informationTimer = useRef(0);
  const [inputValue, setInputValue] = useState('');
  const [promoCode, setPromoCode] = useState(0);
  const [informationAlert, setInformationAlert] = useState(false);
  const [positiveAlert, setPositiveAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  useEffect(() => {
    clearTimeout(errorTimer.current);
    errorTimer.current = window.setTimeout(() => setErrorAlert(false), 5000);
    return () => {
      clearTimeout(errorTimer.current);
    };
  }, [errorAlert]);

  useEffect(() => {
    clearTimeout(positiveTimer.current);
    positiveTimer.current = window.setTimeout(() => setPositiveAlert(false), 5000);
    return () => {
      clearTimeout(positiveTimer.current);
    };
  }, [positiveAlert]);

  useEffect(() => {
    clearTimeout(informationTimer.current);
    informationTimer.current = window.setTimeout(() => setInformationAlert(false), 5000);
    return () => {
      clearTimeout(informationTimer.current);
    };
  }, [informationAlert]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const itemsSubtotal = () =>
    orderDetails.originalPrice + orderDetails.savings + orderDetails.delivery + orderDetails.tax;

  const totalPrice = () => itemsSubtotal() + promoCode;

  const checkPromoCode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if ((promoCode === -100 && inputValue.toUpperCase() === 'VSF2020') || !inputValue) return;
    if (inputValue.toUpperCase() === 'VSF2020') {
      setPromoCode(-100);
      setPositiveAlert(true);
    } else {
      setErrorAlert(true);
    }
  };

  const removePromoCode = () => {
    setPromoCode(0);
    setInformationAlert(true);
  };

  return (
    <div>
      <div className="md:shadow-lg md:rounded-md md:border md:border-neutral-100">
        <div className="flex justify-between items-end bg-neutral-100 md:bg-transparent py-2 px-4 md:px-6 md:pt-6 md:pb-4">
          <p className="typography-headline-4 font-bold md:typography-headline-3">{title}</p>
        </div>
        <div className="px-4 pb-4 mt-3 md:px-6 md:pb-6 md:mt-0">
          <div className="flex justify-between typography-text-base pb-4">
            <div className="flex flex-col grow pr-2">
              <p>Items Subtotal</p>
            </div>
            <div className="flex flex-col text-right">
              <p>{cart.prices.subtotal_including_tax.value.toFixed(2)} {cart.prices.subtotal_including_tax.currency}</p>
            </div>
          </div>
          <div className="flex justify-between typography-headline-4 md:typography-headline-3 font-bold pb-4 mb-4 border-b border-neutral-200">
            <p>Total</p>
            <p>{cart.prices.grand_total.value.toFixed(2)} {cart.prices.grand_total.currency}</p>
          </div>
          <SfButton size="lg" className="w-full">
            Place Order And Pay
          </SfButton>
          <div className="typography-text-sm mt-4 text-center">
            By placing my order, you agree to our <SfLink href="#">Terms and Conditions</SfLink> and our{' '}
            <SfLink href="#">Privacy Policy.</SfLink>
          </div>
        </div>
      </div>
    </div>
  );
}

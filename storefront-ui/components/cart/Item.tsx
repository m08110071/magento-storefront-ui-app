import { SfButton, SfIconRemove, SfLink, SfIconAdd, SfIconSell, SfIconDelete } from '@storefront-ui/react';
import { useCounter } from 'react-use';
import { useId, ChangeEvent } from 'react';
import { clamp } from '@storefront-ui/shared';

export default function CartItem({item}) {
  const inputId = useId();
  const min = 1;
  const max = 10;
  const [value, { inc, dec, set }] = useCounter(min);
  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    const { value: currentValue } = event.target;
    const nextValue = parseFloat(currentValue);
    set(Number(clamp(nextValue, min, max)));
  }
  return (
    <div className="relative flex border-b-[1px] border-neutral-200 hover:shadow-lg min-w-[320px] max-w-[640px] p-4">
      <div className="relative overflow-hidden rounded-md w-[100px] sm:w-[176px]">
        <SfLink href="#">
          <img
            className="w-full h-auto border rounded-md border-neutral-200"
            src={item.product.small_image.url}
            alt="alt"
            width="300"
            height="300"
          />
        </SfLink>
      </div>
      <div className="flex flex-col pl-4 min-w-[180px] flex-1">
        <SfLink href="#" variant="secondary" className="no-underline typography-text-sm sm:typography-text-lg">
          {item.product.name}
        </SfLink>
      </div>
      <div className="items-center sm:mt-auto sm:flex">
        <span className="font-bold sm:ml-auto sm:order-1 typography-text-sm sm:typography-text-lg">{item.product.price_range.minimum_price.final_price.value.toFixed(2)} {item.product.price_range.minimum_price.final_price.currency}</span>
        <div className="flex items-center justify-between mt-4 sm:mt-0">
        <div className="flex border border-neutral-300 rounded-md">
        Qty: {item.quantity}
            </div>
        </div>
        </div>
    </div>
  );
}

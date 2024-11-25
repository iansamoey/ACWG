import React from 'react';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


interface ServiceItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ id, name, description, price }) => {
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id,
        name,
        price,
        quantity: 1,
      },
    });
  };

  return (
    <Card className="h-full flex flex-col justify-between transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-indigo-700">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-gray-700">${price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={addToCart} 
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceItem;


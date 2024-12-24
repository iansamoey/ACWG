import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';

interface ServiceItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ id, name, description, price }) => {
  const { dispatch } = useCart();
  const [pages, setPages] = useState(1);
  const [title, setTitle] = useState('');
  const [totalWords, setTotalWords] = useState(0);
  const [attachment, setAttachment] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const addToCart = async () => {
    let attachmentUrl = '';

    if (attachment) {
      const formData = new FormData();
      formData.append('file', attachment);

      try {
        const response = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('File upload failed');
        }

        const data = await response.json();
        attachmentUrl = data.fileUrl;
      } catch {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to upload file. Please try again.',
        });
        return;
      }
    }

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id,
        name,
        price: price * pages,
        quantity: 1,
        pages,
        title,
        totalWords,
        attachment: attachmentUrl,
      },
    });

    toast({
      title: "Added to Cart",
      description: `${name} has been added to your cart.`,
      duration: 3000,
    });
  };

  return (
    <Card className="h-full flex flex-col justify-between transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-indigo-700">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-2xl font-semibold text-gray-700">${(price * pages).toFixed(2)}</p>
        <div className="flex items-center">
          <label htmlFor={`pages-${id}`} className="mr-2">Pages:</label>
          <Input
            id={`pages-${id}`}
            type="number"
            min="1"
            value={pages}
            onChange={(e) => setPages(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor={`words-${id}`} className="mr-2">Total Words:</label>
          <Input
            id={`words-${id}`}
            type="number"
            min="0"
            value={totalWords}
            onChange={(e) => setTotalWords(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-20"
          />
        </div>
        <div>
          <label htmlFor={`title-${id}`} className="block mb-2">Description/Title:</label>
          <Textarea
            id={`title-${id}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            rows={3}
          />
        </div>
        <div>
          <label htmlFor={`attachment-${id}`} className="block mb-2">Attachment:</label>
          <Input
            id={`attachment-${id}`}
            type="file"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
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

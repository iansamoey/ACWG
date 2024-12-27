import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Upload } from 'lucide-react';

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
  const [totalWords, setTotalWords] = useState(250);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handlePagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPages = Math.max(0, parseInt(e.target.value) || 0);
    setPages(newPages);
    setTotalWords(newPages * 250);
  };

  const handleWordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWords = Math.max(0, parseInt(e.target.value) || 0);
    setTotalWords(newWords);
    setPages(Math.ceil(newWords / 250));
  };

  const addToCart = async () => {
    let attachmentUrl = '';

    if (attachment) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', attachment);

      try {
        const response = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'File upload failed');
        }

        const data = await response.json();
        attachmentUrl = data.fileUrl;
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to upload file. Please try again.',
        });
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
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
    <Card className="h-full flex flex-col justify-between transition-shadow hover:shadow-lg bg-gradient-to-br from-white to-gray-100">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">{name}</CardTitle>
        <CardDescription className="text-gray-200">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <Alert className="bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-blue-700">Word Count Information</AlertTitle>
          <AlertDescription className="text-blue-600">
            Each page contains approximately 250 words. Adjust either pages or total words to meet your requirements. For long descriptions please attach instructions.
          </AlertDescription>
        </Alert>
        <div className="flex justify-between items-center">
          <p className="text-3xl font-bold text-indigo-700">${(price * pages).toFixed(2)}</p>
          <div className="flex items-center space-x-2">
            <Input
              id={`pages-${id}`}
              type="number"
              min="0"
              value={pages}
              onChange={handlePagesChange}
              className="w-20 text-center"
            />
            <span className="text-gray-600">pages</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            id={`words-${id}`}
            type="number"
            min="0"
            value={totalWords}
            onChange={handleWordsChange}
            className="w-24 text-center"
          />
          <span className="text-gray-600">total words</span>
        </div>
        <div>
          <label htmlFor={`title-${id}`} className="block mb-2 font-medium text-gray-700">Description/Title:</label>
          <Textarea
            id={`title-${id}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            placeholder="Enter a brief description or title for your order"
          />
        </div>
        <div>
          <label htmlFor={`attachment-${id}`} className="block mb-2 font-medium text-gray-700">Attachment:</label>
          <div className="flex items-center space-x-2">
            <Input
              id={`attachment-${id}`}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById(`attachment-${id}`)?.click()}
              variant="outline"
              className="w-full flex items-center justify-center"
              disabled={isUploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? 'Uploading...' : attachment ? attachment.name : 'Choose file'}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 rounded-b-lg">
        <Button
          onClick={addToCart}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={pages === 0 || totalWords === 0 || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceItem;


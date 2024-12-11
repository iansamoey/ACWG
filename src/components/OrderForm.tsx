"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const OrderForm: React.FC = () => {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">Request a customized writing  Service</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="default">
          <AlertDescription className="text-center text-lg font-medium">
            Hold on, Coming soon :)
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default OrderForm;


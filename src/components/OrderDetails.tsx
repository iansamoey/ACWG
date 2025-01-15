import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface OrderDetailsProps {
  order: {
    _id: string;
    serviceName: string;
    description: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    paypalOrderId: string;
    paypalTransactionId: string;
    pages: number;
    totalWords: number;
    attachments: { filename: string; path: string }[];
  };
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="font-medium">Order ID</TableHead>
              <TableCell>{order._id}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Service</TableHead>
              <TableCell>{order.serviceName}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Description</TableHead>
              <TableCell>{order.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Pages</TableHead>
              <TableCell>{order.pages}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Total Words</TableHead>
              <TableCell>{order.totalWords}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Total</TableHead>
              <TableCell>${order.total.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Status</TableHead>
              <TableCell>
                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                  {order.status}
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Payment Status</TableHead>
              <TableCell>
                <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                  {order.paymentStatus}
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Created At</TableHead>
              <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">PayPal Order ID</TableHead>
              <TableCell>{order.paypalOrderId}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">PayPal Transaction ID</TableHead>
              <TableCell>{order.paypalTransactionId}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-medium">Attachments</TableHead>
              <TableCell>
                {order.attachments.map((attachment, index) => (
                  <div key={index}>{attachment.filename}</div>
                ))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetails;
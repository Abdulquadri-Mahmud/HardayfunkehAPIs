import Order from "../model/order.model.js";
import nodemailer from 'nodemailer';// Ensure you have your Order model imported

export const createOrder = async (req, res, next) => {
    const { 
      firstname,
      lastname,
      phone,
      email,
      state,
      city,
      address,
      items,
      orderId,
    } = req.body;
  
    try {
      const newOrder = new Order({
        firstname,
        lastname,
        phone,
        email,
        state,
        city,
        address,
        items,
        orderId,
      });
  
      await newOrder.save();
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      const itemsHtml = items.map((item) => `
        <tr>
          <td>${item.productName}</td> 
          <td>${item.quantity}</td>
          <td>${item.productPrice.toLocaleString()}</td>
          <td>${(item.quantity * item.productPrice).toLocaleString()}</td>
        </tr>
      `).join("");
  
      const total = items.reduce((sum, item) => sum + item.quantity * item.productPrice, 0);
  
      const buyerEmailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Order Confirmation - Faizany’s Clothing",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <header style="background-color: #2C3E50; color: #fff; padding: 20px; text-align: center;">
                <img src="https://yourbrandlogo.com/logo.png" alt="Faizany’s Clothing Logo" style="width: 120px; height: auto; margin-bottom: 10px;">
                <h1 style="margin: 0; font-size: 24px;">Thank You for Your Order!</h1>
              </header>
              <div style="padding: 20px;">
                <p>Dear <strong>${firstname} ${lastname}</strong>,</p>
                <p>Your order has been received. Here are the details:</p>
                <p><strong>Order Number:</strong> ${orderId}</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                  <thead>
                    <tr>
                      <th style="padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Product</th>
                      <th style="padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Qty</th>
                      <th style="padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Price</th>
                      <th style="padding: 8px; border: 1px solid #ddd; background-color: #f4f4f4;">Total</th>
                    </tr>
                  </thead>
                  <tbody>${itemsHtml}</tbody>
                </table>
                <p><strong>Grand Total:</strong> ${total.toLocaleString()}</p>
                <p><strong>Delivery Address:</strong> ${address}</p>
                <p><a href="https://faizanyclothing.com/track-order/${orderId}" style="display: inline-block; padding: 10px 20px; background-color: #27ae60; color: #fff; text-decoration: none; border-radius: 5px;">Track My Order</a></p>
                <p>Need help? Contact us at <a href="mailto:support@faizanyclothing.com">support@faizanyclothing.com</a>.</p>
              </div>
              <footer style="background-color: #f4f4f4; color: #666; text-align: center; padding: 10px;">
                <p>&copy; 2024 Faizany’s Clothing. All Rights Reserved.</p>
                <p><a href="https://faizanyclothing.com/review" style="color: #3498db;">Leave a Review</a> | <a href="https://faizanyclothing.com/returns" style="color: #3498db;">Return Policy</a></p>
                <p>Follow us: 
                  <a href="https://facebook.com/faizanyclothing" style="margin: 0 5px; color: #3498db;">Facebook</a> | 
                  <a href="https://instagram.com/faizanyclothing" style="margin: 0 5px; color: #3498db;">Instagram</a> | 
                  <a href="https://twitter.com/faizanyclothing" style="margin: 0 5px; color: #3498db;">Twitter</a>
                </p>
              </footer>
            </div>
          </div>
        `,
      };
  
      const ownerEmailOptions = {
        from: process.env.EMAIL,
        to: process.env.OWNER_EMAIL,
        subject: "New Order Received - Faizany’s Clothing",
        text: `New order received!
  
        Customer: ${firstname} ${lastname}
        Phone: ${phone}
        Email: ${email}
        Order Number: ${orderId}
        Total: ${total.toLocaleString()}
        `,
      };
  
      await transporter.sendMail(buyerEmailOptions);
      await transporter.sendMail(ownerEmailOptions);
  
      res.status(201).json({ 
        message: "Order created successfully and email sent", 
        order: newOrder,
      });
    } catch (err) {
      res.status(500).json({ 
        error: "Failed to create order or send email", 
        details: err,
      });
    }
};
  
  

export const OrderID = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ error: 'Order not found' });
        
        res.status(200).json(order);
      } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve order', details: err });
      }
}

// update order by id
export const updateOrder = async (req, res, next) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
        
        res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
      } catch (err) {
        res.status(500).json({ error: 'Failed to update order', details: err });
      }
}

export const deleteOrder = async (req, res, next) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        
        if (!deletedOrder) return res.status(404).json({ error: 'Order not found' });
        
        res.status(200).json({ message: 'Order deleted successfully' });
      } catch (err) {
        res.status(500).json({ error: 'Failed to delete order', details: err });
      }
}

export const allOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({}).sort({createdAt: 1});

        res.status(200).json(orders);

      } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve orders', details: err });
      }
}
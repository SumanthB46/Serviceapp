import { Request, Response } from 'express';
import { sendEmail } from '../../utils/email';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ message: 'Name, email, and message are required fields.' });
      return;
    }

    const emailContent = `
You have received a new contact form submission on Fixvo!

Details:
Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}
Subject: ${subject || 'No Subject'}

Message:
${message}
    `;

    // Send email to fixvoadmin@gmail.com
    await sendEmail({
      email: 'fixvoadmin@gmail.com',
      subject: `[Fixvo Contact] ${subject || 'New Inquiry from ' + name}`,
      message: emailContent,
    });

    res.status(200).json({ message: 'Contact form submitted successfully!' });
  } catch (error: any) {
    console.error('Contact Form Error:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
};

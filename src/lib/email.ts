import * as SibApiV3Sdk from '@sendinblue/client';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Configure API key authorization: api-key
const apiKey = process.env.BREVO_API_KEY;
if (apiKey) {
  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);
} else {
  throw new Error('BREVO_API_KEY is not defined in the environment variables.');
}

export async function sendWelcomeEmail(email: string, name: string) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "Welcome to Georgia Essays – Your Academic Journey Starts Here!";
  sendSmtpEmail.htmlContent = `
  <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="color: #2c3e50;">Welcome, ${name}!</h1>
      <p>We're thrilled to have you on board as part of our growing community of students and academics.</p>
      <p>
        Our platform is dedicated to assisting you with high-quality, tailored essays, research support, 
        and academic guidance to help you succeed.
      </p>
      <h3>Here’s how to make the most of your Georgia Essays experience:</h3>
      <ul>
        <li><strong>Explore Services:</strong> Find expert help tailored to your specific needs.</li>
        <li><strong>Stay Updated:</strong> Check your dashboard for resources, deadlines, and offers.</li>
        <li><strong>Get Writing Support:</strong> Need personalized assistance? Our team is just a click away.</li>
      </ul>
      <p>
        Ready to get started? 
        <a href="https://georgiaessays.com/login" style="color: #3498db; text-decoration: none;">Log in and start your journey toward academic excellence</a>.
      </p>
      <p>Thank you for choosing Georgia Essays. We look forward to supporting your academic success!</p>
      <br/>
      <p>Warm regards,</p>
      <p><strong>The Georgia Essays Team</strong></p>
      <hr style="border: none; border-top: 1px solid #ccc;"/>
      <p style="font-size: 12px; color: #999;">
        Need help? Contact us at <a href="mailto:essaysgeorgia@gmail.com">essaysgeorgia@gmail.com</a>.
      </p>
    </body>
  </html>`;

  sendSmtpEmail.sender = { name: "Georgia Essays", email: "essaysgeorgia@gmail.com" };
  sendSmtpEmail.to = [{ email: email, name: name }];

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully. Response:', response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

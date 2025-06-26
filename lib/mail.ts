import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'yandex',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendConfirmationEmail = async (email: string, token: string) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/confirm?token=${token}`

  const mailOptions = {
    from: `"ClimaTrade" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Подтверждение заказа',
    html: `
      <h2>Спасибо за заказ!</h2>
      <p>Пожалуйста, подтвердите ваш заказ по ссылке ниже:</p>
      <a href="${url}">Подтвердить заказ</a>
    `,
  }

  await transporter.sendMail(mailOptions)
}

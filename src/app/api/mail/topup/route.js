import { sendMail } from "@/lib/sendMail";
import { NextResponse } from "next/server";

const support_email = process.env.SUPPORT_EMAIL;

export async function POST(req) {
  try {
    const {
      paymentStatus,
      userEmail,
      message,
      payerName,
      userName,
      updatedBalance,
      transactionId,
      paymentGateway,
      amount,
      locale,
    } = await req.json();

    const balance = Number(updatedBalance);

    let mailData;
    if (paymentStatus === "COMPLETED") {
      if (locale === " de") {
        mailData = {
          subject: "Top-up erfolgreich.",
          payerName,
          userName,
          email: userEmail,
          transactionId,
          paymentGateway,
          amount,
          message: `Ihr Guthaben wurde erfolgreich aufgeladen. Ihr aktueller Kontostand beträgt ${
            process.env.NEXT_PUBLIC_CURRENCY_SYMBOL
          } ${balance.toFixed(
            2
          )}.<br>Vielen Dank, dass Sie unseren Service nutzen! Bei Fragen wenden Sie sich bitte an <a href="mailto:${support_email}">${support_email}</a>.
          `,
        };
      } else {
        mailData = {
          subject: "Topup successfull.",
          payerName,
          userName,
          email: userEmail,
          transactionId,
          paymentGateway,
          amount,
          message: `Your top-up has been processed successfully. Your current balance is ${
            process.env.NEXT_PUBLIC_CURRENCY_SYMBOL
          } ${balance.toFixed(
            2
          )}.<br>Thank you for using our service! For any questions, contact us at <a href="mailto:${support_email}">${support_email}</a>.
                        `,
        };
      }
    } else {
      if (locale === " de") {
        mailData = {
          subject: "Aufladung fehlgeschlagen",
          payerName,
          userName,
          paymentGateway,
          email: userEmail,
          amount,
          transactionId,
          message: `Leider war Ihr Aufladeversuch nicht erfolgreich. ${message} Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support für Unterstützung.<br>
                    Bei Fragen erreichen Sie uns unter <a href="mailto:${support_email}">${support_email}</a>.<br>
                    Wir entschuldigen uns für die entstandenen Unannehmlichkeiten.`,
        };
      } else {
        mailData = {
          subject: "Top-up Failed",
          payerName,
          userName,
          paymentGateway,
          email: userEmail,
          amount,
          transactionId,
          message: `Unfortunately, your top-up attempt was unsuccessful. ${message} Please try again later or contact support for assistance.<br>
            For any questions, reach out to us at <a href="mailto:${support_email}">${support_email}</a>.<br>
            We apologize for the inconvenience caused.`,
        };
      }
    }
    await sendMailToCustomer(mailData, locale);
    return NextResponse.json(
      {
        success: true,
        message: "Mail has been sent to user.",
      },
      { status: "200" }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send an email to customer about topup.",
      },
      { status: 500 }
    );
  }
}

async function sendMailToCustomer(data, locale) {
  try {
    let message = `
    <br>Hi <b>${data?.userName}!</b>
    <br><br>Transaction ID: ${data?.transactionId}
    <br>Payer Name: ${data?.payerName}
    <br>Payment Gateway: ${data?.paymentGateway}
    <br>Amount: ${data?.amount}
    <br><br>${data?.message}
    <br><br>Best Regards, <br>25 Euro Löschung
  `;
    if (locale === "de") {
      message = `
    <br>Hallo <b>${data?.userName}!</b>
    <br><br>Transaktions-ID: ${data?.transactionId}
    <br>Zahlername: ${data?.payerName}
    <br>Zahlungsmethode: ${data?.paymentGateway}
    <br>Betrag: ${data?.amount}
    <br><br>${data?.message}
    <br><br>Mit freundlichen Grüßen, <br>25 Euro Löschung
  `;
    }

    const result = await sendMail(data?.email, data?.subject, message);
    return result;
  } catch (error) {
    console.error(error);
  }
}

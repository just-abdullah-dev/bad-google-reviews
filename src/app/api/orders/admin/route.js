import { ssDatabase, ssUsers } from "@/lib/app_write_server";
import { sendMail } from "@/lib/sendMail";
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";

const db_id = process.env.APPWRITE_DB_ID;
const collection_id = process.env.APPWRITE_ORDERS_C_ID;
const support_email = process.env.SUPPORT_EMAIL;

const allowedOrigins = [
  "https://bad-google-reviews.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

export async function OPTIONS(req) {
  const origin = req.headers.get("origin");

  if (allowedOrigins.includes(origin)) {
    return NextResponse.json(
      {},
      {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }

  return NextResponse.json({ message: "CORS not allowed" }, { status: 403 });
}

export async function GET(req) {
  try {
    const response = await ssDatabase.listDocuments(db_id, collection_id);

    return NextResponse.json(
      {
        success: true,
        data: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while fetching all users orders:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    // console.log("DB_ID:", db_id, "COLLECTION_ID:", collection_id);
    if (req.headers.get("content-type") !== "application/json") {
      return NextResponse.json(
        { success: false, message: "Invalid content type" },
        { status: 400 }
      );
    }
    const origin = req.headers.get("origin");

    if (allowedOrigins.includes(origin)) {
      const body = await req.json();
      const { orderId, status, deletedNoOfReviews } = body;

      const orders = await ssDatabase.listDocuments(db_id, collection_id, [
        Query.equal("$id", orderId),
      ]);
      const order = orders?.documents[0];
      if (!order) {
        return NextResponse.json(
          {
            success: false,
            message: "No order was found.",
          },
          { status: 404 }
        );
      }
      let data = {
        status,
      };

      if (status === "fulfilled" || status === "partially-fulfilled") {
        data = {
          status,
          finalCost:
            process.env.NEXT_PUBLIC_PRICE_PER_REVIEW *
            Number(deletedNoOfReviews),
          deletedNoOfReviews: Number(deletedNoOfReviews),
        };
      }
      const response = await ssDatabase.updateDocument(
        db_id,
        collection_id,
        order?.$id,
        data
      );

      const user = await ssUsers.get(order.userId);

      // send mail to user according type of status
      // total type of statuses: pending, unfulfilled, fulfilled, cancelled, submitted-to-google, partially-fulfilled
      let mailData = {
        fullName: user.name,
        email: user.email,
        orderId: order?.$id,
        message: "",
      };

      switch (status) {
        case "pending":
          mailData = {
            ...mailData,
            message: `
              Thank you for reaching out. Your request is currently <b>pending</b>. 
              We're reviewing it and will update you shortly. For any questions, 
              contact us at <a href="mailto:${support_email}">${support_email}</a>.
            `,
          };
          break;

        case "unfulfilled":
          mailData = {
            ...mailData,
            message: `
              Your request is currently <b>unfulfilled</b>. We are actively working on it and will update you once it's completed. If you need assistance, contact us at <a href="mailto:${support_email}">${support_email}</a>.
            `,
          };
          break;

        case "fulfilled":
          mailData = {
            ...mailData,
            message: `
                Good news! Your request has been <b>fulfilled</b>. If you have further questions, feel free to reach out at <a href="mailto:${support_email}">${support_email}</a>.
              `,
          };
          break;

        case "cancelled":
          mailData = {
            ...mailData,
            message: `
                  Your request has been <b>cancelled</b>. If you believe this was a mistake, please get in touch with us at <a href="mailto:${support_email}">${support_email}</a>.
                `,
          };
          break;

        case "submitted-to-google":
          mailData = {
            ...mailData,
            message: `
                    Your request has been <b>submitted to Google</b> for further processing. We'll update you soon. For any questions, reach out at <a href="mailto:${support_email}">${support_email}</a>.
                  `,
          };
          break;
        case "partially-fulfilled":
          mailData = {
            ...mailData,
            message: `
                       Your request has been <b>partially fulfilled</b>. Total ${deletedNoOfReviews} reviews has been deleted. For any assistance, please contact us at <a href="mailto:${support_email}">${support_email}</a>.
                    `,
          };
          break;

        default:
          break;
      }

      await sendMailToCustomer(mailData);
      return NextResponse.json(
        {
          success: true,
          message: "Order status has been updated.",
        },
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": origin,
          },
        }
      );
    }

    return NextResponse.json({ message: "CORS not allowed" }, { status: 403 });
  } catch (error) {
    console.error("Error updating order document:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

async function sendMailToCustomer(data) {
  try {
    const message = `
  <br>Hi <b>${data?.fullName}!</b>
  <br><br>Your order id: ${data?.orderId}
  <br><br>${data?.message}
  <br><br>Best Regards, <br>25 Euro Loeschung
`;

    const result = await sendMail(data?.email, `Update on order!`, message);
    return result;
  } catch (error) {
    console.error(error);
  }
}

import { ssDatabase, ssUsers } from "@/lib/app_write_server";
import { sendMail } from "@/lib/sendMail";
import { NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";


const db_id = process.env.APPWRITE_DB_ID;
const collection_id = process.env.APPWRITE_ORDERS_C_ID;
const support_email = process.env.SUPPORT_EMAIL;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }
    const response = await ssDatabase.listDocuments(db_id, collection_id, [
      Query.equal("userId", userId),
    ]);
    return NextResponse.json(
      {
        success: true,
        data: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while fetching user orders: ", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      userId,
      googleMapLink,
      noOfReviews,
      reviewSelectionOpt,
      reviewLinks,
      totalCost,
    } = body;
    if (
      !userId ||
      !googleMapLink ||
      !noOfReviews ||
      !reviewSelectionOpt ||
      !totalCost
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Required feild is missing. [ userId, googleMapLink, noOfReviews, reviewSelectionOpt, totalCost ]",
        },
        { status: 400 }
      );
    }

    const response = await ssDatabase.createDocument(
      db_id,
      collection_id,
      ID.unique(),
      {
        userId,
        googleMapLink,
        noOfReviews: Number(noOfReviews),
        reviewSelectionOpt,
        reviewLinks: reviewLinks ? reviewLinks : "",
        totalCost: Number(totalCost),
      }
    );
    
    const user = await ssUsers.get(userId)

    // mail here
    let mailData = {
      fullName: user.name,
      email: user.email,
      orderId: response?.$id,
      message: `
              Thank you for reaching out. Your request is currently <b>pending</b>. 
              We're reviewing it and will update you shortly. For any questions, 
              contact us at <a href="mailto:${support_email}">${support_email}</a>.
            `,
    };
    await sendMailToCustomer(mailData);
    return NextResponse.json(
      {
        success: true,
        data: response,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while creating order document:", error);
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

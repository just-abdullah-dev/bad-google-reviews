import { ssDatabase } from "@/lib/app_write_server";
import { NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

const db_id = process.env.APPWRITE_DB_ID;
const collection_id = process.env.APPWRITE_ORDERS_C_ID;

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
      // console.log(response);
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

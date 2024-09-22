import { ssDatabase } from "@/lib/app_write_server";
import { NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

const db_id = process.env.APPWRITE_DB_ID;
const collection_id = process.env.APPWRITE_ORDERS_C_ID;

export async function GET(req) {
  try {
    const response = await ssDatabase.listDocuments(db_id, collection_id, 
    //   [
    //   Query.notEqual("status", ["fulfilled", "partially"])
    // ]
  );

    return NextResponse.json(
      {
        success: true,
        data: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while fetching all orders:", error);
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
    const body = await req.json();
    const { userId, orderId, status, noOfReviews } = body;
    //continue from here
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }
    const balanceData = await ssDatabase.listDocuments(db_id, collection_id, [
      Query.equal("userId", userId),
    ]);
    const existedBalance = balanceData?.documents[0];
    if (!existedBalance) {
      return NextResponse.json(
        {
          success: false,
          message: "User do not have registered balance data.",
        },
        { status: 400 }
      );
    }

    const response = await ssDatabase.updateDocument(
      db_id,
      collection_id,
      existedBalance?.$id,
      {
        balance: balance !== "" ? Number(balance) : existedBalance?.balance,
        reservedAmount:
          reservedAmount !== ""
            ? Number(reservedAmount)
            : existedBalance?.reservedAmount,
      }
    );
    return NextResponse.json(
      {
        success: true,
        data: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating balance document:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}


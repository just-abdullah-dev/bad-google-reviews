import { ssDatabase } from "@/lib/app_write_server";
import { NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

const db_id = process.env.APPWRITE_DB_ID;
const collection_id = process.env.APPWRITE_BALANCE_C_ID;

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
    if (response?.total === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "no document was found!",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: response?.documents[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting balance document by user id:", error);
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
    const { userId, balance, reservedAmount } = body;
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

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId } = body;
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

    if (balanceData?.documents[0]) {
      return NextResponse.json(
        {
          success: false,
          message: "User already have registered balance data.",
        },
        { status: 409 } // Conflict status
      );
    }

    const response = await ssDatabase.createDocument(
      db_id,
      collection_id,
      ID.unique(),
      {
        userId: userId,
        balance: 25.0,
        reservedAmount: 0.0,
      }
    );
    return NextResponse.json(
      {
        success: true,
        data: response,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating balance document:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

import { ssDatabase } from "@/lib/app_write_server";
import { NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

const db_id = process.env.APPWRITE_DB_ID;
const collection_id = process.env.APPWRITE_BALANCE_C_ID;

export async function PUT(req) {
  try {
    const body = await req.json();
    // here balance is the deducting amount
    const { userId, balance, onlyRemoveFromReserevedAmount } = body;
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
    let data = {
      balance: existedBalance?.balance - Number(balance),
      reservedAmount: existedBalance?.reservedAmount - Number(balance),
    };
    if (onlyRemoveFromReserevedAmount === "yes") {
      data = {
        reservedAmount: existedBalance?.reservedAmount - Number(balance),
      };
    }
    const response = await ssDatabase.updateDocument(
      db_id,
      collection_id,
      existedBalance?.$id,
      data
    );
    return NextResponse.json(
      {
        success: true,
        data: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while deducting user balance:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

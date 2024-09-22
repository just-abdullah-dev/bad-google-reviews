import { ssDatabase } from "@/lib/app_write_server";
import { NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

const db_id = process.env.APPWRITE_DB_ID;
const collection_id = process.env.APPWRITE_ORDERS_C_ID;

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

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, googleMapLink, noOfReviews, reviewSelectionOpt, reviewLinks, totalCost } = body;
    if (!userId || !googleMapLink || !noOfReviews || !reviewSelectionOpt || !totalCost) {
      return NextResponse.json(
        {
          success: false,
          message: "Required feild is missing. [ userId, googleMapLink, noOfReviews, reviewSelectionOpt, totalCost ]",
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
        totalCost: Number(totalCost)
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
